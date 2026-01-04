
/* COLLABORATORS */
INSERT INTO collaborators (name, role, active) 
VALUES ('Nina','Manicure', True)
SELECT * FROM collaborators

/* QUERY COLLABORATORS SERVICE */
SELECT c.*, 
COALESCE(
  json_agg(cap.procedure_id)
  FILTER (WHERE cap.procedure_id IS NOT NULL),
  '[]'
) AS allowed_procedure_ids
FROM collaborators c
LEFT JOIN collaborator_allowed_procedures cap
  ON c.id = cap.collaborator_id
GROUP BY c.id

/* PROCEDURES */
INSERT INTO procedures (name, category, active) 
VALUES ('Sombrancelha', 'Cabeleireira – Feminino', true)
SELECT * FROM procedures

/* QUERY PROCEDURES SERVICE */
SELECT *
FROM procedures
ORDER BY id

INSERT INTO price_configs (procedure_id, value_done, value_not_done, value_additional, active)
VALUES ('0374ff7f-1ef8-495b-bf13-69a0af6faf91', 11.75, 8.25, 0, true) 
SELECT * FROM price_configs

/* SERVICE REDORDS */
INSERT INTO service_records (date, collaborator_id, procedure_id, status, notes, extras, calculated_value)
VALUES ('04-01-2025','165e35e5-94de-46ca-b655-b68070f3d81a','0374ff7f-1ef8-495b-bf13-69a0af6faf91','Fez','','',20)
SELECT * FROM service_records



