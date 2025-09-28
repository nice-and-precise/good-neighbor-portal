# Development Workflow

This project uses Spec-Driven Development (GitHub Spec Kit). Follow this flow for new features and changes:

1. Constitution
   - Ensure `docs/constitution.md` reflects current principles and conventions.
2. Specification
   - Define the user outcome in `docs/spec.md` without implementation details.
3. Clarification
   - Capture questions/assumptions. Update spec with resolved details.
4. Planning
   - Document architecture and tech choices in `docs/plan.md`.
5. Tasks
   - Break down into actionable items in `docs/tasks.md` with clear DoD.
6. Implementation
   - Create a feature branch, commit in small steps, open a PR to `main`.

Quality gates before merge:
- CI green (E2E for both tenants, negative, smoke, unit tests, PHP syntax lint)
- Docs updated (spec/plan/tasks) where behavior changed
- PR template completed; risks & rollback noted

## Local Development

- Setup once (Windows): .\.specify\scripts\powershell\setup.ps1
- Run server (Windows): .\.specify\scripts\powershell\run.ps1 -Port 8080
- Smoke test: .\tests\smoke.ps1 -BaseUrl http://127.0.0.1:8080
- Pay test: .\tests\pay-deterministic.ps1 -BaseUrl http://127.0.0.1:8080

Use VS Code tasks (Terminal → Run Task) for the above.

## Branching and Commits

- Use feature branches: <milestone>-<short-name> (e.g., m3.2-request-detail)
- Keep commits atomic. Include context in messages, reference docs updates.

## Reviews

- Request at least one review.
- Ensure the PR shows how acceptance criteria are verified (tests or manual steps).

## Releases

- Use `.github/release-requests/<tag>` to request a release. See README for workflow details.
