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
VALUES
SELECT * FROM price_configs



