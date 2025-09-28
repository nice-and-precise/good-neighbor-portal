# User Guide

This guide walks through the demo experience for residents and staff.

## Getting Started

1. Start the server:
   - Windows PowerShell: `.\.specify\scripts\powershell\run.ps1 -Port 8080`
2. Open http://127.0.0.1:8080 in your browser.
3. Select the tenant “Willmar, Minnesota” (default) or another seeded tenant.
4. Enter any email address for demo login and click “Request magic link (demo shows token)”.
5. Copy the returned token (it auto-fills) and click “Verify token”.

If you see a CSRF or session warning in an embedded preview, open the app in your system browser.

## Resident Experience

- Dashboard shows:
  - Next pickup date (deterministic by user id, Mon–Fri)
  - Last service request
  - Billing history
- Submit a service request:
  - Choose category and optional description, then Submit.
  - You’ll see the new request and can click into its details.
- View recent activity:
  - Combined feed of recent requests and billing charges.
- Make a demo payment:
  - Choose amount (in cents) and method, then “Pay now (demo)”.
  - Even amounts succeed; odd amounts fail by design.
- Language toggle:
  - Switch between English and Spanish; choice persists in the session.

## Staff Experience (Demo)

- Staff Queue:
  - Enter the demo staff key (default: `demo-staff`).
  - Choose a status and Load queue to see requests in that state.
  - Enable Auto-refresh to poll every 5 seconds.
- Request details:
  - From Recent Activity or the Staff Queue, click a request to view `#request/<id>`.
  - Use staff controls to update status (ack, in_progress, done, cancelled) and add notes.
  - Notes appear in chronological order below the controls.
- Route summary export:
  - Download CSV from `/api/route_summary.csv.php` (requires login).

## Tips

- The demo creates your resident account on first login and seeds initial billing charges.
- The detail panel appears when navigating to `#request/<id>` or `#billing/<id>`.
- Use the “Back” link in the detail panel to return to the dashboard.
