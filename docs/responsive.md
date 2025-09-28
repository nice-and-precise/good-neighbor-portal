# Responsive Guide

Breakpoints (mobile-first):
- xs: < 480px
- sm: 480–767px
- md: 768–1023px
- lg: 1024–1439px
- xl: ≥ 1440px

Targets:
- No horizontal scrolling
- Tap targets ≥ 44px
- Readable line length (45–90 chars)

Key Routes:
- #login: forms stack on xs/sm, inline on md+
- #dashboard: cards wrap with min-width 280px
- #staff: table/list hybrid on xs/sm; table on md+

Testing Matrix:
- Test two widths per breakpoint category
- Validate focus visibility and spacing
- Verify i18n strings don’t overflow

CSS Techniques:
- Flex/grid with gap
- minmax() with auto-fit for cards
- :focus-visible for focus styles

Notes:
- Enhancement styles are guarded under body.enhanced
- Keep ids stable for demo and tests
