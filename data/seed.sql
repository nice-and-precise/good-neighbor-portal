-- Seed demo data for Willmar, MN tenant
BEGIN TRANSACTION;

INSERT INTO tenants (slug, name) VALUES ('willmar-mn', 'Willmar, Minnesota');

-- Create neighborhoods (simplified)
INSERT INTO neighborhoods (tenant_id, name, code)
SELECT t.id, 'Downtown', 'DT' FROM tenants t WHERE t.slug='willmar-mn';
INSERT INTO neighborhoods (tenant_id, name, code)
SELECT t.id, 'Northside', 'NS' FROM tenants t WHERE t.slug='willmar-mn';
INSERT INTO neighborhoods (tenant_id, name, code)
SELECT t.id, 'Southside', 'SS' FROM tenants t WHERE t.slug='willmar-mn';

-- A few addresses
INSERT INTO addresses (tenant_id, neighborhood_id, street, unit, lat, lng)
SELECT t.id, n.id, '101 1st St W', NULL, 45.121, -95.045
FROM tenants t JOIN neighborhoods n ON n.tenant_id=t.id AND n.code='DT'
WHERE t.slug='willmar-mn';

INSERT INTO addresses (tenant_id, neighborhood_id, street, unit, lat, lng)
SELECT t.id, n.id, '500 North Ave', 'A', 45.140, -95.060
FROM tenants t JOIN neighborhoods n ON n.tenant_id=t.id AND n.code='NS'
WHERE t.slug='willmar-mn';

INSERT INTO addresses (tenant_id, neighborhood_id, street, unit, lat, lng)
SELECT t.id, n.id, '250 South Rd', NULL, 45.100, -95.030
FROM tenants t JOIN neighborhoods n ON n.tenant_id=t.id AND n.code='SS'
WHERE t.slug='willmar-mn';

-- Demo users
INSERT INTO users (tenant_id, role, email, display_name)
SELECT t.id, 'resident', 'jane@example.com', 'Jane Resident' FROM tenants t WHERE t.slug='willmar-mn';
INSERT INTO users (tenant_id, role, email, display_name)
SELECT t.id, 'resident', 'john@example.com', 'John Resident' FROM tenants t WHERE t.slug='willmar-mn';
INSERT INTO users (tenant_id, role, email, display_name)
SELECT t.id, 'staff', 'staff@example.com', 'Willmar Staff' FROM tenants t WHERE t.slug='willmar-mn';
INSERT INTO users (tenant_id, role, email, display_name)
SELECT t.id, 'admin', 'admin@example.com', 'Willmar Admin' FROM tenants t WHERE t.slug='willmar-mn';

-- Demo billing
INSERT INTO billing_charges (tenant_id, resident_id, amount_cents, description)
SELECT t.id, u.id, 2500, 'Quarterly dues' FROM tenants t
JOIN users u ON u.tenant_id=t.id AND u.role='resident'
WHERE t.slug='willmar-mn' AND u.email='jane@example.com';

COMMIT;
