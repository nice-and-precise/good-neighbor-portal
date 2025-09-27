# Autonomous Repository Audit

**Objective**: Self-executing audit of good-neighbor-portal that requires zero human intervention and produces actionable results.

## Execution Protocol

### Phase 1: Data Collection (Automated)
```bash
# Repository structure scan
find . -type f -name "*.php" -o -name "*.md" -o -name "*.sql" -o -name "*.ps1" | head -50

# Configuration validation  
test -f config/app.example.env && echo "✓ Config template exists"
test -f data/schema.sql && echo "✓ Schema exists"

# Script functionality check
powershell -Command "try { .\.specify\scripts\powershell\check-prerequisites.ps1 } catch { 'FAIL: Prerequisites check failed' }"
```

### Phase 2: Milestone Assessment Matrix
For each milestone (M1-M7), execute this validation:

**M1 Scaffold + DB + Scripts**
- [ ] `data/schema.sql` contains all required tables (users, tenants, neighborhoods, billing, requests)
- [ ] `src/Lib/` has Config.php, Db.php, Validator.php, Util.php, Http.php
- [ ] `public/api/` endpoints: ping, csrf, diag, auth_request, auth_verify, session, tenants, logout
- [ ] PowerShell scripts: setup.ps1, run.ps1, reset-demo.ps1, export.ps1 exist and execute
- [ ] `.gitignore` excludes config/app.env, data/app.db, logs/, tmp/, exports/

**M2 Auth + Neighborhood Switcher**  
- [ ] UserModel.php, MagicLinkModel.php, NeighborhoodModel.php exist
- [ ] AuthController.php implements magic-link flow
- [ ] auth_login.php view with token display
- [ ] Session-based neighborhood persistence
- [ ] Logout functionality clearing sessions

**M3 Resident Dashboard + Billing**
- [ ] ScheduleModel.php, BillingModel.php exist  
- [ ] ResidentController.php with dashboard endpoints
- [ ] resident_dashboard.php shows next pickup, calendar
- [ ] resident_billing.php with payment history
- [ ] Demo payment endpoint with deterministic outcomes

**M4 Service Requests + Confirmations**
- [ ] RequestModel.php with CRUD operations
- [ ] resident_request_new.php form implementation
- [ ] Request creation endpoint returning confirmation ID
- [ ] Status tracking and display

**M5 Staff Queue + Notes + Polling**
- [ ] StaffController.php with queue management
- [ ] staff_queue.php with auto-refresh polling
- [ ] Status update endpoints with notes capability
- [ ] CSRF protection on all forms
- [ ] Error logging without PII exposure

**M6 Route Summary + CSV Export**
- [ ] RouteModel.php for route data aggregation
- [ ] ExportController.php with CSV generation
- [ ] Lib/Csv.php utility class
- [ ] Export columns: service_day, neighborhood_name, route_name, pickup_count, area_code, generated_at

**M7 i18n + Toggle + Tests**
- [ ] i18n/en.json, i18n/es.json language files
- [ ] Lib/I18n.php translation utility
- [ ] Language toggle endpoint and frontend JS
- [ ] tests/smoke.ps1 full-flow validation
- [ ] tests/unit/validator_test.php unit tests
- [ ] A11y checklist completion (labels, contrast, keyboard nav, skip links)
- [ ] Mobile responsiveness validation

### Phase 3: Automated Scoring
```yaml
# Scoring algorithm
milestone_completion_percentage = (completed_tasks / total_tasks) * 100
constitution_alignment_score = (aligned_principles / total_principles) * 10  
documentation_currency_score = (accurate_docs / total_docs) * 10
overall_health_score = (milestone_completion + constitution_alignment + documentation_currency) / 3
```

### Phase 4: Critical Path Analysis
Execute without human input:

1. **Scan codebase** for TODO comments, FIXME notes, security vulnerabilities
2. **Validate API endpoints** by attempting HTTP requests to each documented endpoint
3. **Test database operations** by running basic CRUD operations on each model
4. **Check cross-platform compatibility** by attempting script execution in different environments
5. **Measure performance** - startup time, API response times, database query performance

### Phase 5: Auto-Generated Report

```markdown
# Audit Report - [TIMESTAMP]

## Executive Summary
Repository health: [SCORE]/10 | M1: [STATUS] | M2: [STATUS] | ... | M7: [STATUS]

## Milestone Status Matrix
| Milestone | Completion | Blockers | Risk Level |
|-----------|------------|----------|------------|
| M1 | 90% | PowerShell Linux compatibility | Medium |
| M2 | 0% | Missing UserModel.php | High |
| ... | ... | ... | ... |

## Critical Findings
[AUTO-GENERATED LIST OF BLOCKERS]

## Immediate Action Items
1. [AUTO-PRIORITIZED TASK 1]
2. [AUTO-PRIORITIZED TASK 2]
3. [AUTO-PRIORITIZED TASK 3]

## Documentation Updates Required
[AUTO-DETECTED INCONSISTENCIES]

## Next Sprint Recommendations  
[AUTO-GENERATED BASED ON MILESTONE GAPS]
```

### Phase 6: Self-Validation
Before completing, verify:
- Every milestone has been assessed with binary pass/fail
- Critical blockers are ranked by impact on next milestone
- All recommendations include effort estimates (S/M/L)
- Report is actionable without additional research

## Success Metrics
- **Zero human intervention required** during execution
- **100% milestone coverage** (M1-M7)
- **Actionable output** with specific file paths and commands
- **Completion in <5 minutes** on standard hardware

This audit executes via: `copilot @.github/prompts/autonomous-audit.prompt.md`

````yaml type="draft-issue"
type: draft-issue
tag: "audit-whole-milestones"
issueNumber: 0
repository: jdamhofBBW/good-neighbor-portal
state: draft
title: 'Comprehensive Audit: All Milestones and Progress Alignment'
description: |-
    **Summary:**
    Conduct a full audit of the Good Neighbor Portal repository to assess alignment with the constitution, architectural decisions, and ALL milestones (M1–M7). Ensure documentation and implementation are consistent, highlight gaps, and provide actionable next steps.

    ---

    ## Audit Checklist

    1. **Constitution & Strategic Alignment**
        - Review `.specify/memory/constitution.md` for principle adherence
        - Confirm that project direction and architectural choices in `docs/decisions.md` match constitution
        - Check that every milestone (M1–M7) and deliverable supports the stated goals
    2. **Milestone-by-Milestone Progress**
        - For each milestone (M1–M7):
            - List all required deliverables from `docs/tasks.md`, `docs/plan.md`, and milestone specs
            - Check off completed vs. missing tasks
            - Note any blockers, risks, or drift from plan
    3. **Codebase & Implementation**
        - Review `src/`, `public/api/`, and scripts for coverage, consistency, and adherence to repo standards
        - Assess cross-platform readiness for all scripts
        - Check code quality, security, and test coverage (unit/integration)
    4. **Documentation Currency**
        - Ensure README, task lists, API docs, and architectural decisions are current and accurate for all milestones
        - Flag outdated or missing documentation
    5. **Gap & Risk Analysis**
        - Identify any documentation vs. implementation mismatches
        - Highlight technical debt, security, or architectural risks impacting future milestones
    6. **Next Steps Roadmap**
        - Propose prioritized, actionable steps for each incomplete milestone
        - Include doc updates, code changes, or testing tasks

    ---

    ## Output Format
    - 1-sentence executive summary
    - Table showing milestone status: complete / partial / not started, with brief notes
    - List of critical blockers or risks
    - Next steps, grouped by milestone

    _This audit should be updated regularly as progress continues. Use this as a living reference for team alignment and planning._
```
