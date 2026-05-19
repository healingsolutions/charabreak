param(
    [string] $Url = "http://localhost:8089",
    [string] $Title = "Gaming Web Demo",
    [string] $AdminUser = "admin",
    [string] $AdminPassword = "password",
    [string] $AdminEmail = "admin@example.test"
)

$ErrorActionPreference = "Stop"

Write-Host "Starting Docker services..."
docker compose up -d

Write-Host "Checking WordPress installation..."
docker compose run --rm wpcli core is-installed
$installed = $LASTEXITCODE -eq 0

if (-not $installed) {
    Write-Host "Installing WordPress..."
    docker compose run --rm wpcli core install --url="$Url" --title="$Title" --admin_user="$AdminUser" --admin_password="$AdminPassword" --admin_email="$AdminEmail" --skip-email
}

Write-Host "Activating Gaming Web plugin..."
docker compose run --rm wpcli plugin activate gaming-web

Write-Host "Seeding demo content..."
docker compose run --rm wpcli eval-file /var/www/html/wp-content/plugins/gaming-web/scripts/seed-demo.php

Write-Host ""
Write-Host "Gaming Web local site is ready:"
Write-Host "Site:  $Url"
Write-Host "Admin: $Url/wp-admin"
Write-Host "Login: $AdminUser / $AdminPassword"
