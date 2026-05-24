# Project Agent Notes

## Release Shortcuts

- When the user says `ok git`, prepare the current work for GitHub:
  - inspect `git status`,
  - run relevant syntax/package checks,
  - stage intentional project changes,
  - commit with a clear message,
  - push the current branch when credentials/network allow.
  - The helper script is `scripts/ok-git.ps1`.

- When the user says `ok freemius`, publish the current CharaBreak package to Freemius:
  - verify plugin/readme versions,
  - build `exports/charabreak.zip`,
  - confirm the ZIP contains only `charabreak/`,
  - upload it to Freemius product `30130`,
  - release it unless the user asks for beta/pending.
  - The helper script is `scripts/ok-freemius.ps1`.

## Secret Handling

- Never commit Freemius tokens, API keys, license keys, or customer data.
- Use environment variables for Freemius:
  - `FREEMIUS_API_TOKEN`
  - optional `FREEMIUS_PRODUCT_ID`
- Do not print the full token in terminal output or final responses.

