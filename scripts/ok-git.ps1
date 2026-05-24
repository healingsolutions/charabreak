param(
    [string] $Message,
    [switch] $NoPush,
    [switch] $SkipPackage
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")
Set-Location -LiteralPath $root

$pluginFile = Join-Path $root "charabreak\charabreak.php"
if (-not (Test-Path -LiteralPath $pluginFile)) {
    throw "Missing charabreak/charabreak.php."
}

$pluginText = [System.IO.File]::ReadAllText($pluginFile, [System.Text.Encoding]::UTF8)
$match = [regex]::Match($pluginText, '^\s*\*\s*Version:\s*(.+)$', [System.Text.RegularExpressions.RegexOptions]::Multiline)
if (-not $match.Success) {
    throw "Could not detect plugin version."
}

$version = $match.Groups[1].Value.Trim()
if ([string]::IsNullOrWhiteSpace($Message)) {
    $Message = "Release CharaBreak $version"
}

Write-Host "Running Git whitespace check..."
& git diff --check -- . ':(exclude)charabreak/vendor/freemius'
if ($LASTEXITCODE -ne 0) {
    throw "git diff --check failed."
}

if (-not $SkipPackage) {
    Write-Host "Building package before commit..."
    & powershell -ExecutionPolicy Bypass -File (Join-Path $root "scripts\build-charabreak-zip.ps1")
    if ($LASTEXITCODE -ne 0) {
        throw "Package build failed."
    }
}

$statusBefore = & git status --porcelain
if (-not $statusBefore) {
    Write-Host "No changes to commit."
    exit 0
}

Write-Host "Staging changes..."
& git add -A
if ($LASTEXITCODE -ne 0) {
    throw "git add failed."
}

$staged = & git diff --cached --name-only
if (-not $staged) {
    Write-Host "No staged changes to commit."
    exit 0
}

Write-Host "Creating commit: $Message"
& git commit -m $Message
if ($LASTEXITCODE -ne 0) {
    throw "git commit failed."
}

if ($NoPush) {
    Write-Host "NoPush was set. Skipping git push."
    exit 0
}

$branch = (& git branch --show-current).Trim()
if ([string]::IsNullOrWhiteSpace($branch)) {
    throw "Could not determine current branch."
}

Write-Host "Pushing branch $branch..."
& git push origin $branch
if ($LASTEXITCODE -ne 0) {
    throw "git push failed."
}

Write-Host "Git release complete."

