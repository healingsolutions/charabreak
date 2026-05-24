# CharaBreak Release Workflow

This project uses two release shortcuts:

- `ok git`: commit and push the latest source changes to GitHub.
- `ok freemius`: build and publish the latest `charabreak.zip` package to Freemius.

## Required Freemius Token

Freemius product deployment uses Bearer token authentication. Create the token in the Freemius Developer Dashboard:

1. Open the CharaBreak product.
2. Go to Settings.
3. Open the API Token tab.
4. Copy the API Bearer Authorization Token.

Store it outside Git.

For the current terminal session:

```powershell
$env:FREEMIUS_API_TOKEN = "paste-token-here"
```

Or save it for the Windows user:

```powershell
[Environment]::SetEnvironmentVariable("FREEMIUS_API_TOKEN", "paste-token-here", "User")
```

The product ID defaults to `30130`. You can override it if needed:

```powershell
$env:FREEMIUS_PRODUCT_ID = "30130"
```

## Version Bump

Before publishing a new public build, bump the plugin version.

```powershell
.\scripts\set-charabreak-version.ps1 -Version 0.2.29
```

This updates:

- `charabreak/charabreak.php`
- `charabreak/readme.txt`
- ES module cache query versions in `charabreak/assets/js/*.js`

Then edit the changelog in `charabreak/readme.txt` if the release needs public notes.

## GitHub Release Flow

From the repository root:

```powershell
.\scripts\ok-git.ps1 -Message "Release CharaBreak 0.2.29"
```

Useful options:

```powershell
.\scripts\ok-git.ps1 -NoPush
.\scripts\ok-git.ps1 -SkipPackage
```

## Freemius Release Flow

Dry-run first:

```powershell
.\scripts\ok-freemius.ps1 -DryRun
```

Publish as released:

```powershell
.\scripts\ok-freemius.ps1
```

Publish as pending or beta:

```powershell
.\scripts\ok-freemius.ps1 -ReleaseMode pending
.\scripts\ok-freemius.ps1 -ReleaseMode beta
```

The script builds `exports/charabreak.zip`, validates the archive, uploads it to:

```text
POST /products/30130/tags.json
```

Then, unless `-ReleaseMode pending` is used, it updates the deployment:

```text
PUT /products/30130/tags/{tag_id}.json
```

## Safety Rules

- Never put `FREEMIUS_API_TOKEN` in `.env`, README, screenshots, or commits.
- Always upload the generated `exports/charabreak.zip`, not GitHub's automatic source ZIP.
- The ZIP must contain `charabreak/charabreak.php` and `charabreak/readme.txt`.
- The ZIP must not contain the old `gaming-web/` folder.
- Keep the ZIP filename fixed as `charabreak.zip`.

