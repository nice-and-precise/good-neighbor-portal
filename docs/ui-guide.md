# UI Enhancement Guide

Purpose: Developer guidelines for implementing the progressive UI enhancement system while preserving MVP compatibility and demo workflows.

Related docs: docs/spec.md (UI-001..UI-005), docs/plan.md (M8), docs/tasks.md (M8), docs/accessibility.md, docs/responsive.md

## Modes
- Standard: Baseline UI. Default for all users and demo scripts.
- Enhanced: Optional polish enabled by a user-controlled toggle.

Persist mode with localStorage key `uiMode` using values `standard|enhanced`. Read at app bootstrap and apply body class `enhanced` accordingly.

## Toggle Pattern (Vanilla JS)
- Place a toggle control in the header settings (button or switch).
- On change: persist value, update body class, reapply responsive helpers if needed.
- Must not reload the page or break hash routing.

## CSS Strategy
- Mobile-first CSS.
- Enhancement rules guarded by `body.enhanced` to ensure standard mode remains untouched.
- Avoid renaming or removing existing ids (e.g., #request, #verify, #status).

## i18n Integration
- All UI strings for the toggle, banner, and contextual help must have i18n keys.
- Add keys to public/i18n/en.json first; other locales can be added later.

## Accessibility
- Enhancements must meet WCAG 2.1 AA.
- Use landmarks, proper labels, aria-describedby, and aria-live for async updates.
- Maintain visible focus states and keyboard operability.

## Demo Compatibility
- Maintain stable DOM for PowerShell scripts and tests.
- Do not modify API routes or auth flow.

## Quick Snippets

JS (bootstrap):
function applyUiMode(mode){
  const m = mode === 'enhanced' ? 'enhanced' : 'standard';
  localStorage.setItem('uiMode', m);
  document.body.classList.toggle('enhanced', m === 'enhanced');
}

JS (init):
applyUiMode(localStorage.getItem('uiMode') || 'standard');

CSS:
body.enhanced .card { box-shadow: 0 2px 6px rgba(0,0,0,0.15); }

## Validation
- Run tools/web-audit.mjs in both modes; attach artifacts.
- Run tests/smoke.ps1 in both modes.
- Ensure phpstan passes (no new PHP changes).
