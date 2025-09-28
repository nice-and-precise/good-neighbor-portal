# Accessibility Checklist (WCAG 2.1 AA)

Cross-reference: docs/spec.md (UI-003), docs/plan.md (M8), docs/tasks.md (M8)

## Landmarks & Structure
- [ ] Header, Nav, Main, Footer landmarks
- [ ] Logical heading order (h1..h3)
- [ ] Skip to content link

## Keyboard
- [ ] Full keyboard operability
- [ ] Visible focus indicators
- [ ] Focus management after auth and modal-like interactions

## Forms
- [ ] Labels associated with inputs
- [ ] aria-describedby used for help/error text
- [ ] Clear error messaging; announced via aria-live

## Live Regions
- [ ] role=status + aria-live for async updates (toasts, status)
- [ ] Assertive where necessary for critical errors

## Contrast
- [ ] Text contrast meets AA (4.5:1 normal, 3:1 large)
- [ ] UI components and graphics contrast acceptable

## Responsive & Touch
- [ ] No horizontal scroll at breakpoints
- [ ] Targets ≥ 44px touch size
- [ ] 16px base font on mobile to avoid zoom

## Media & Motion
- [ ] Respects reduced motion preference
- [ ] No flashing content

## i18n
- [ ] All strings have keys; language toggle affects enhancement UI

## Verification Steps
- Run automated audit (tools/web-audit.mjs), review artifacts under artifacts/web-audit/
- Manual keyboard walkthrough (#login, #dashboard, #staff)
- Document deviations and remediation plan
