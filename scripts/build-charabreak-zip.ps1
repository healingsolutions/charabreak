param(
    [string] $OutputDir = "exports",
    [string] $ZipName = "charabreak.zip"
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")
$pluginDir = Join-Path $root "charabreak"
$outputPath = Join-Path $root $OutputDir
$zipPath = Join-Path $outputPath $ZipName

if (-not (Test-Path -LiteralPath (Join-Path $pluginDir "charabreak.php"))) {
    throw "charabreak/charabreak.php was not found."
}

New-Item -ItemType Directory -Path $outputPath -Force | Out-Null

if (Test-Path -LiteralPath $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourceRoot = Resolve-Path -LiteralPath $pluginDir
$compression = [System.IO.Compression.CompressionLevel]::Optimal
$archive = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)

try {
    Get-ChildItem -LiteralPath $pluginDir -File -Recurse -Force |
        Where-Object {
            $relative = $_.FullName.Substring($sourceRoot.Path.Length).TrimStart("\", "/")
            $segments = $relative -split '[\\/]'
            -not (
                $segments -contains "_notes" -or
                $segments -contains "_tmp" -or
                $segments -contains "_generated" -or
                $segments -contains "scripts"
            )
        } |
        ForEach-Object {
            $relative = $_.FullName.Substring($sourceRoot.Path.Length).TrimStart("\", "/")
            $entryName = "charabreak/" + ($relative -replace "\\", "/")
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $entryName, $compression) | Out-Null
        }
} finally {
    $archive.Dispose()
}

Write-Host "Created $zipPath"
