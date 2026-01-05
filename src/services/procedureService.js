const pool = require("../config/db");

async function getAllProcedures() {
  const result = await pool.query(`
    SELECT *
    FROM procedures
    ORDER BY id
  `);

  return result.rows;
}

async function createProcedure(data) {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");
    const { name, category, active } = data;
    
    const resProcedure = await client.query(
      `INSERT INTO procedures (name, category, active)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, category, active]
    );

    await client.query("COMMIT");
    return resProcedure.rows[0];

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function deleteProcedure(id) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      "DELETE FROM procedures WHERE id = $1",
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

async function updateProcedure(id, data) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const { name, category, active } = data;

    const result = await client.query(
      `
      UPDATE procedures
      SET name = $1, category = $2, active = $3
      WHERE id = $4
      RETURNING *
      `,
      [name, category, active, id]
    );

    if (!result.rows.length) {
      throw new Error("Procedimento não encontrado");
    }

    await client.query("COMMIT");
    return result.rows[0]; 
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}


module.exports = {
  getAllProcedures,
  createProcedure,
  deleteProcedure,
  updateProcedure,
};