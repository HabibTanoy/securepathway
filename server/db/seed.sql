-- SecurePathway v5 — Seed Data (development/demo only)
-- Run AFTER schema.sql

BEGIN;

-- Demo tenant: Acme Security Ltd
INSERT INTO tenants (id, name, region, plan, slug) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Acme Security Ltd', 'IE', 'team', 'acme-security')
ON CONFLICT (slug) DO NOTHING;

-- Demo users (password: "SecurePass1!" for all)
-- bcrypt hash of "SecurePass1!" with cost 12
INSERT INTO users (id, tenant_id, email, password_hash, name, initials, role, lang, active_track, streak) VALUES
  ('aaaa0001-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111',
   'sarah@acme.ie','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGc7QvEHN.2TPhQZRkxdw4L1b3.','Sarah O''Brien','SO','learner','en','track-gsoc',7),
  ('aaaa0002-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111',
   'declan@acme.ie','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGc7QvEHN.2TPhQZRkxdw4L1b3.','Declan Murphy','DM','learner','en','track-intel',14),
  ('aaaa0003-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111',
   'yemi@acme.ie','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGc7QvEHN.2TPhQZRkxdw4L1b3.','Yemi Adeyemi','YA','learner','en','track-pso',3),
  ('aaaa0004-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111',
   'aoife@acme.ie','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGc7QvEHN.2TPhQZRkxdw4L1b3.','Aoife Brennan','AB','learner','en','track-inv',21),
  ('aaaa0005-0000-0000-0000-000000000005','11111111-1111-1111-1111-111111111111',
   'cian@acme.ie','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGc7QvEHN.2TPhQZRkxdw4L1b3.','Cian Fitzgerald','CF','learner','en','track-gsoc',30),
  ('aaaa0006-0000-0000-0000-000000000006','11111111-1111-1111-1111-111111111111',
   'niamh@acme.ie','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGc7QvEHN.2TPhQZRkxdw4L1b3.','Niamh Walsh','NW','learner','en','track-cyber',18),
  ('aaaa0007-0000-0000-0000-000000000007','11111111-1111-1111-1111-111111111111',
   'eoin@acme.ie','$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGc7QvEHN.2TPhQZRkxdw4L1b3.','Eoin McCarthy','EM','manager','en','track-lead',45)
ON CONFLICT (email) DO NOTHING;

-- Demo progress for Sarah (gsoc track, weeks 1-9 done)
INSERT INTO module_progress (user_id, module_id, track_id, sections_done, quiz_passed, quiz_score, hook_done)
SELECT 'aaaa0001-0000-0000-0000-000000000001', module_id, track_id, sections_done, quiz_passed, quiz_score, hook_done
FROM (VALUES
  ('gsoc-1','track-gsoc','{"s1":true,"s2":true,"s3":true}',true,85,true),
  ('gsoc-2','track-gsoc','{"s1":true,"s2":true}',true,80,false),
  ('gsoc-3','track-gsoc','{"s1":true}',false,0,true)
) AS t(module_id, track_id, sections_done, quiz_passed, quiz_score, hook_done)
ON CONFLICT (user_id, module_id) DO NOTHING;

-- AI log entries
INSERT INTO ai_log (tenant_id, user_id, type, detail, tool) VALUES
  ('11111111-1111-1111-1111-111111111111','aaaa0001-0000-0000-0000-000000000001','Short Answer','gsoc-1: GDPR gate question graded 82%','claude-sonnet-4-6'),
  ('11111111-1111-1111-1111-111111111111','aaaa0002-0000-0000-0000-000000000002','Simulation','Intel simulation: Nation-state profiling — ADEQUATE','claude-sonnet-4-6'),
  ('11111111-1111-1111-1111-111111111111','aaaa0007-0000-0000-0000-000000000007','Document AI','CompanyPolicy.pdf → "Data Handling Procedures" (5 quiz questions)','Document AI');

COMMIT;
