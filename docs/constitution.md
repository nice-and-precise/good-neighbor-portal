# Good Neighbor Portal Development Constitution

**Version:** 1.1.0  
**Ratification Date:** 2025-09-27  
**Last Amended Date:** 2025-09-27  

## Project Context

We are building the "Good Neighbor Portal" prototype for West Central Sanitation—a customer self-service and internal operations portal with multi-language support and mobile-responsive design.

## Core Principles

### Principle 1: Pragmatic Clarity Over Cleverness
**Rule:** All code, specifications, and documentation MUST optimize for maintainability and clarity over clever solutions or premature optimization.

**Rationale:** Long-term maintenance costs exceed initial development costs. Clear code enables faster feature development and reduces debugging time.

### Principle 2: Fast Feedback Loops
**Rule:** Every change MUST be locally testable within 2 minutes. All specifications MUST include immediate validation criteria.

**Rationale:** Rapid iteration prevents costly late-stage discoveries and maintains development momentum.

### Principle 3: Smallest Viable Increments
**Rule:** Features MUST be broken into independently deployable, testable increments. Each task MUST deliver user-observable value.

**Rationale:** Smaller increments reduce integration risk, enable continuous validation, and provide early user feedback.

### Principle 4: Windows-First Tooling
**Rule:** All automation scripts MUST provide PowerShell variants. Development setup MUST work on Windows without additional tooling.

**Rationale:** Primary development environment is Windows. Cross-platform compatibility ensures team productivity.

### Principle 5: Security by Default
**Rule:** All user inputs MUST be validated. All database queries MUST use prepared statements. All errors MUST be logged with sanitized details.

**Rationale:** Security vulnerabilities discovered post-deployment are exponentially more expensive to fix than prevention during development.

### Principle 6: Zero-Cloud Development
**Rule:** Local development MUST work without internet connectivity after initial setup. All demos MUST run locally with built-in PHP server.

**Rationale:** Reduces setup friction, ensures consistent development environment, and enables offline development.

## Technical Standards

### Stack Requirements
- **Backend:** PHP 8.1+ with type hints, built-in server for demos
- **Database:** SQLite (default) with MySQL 8 optional via DSN
- **Frontend:** Vanilla HTML/CSS/JS with light routing (avoid heavy frameworks unless justified)
- **Testing:** Include 1-2 fast unit tests with new code
- **Scripts:** PowerShell and Bash variants required

### UI Enhancement Standards (New)
- Progressive Enhancement: Default to a fully functional standard mode. Enhanced mode is optional and must not gate core flows.
- No External Frameworks: Enhancements MUST be implemented with vanilla JS and CSS. No build steps or third-party UI libraries.
- Stability: Do not rename/remove DOM ids referenced by demo scripts and tests.
- Toggle Persistence: Store UI mode in `localStorage` with clear key naming (`uiMode`).
- Accessibility: All enhancements MUST maintain or improve accessibility; no regression allowed.

### Code Quality
- Self-documenting code with minimal comments
- Functions under 20 lines when possible  
- Type hints for all PHP functions
- Input validation for all user-facing endpoints
- Conventional Commits with informative scopes
	- Example scopes: `feat(ui)`, `fix(a11y)`, `docs(ui)`, `chore(audit)`

### File Organization
```
/memory/constitution.md    # This constitution
/specs/                   # Feature specifications  
/tasks/                   # Implementation tasks
/scripts/                 # Automation (.sh and .ps1)
/docs/                    # Architecture decisions
/tests/                   # Test plans and data
/src/                     # Application code
```

## Spec-Kit Workflow Commands

### /constitution
Review and update this constitution. Ask about changed context before modifications. Follow semantic versioning for constitution changes.

### /specify [feature-name]  
Create detailed specification including:
- Problem statement with user value
- Measurable success criteria (checklist format)
- Technical approach with rationale
- Dependencies and integration points
- Risk assessment and mitigation
- Testing strategy

### /plan [spec-name]
Convert specification to implementable tasks:
- Break into smallest shippable increments  
- Map to file structure and database schema
- Include PowerShell commands for each step
- Estimate complexity (S/M/L/XL)
- Define task dependencies and acceptance criteria

### /tasks [plan-name]
Generate specific implementation tasks with:
- Exact file paths to create/modify
- Copy-pastable terminal commands
- Local testing instructions
- Acceptance checklist

### /implement [task-name]
Generate production code following technical standards. Include tests, documentation updates, and verification steps.

## Branch Strategy
- `main`: Production-ready code
- `feature/[spec-name]`: One branch per specification
- `task/[task-id]`: Granular implementation branches
- Clean, linear commit history preferred

## Quality Gates

### Specification Acceptance
- [ ] Problem statement clearly defines user value
- [ ] Success criteria are measurable and testable
- [ ] Technical approach is justified
- [ ] Dependencies are identified
- [ ] Risks are assessed with mitigation plans

### Task Acceptance  
- [ ] Acceptance criteria are met
- [ ] Code follows technical standards
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] PowerShell commands work on Windows

### Implementation Acceptance
- [ ] Feature works in local environment
- [ ] Performance is acceptable (< 2s response time)
- [ ] Security checklist completed
- [ ] Mobile responsiveness verified
- [ ] Multi-language support functional
 - [ ] Accessibility validated against WCAG 2.1 AA (see `docs/accessibility.md`)
 - [ ] Progressive enhancement verified (standard and enhanced modes)

### Responsive Testing Checklist
- Test breakpoints: xs (<480), sm (480–767), md (768–1023), lg (1024–1439), xl (≥1440)
- Verify no horizontal scroll, readable typography, and adequate spacing
- Ensure tap targets ≥ 44px and focus visibility at all breakpoints
- Validate layout for #login, #dashboard, and #staff routes

## Governance

### Amendment Process
1. Propose changes via `/constitution` command
2. Update version following semantic versioning
3. Document changes in Sync Impact Report
4. Update related templates and documentation  
5. Commit with message: `docs: amend constitution to vX.Y.Z`

### Versioning Policy
- **MAJOR:** Backward incompatible principle changes
- **MINOR:** New principles or materially expanded guidance  
- **PATCH:** Clarifications, wording fixes, refinements

### Compliance Review
Constitution compliance MUST be verified at each quality gate. Non-compliance blocks task completion and requires either code changes or constitution amendment.

## Communication Standards

### Response Format
1. One-sentence summary of action taken
2. Numbered steps or bulleted checklist
3. Explicit commands and file paths
4. Minimal explanatory text

### Decision Process  
When information is missing:
1. Ask one crisp clarifying question
2. If no response, pick reasonable default and state assumption
3. Proceed with implementation

### Output Requirements
- Show explicit commands for all actions
- Provide file paths for all changes  
- Use diff-style code blocks for modifications
- Include brief test plan for verification

---

*This constitution governs all development decisions for the Good Neighbor Portal prototype. When in conflict with external guidelines, this constitution takes precedence unless explicitly overridden by project stakeholders.*