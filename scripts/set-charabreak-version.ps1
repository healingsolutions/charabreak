param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^\d+\.\d+\.\d+([-.][A-Za-z0-9]+)?$')]
    [string] $Version
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Update-TextFile([string] $Path, [scriptblock] $Transform) {
    $text = [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
    $newText = & $Transform $text
    if ($newText -ne $text) {
        [System.IO.File]::WriteAllText($Path, $newText, $utf8NoBom)
        Write-Host "Updated $Path"
    }
}

$pluginFile = Join-Path $root "charabreak\charabreak.php"
$readmeFile = Join-Path $root "charabreak\readme.txt"
$jsDir = Join-Path $root "charabreak\assets\js"

Update-TextFile $pluginFile {
    param($text)
    $text = [regex]::Replace($text, '(^\s*\*\s*Version:\s*)(.+)$', "`${1}$Version", [System.Text.RegularExpressions.RegexOptions]::Multiline)
    $text = [regex]::Replace($text, "define\(\s*'GAMING_WEB_VERSION'\s*,\s*'[^']+'\s*\)", "define('GAMING_WEB_VERSION', '$Version')")
    return $text
}

Update-TextFile $readmeFile {
    param($text)
    $text = [regex]::Replace($text, '(^Stable tag:\s*)(.+)$', "`${1}$Version", [System.Text.RegularExpressions.RegexOptions]::Multiline)
    return $text
}

Get-ChildItem -LiteralPath $jsDir -Filter "*.js" -File -Recurse |
    ForEach-Object {
        Update-TextFile $_.FullName {
            param($text)
            return [regex]::Replace($text, '\?v=\d+\.\d+\.\d+([-.][A-Za-z0-9]+)?', "?v=$Version")
        }
    }

Write-Host "CharaBreak version set to $Version."

