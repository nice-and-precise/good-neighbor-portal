# Branch Protection Automation

This repository includes a workflow that applies branch protection and required status checks on the main branch using an admin token.

Workflow file: `.github/workflows/apply-branch-protection.yml`

## What it does
- Protects the target branch (default `main`)
- Enforces:
  - Require pull request before merging
  - Require status checks to pass with strict up-to-date branch
  - 1+ approval, dismiss stale reviews, require Code Owners
  - Linear history, conversation resolution
  - Disables force pushes and branch deletions
- Determines required checks automatically from recent GitHub Actions check runs, or uses a manual override list

## How to run
- It auto-runs on push when the workflow file changes
- You can run it manually from the Actions tab → "Apply Branch Protection" → "Run workflow"
  - Optional inputs:
    - `branch`: branch to protect (default: `main`)
    - `required_checks`: comma-separated list of check names to require (overrides auto-detect)

Examples of `required_checks` values:
- `CI / e2e-willmar, CI / e2e-kandiyohi`
- `PHP E2E`

Tip: Use the exact check run names as shown on the PR Checks tab.

## Prerequisite
A fine-grained PAT stored as a repository secret named `REPO_ADMIN_TOKEN` with at least:
- Repository → Administration: Read & write
- Repository → Actions: Read (Write optional)
- Repository → Contents: Read

## Verify settings
- Settings → Branches → Branch protection rules → Select your branch
- Or check the run summary for the workflow (it prints a JSON summary of the applied protection)

## Troubleshooting
- No required checks detected: The workflow polls for up to 5 minutes. If your CI hasn’t run on the latest commit, re-run the workflow later or provide `required_checks` manually.
- 403 or 404 from API: Ensure the token has Administration permission and repo access.
- Matrix jobs: Each matrix job often has a unique check run name; include each one explicitly in `required_checks` if needed.

## Cleanup
- After protection is applied and verified, you may revoke the token or remove the secret. Re-run the workflow in the future if rules need adjustments.