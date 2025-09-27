# Contributing Guide

This project uses GitHub Spec Kit for Spec-Driven Development. Please follow the workflow and standards below.

## Branching and Pull Requests

- Default branch: `main`
- Create a feature branch for each unit of work: `ci/<topic>`, `feat/<area>`, `fix/<bug>`, `docs/<topic>`
- Prefer PRs for any change that affects:
	- User-facing behavior (API or UI)
	- Data model/schema
	- CI/configuration and scripts
	- Docs/specs/plans (to maintain review history)
- Direct commits to `main` are acceptable for:
	- Minor docs typos or comment fixes
	- Non-functional tweaks to CI that don’t change behavior (rare)
	- Emergency hotfixes (follow with a PR documenting the change)

## PR Quality Gates

Each PR should:
- Reference related docs (`docs/spec.md`, `docs/plan.md`, `docs/tasks.md`) where applicable
- Include a concise description and risk/impact notes
- Pass CI (required checks):
	- PHP E2E suite (8.1, 8.2)
	- Negative, smoke, and unit tests
- Follow the Definition of Done:
	- Updated docs/spec/tasks if behavior changed
	- Tests updated/added (happy path + 1 edge case)
	- No secrets in code/logs; server-side errors sanitized

## Milestones Strategy (M1–M7)

- Track milestone scope in `docs/plan.md` and `docs/tasks.md`
- For each milestone increment (e.g., M3.2 → M3.3), open a dedicated PR that:
	- Implements the scoped items and updates the docs
	- Keeps commits atomic and references tasks
	- Adds/updates tests to cover changes
- For large milestones, break into multiple PRs by vertical slices (API + UI + tests)

## Spec Kit Workflow

- Use AI slash commands in order:
	- `/constitution` → `/specify` → `/clarify` → `/plan` → `/tasks` → `/analyze` → `/implement`
- Keep specs in `docs/` and avoid mixing with code
- Record decisions in `docs/decisions.md` when appropriate

## Local Development

- One-time setup: `./.specify/scripts/powershell/setup.ps1`
- Run: `./.specify/scripts/powershell/run.ps1 -Port 8080`
- Tests:
	- `tests/smoke.ps1` and `tests/pay-deterministic.ps1`
	- Unit tests under `tests/unit/*.php`

## Code Style & Tools

- PHP 8.1+; PDO SQLite; no php.ini edits required for dev
- Consider Intelephense + PHP Debug (Xdebug) in VS Code
- Prefer small, focused functions and clear error handling
- Keep front-end vanilla JS simple and accessible (ARIA where relevant)

## Reviews & Approvals

- At least 1 reviewer for significant changes; 2 for security-sensitive code
- Request review from stakeholders (domain + platform)
- Use draft PRs early for visibility when scope is large

Thanks for contributing!
