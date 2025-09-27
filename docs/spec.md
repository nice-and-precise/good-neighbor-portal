/specify 

## User Scenarios & Testing

### Primary User Story
West Central Sanitation needs a demo-ready MVP portal that runs entirely on a developer laptop. Residents can view service schedules, billing history, and submit requests. Internal staff can triage requests and view route summaries. Stakeholders can evaluate flows, language toggle, and mobile responsiveness in local demos without cloud dependencies.

### Acceptance Scenarios
1. **Given** a resident opens the portal, **When** they sign in to a demo account, **Then** they can view next pickup date and billing history
2. **Given** a resident submits a bulk pickup request, **When** they complete the form, **Then** they receive a visible confirmation ID
3. **Given** a staff user views the request queue, **When** a new request appears, **Then** they can update its status and leave notes
4. **Given** a user switches to Spanish, **When** the language toggle activates, **Then** primary UI labels update immediately
5. **Given** a stakeholder runs the demo, **When** they execute one script, **Then** the entire portal loads locally without internet

### Edge Cases
- What happens when demo payment processing shows failure scenarios?
- How does the system handle service requests with missing required fields?
- What occurs when the demo data reset script is run while the portal is active?

## Requirements

### Functional Requirements
- **FR-001**: System MUST provide demo login for resident and staff user types
	- M2 note: Implemented as offline demo magic-link flow (token displayed on-screen; no email)
- **FR-002**: System MUST display next pickup date and service calendar from demo data
- **FR-003**: System MUST show billing history and demo "Pay now" action with sandbox messaging
- **FR-004**: Residents MUST be able to submit service requests (bulk pickup, start/stop service, container swap, issue report)
- **FR-005**: System MUST display FAQs and announcements section
- **FR-006**: System MUST support language toggle between English and one alternate language
- **FR-007**: Staff MUST be able to view request queue with statuses: New, In review, Scheduled, Done
- **FR-008**: Staff MUST be able to update request statuses and leave short notes
- **FR-009**: System MUST provide route summary view with counts by service day and CSV export
- **FR-010**: System MUST display recent activity feed for internal dashboard
- **FR-011**: Portal MUST be mobile-responsive and accessible
- **FR-012**: System MUST validate all inputs and use prepared statements for data writes
- **FR-013**: System MUST provide one-command demo data reset script
- **FR-014**: System MUST start locally in under 10 seconds and support offline operation

### Key Entities
- **Resident Account**: Demo login credentials, service address, pickup schedule, language preference
- **Service Request**: Request type, description, status, confirmation ID, staff notes
- **Demo Billing**: Mock transaction history, payment scenarios (success/failure), billing cycles
- **Route Summary**: Service day, pickup counts, area coverage for reporting
- **Staff User**: Internal operator with request management permissions

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous  
- [x] Success criteria are measurable
- [x] Scope is clearly bounded (demo-only, local development)
- [x] Dependencies and assumptions identified

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---

**Next steps**: 
1. Run `/clarify` to resolve any remaining ambiguities
2. Run `/plan` to create implementation plan following constitution principles
3. Ensure all payment functionality is demo/mock only with explicit sandbox messaging
