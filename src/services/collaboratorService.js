const pool = require("../config/db");

async function getAllCollaborators() {
  const result = await pool.query(`
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
  `);

  return result.rows;
}

async function createCollaborator(data) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const { name, role, active, allowedProcedureIds } = data;

    const resCollab = await client.query(
      `INSERT INTO collaborators (name, role, active)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, role, active]
    );

    const collaboratorId = resCollab.rows[0].id;
    if (allowedProcedureIds?.length) {
      for (const procId of allowedProcedureIds) {
        await client.query(
          `INSERT INTO collaborator_allowed_procedures
           (collaborator_id, procedure_id)
           VALUES ($1, $2)`,
          [collaboratorId, procId]
        );
      }
    }

    await client.query("COMMIT");
    return { ...resCollab.rows[0], allowed_procedure_ids: allowedProcedureIds };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function deleteCollaborator(id) {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");
    await client.query(
      "DELETE FROM collaborators WHERE id = $1",
      [id]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  getAllCollaborators,
  createCollaborator,
  deleteCollaborator,
};
