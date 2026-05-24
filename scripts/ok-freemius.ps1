param(
    [string] $ProductId = $env:FREEMIUS_PRODUCT_ID,
    [string] $ApiToken = $env:FREEMIUS_API_TOKEN,
    [ValidateSet("released", "beta", "pending")]
    [string] $ReleaseMode = "released",
    [switch] $DryRun
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($ProductId)) {
    $ProductId = "30130"
}

$root = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")
$pluginFile = Join-Path $root "charabreak\charabreak.php"
$readmeFile = Join-Path $root "charabreak\readme.txt"
$zipPath = Join-Path $root "exports\charabreak.zip"

function Read-Utf8File([string] $Path) {
    return [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
}

function Get-RequiredMatch([string] $Text, [string] $Pattern, [string] $Label) {
    $match = [regex]::Match($Text, $Pattern, [System.Text.RegularExpressions.RegexOptions]::Multiline)
    if (-not $match.Success) {
        throw "$Label was not found."
    }
    return $match.Groups[1].Value.Trim()
}

if (-not (Test-Path -LiteralPath $pluginFile)) {
    throw "Missing charabreak/charabreak.php."
}

if (-not (Test-Path -LiteralPath $readmeFile)) {
    throw "Missing charabreak/readme.txt. Freemius requires this file."
}

$pluginText = Read-Utf8File $pluginFile
$readmeText = Read-Utf8File $readmeFile

$pluginVersion = Get-RequiredMatch $pluginText '^\s*\*\s*Version:\s*(.+)$' "Plugin header version"
$constantVersion = Get-RequiredMatch $pluginText "define\(\s*'GAMING_WEB_VERSION'\s*,\s*'([^']+)'\s*\)" "GAMING_WEB_VERSION"
$stableTag = Get-RequiredMatch $readmeText '^Stable tag:\s*(.+)$' "readme.txt Stable tag"

if ($pluginVersion -ne $constantVersion) {
    throw "Version mismatch: plugin header is $pluginVersion but GAMING_WEB_VERSION is $constantVersion."
}

if ($pluginVersion -ne $stableTag) {
    throw "Version mismatch: plugin header is $pluginVersion but readme.txt Stable tag is $stableTag."
}

foreach ($tag in @("Requires at least:", "Tested up to:", "Stable tag:")) {
    if ($readmeText -notmatch [regex]::Escape($tag)) {
        throw "readme.txt is missing '$tag'."
    }
}

Write-Host "Building package for CharaBreak $pluginVersion..."
& powershell -ExecutionPolicy Bypass -File (Join-Path $root "scripts\build-charabreak-zip.ps1")
if ($LASTEXITCODE -ne 0) {
    throw "Package build failed."
}

if (-not (Test-Path -LiteralPath $zipPath)) {
    throw "Expected package was not created: $zipPath"
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$archive = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
try {
    $names = @($archive.Entries | ForEach-Object { $_.FullName })

    foreach ($entry in @("charabreak/charabreak.php", "charabreak/readme.txt", "charabreak/vendor/freemius/start.php")) {
        if ($names -notcontains $entry) {
            throw "ZIP is missing $entry."
        }
    }

    if (($names | Where-Object { $_ -like "gaming-web/*" }).Count -gt 0) {
        throw "ZIP still contains the old gaming-web folder."
    }

    if (($names | Where-Object { $_ -match "\\" }).Count -gt 0) {
        throw "ZIP contains non-standard Windows path separators."
    }
} finally {
    $archive.Dispose()
}

Write-Host "Package validated: $zipPath"

if ($DryRun) {
    Write-Host "Dry run complete. Freemius upload was skipped."
    Write-Host "Product: $ProductId"
    Write-Host "Release mode: $ReleaseMode"
    exit 0
}

if ([string]::IsNullOrWhiteSpace($ApiToken)) {
    throw "FREEMIUS_API_TOKEN is not set. Set it in the environment before running this script."
}

$curl = Get-Command curl.exe -ErrorAction SilentlyContinue
if (-not $curl) {
    throw "curl.exe was not found. It is required for multipart upload on Windows PowerShell."
}

$apiBase = "https://api.freemius.com/v1"
$zipForCurl = (Resolve-Path -LiteralPath $zipPath).Path -replace "\\", "/"
$uploadUrl = "$apiBase/products/$ProductId/tags.json"

Write-Host "Uploading to Freemius product $ProductId..."
$uploadArgs = @(
    "-sS",
    "-X", "POST",
    $uploadUrl,
    "-H", "Authorization: Bearer $ApiToken",
    "-F", "file=@$zipForCurl;type=application/zip"
)

$uploadResponse = & $curl.Source @uploadArgs
if ($LASTEXITCODE -ne 0) {
    throw "Freemius upload request failed."
}

try {
    $uploadJson = $uploadResponse | ConvertFrom-Json
} catch {
    throw "Freemius upload did not return JSON: $uploadResponse"
}

$tagId = $uploadJson.id
if (-not $tagId -and $uploadJson.tag) {
    $tagId = $uploadJson.tag.id
}

if (-not $tagId) {
    throw "Freemius upload response did not include a tag id: $uploadResponse"
}

Write-Host "Uploaded deployment tag id: $tagId"

if ($ReleaseMode -eq "pending") {
    Write-Host "Release mode is pending. Deployment was uploaded but not released."
    exit 0
}

$releaseUrl = "$apiBase/products/$ProductId/tags/$tagId.json"
$releaseBody = @{ release_mode = $ReleaseMode } | ConvertTo-Json -Compress

Write-Host "Updating Freemius deployment to '$ReleaseMode'..."
$releaseArgs = @(
    "-sS",
    "-X", "PUT",
    $releaseUrl,
    "-H", "Authorization: Bearer $ApiToken",
    "-H", "Content-Type: application/json",
    "-d", $releaseBody
)

$releaseResponse = & $curl.Source @releaseArgs
if ($LASTEXITCODE -ne 0) {
    throw "Freemius release request failed."
}

try {
    $releaseJson = $releaseResponse | ConvertFrom-Json
} catch {
    throw "Freemius release did not return JSON: $releaseResponse"
}

Write-Host "Freemius deployment published."
Write-Host ("Version: {0}" -f $pluginVersion)
Write-Host ("Tag ID: {0}" -f $tagId)

