const pool = require("../config/db");

async function getAllPrices() {
  const result = await pool.query(`
    SELECT *
    FROM price_configs
    ORDER BY id
  `);
  return result.rows;
}

async function createPrice(data) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        const { procedureId, valueDone, valueNotDone, valueAdditional } = data;

        const resPrice = await client.query(
            `INSERT INTO price_configs (procedure_id, value_done, value_not_done, value_additional)
                VALUES ($1, $2, $3, $4)
                RETURNING *`,
            [procedureId, valueDone, valueNotDone, valueAdditional]
        );

        await client.query("COMMIT");
        return resPrice.rows[0];

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

async function deletePrice(id) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        await client.query(
            "DELETE FROM price_configs WHERE id = $1",
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

async function updatePrice(id, data) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        const { valueDone, valueNotDone, valueAdditional } = data;

        const result = await client.query(
            `
            UPDATE price_configs
             SET value_done = $1, value_not_done = $2, value_additional = $3
             WHERE id = $4
             RETURNING *
             `,
            [valueDone, valueNotDone, valueAdditional, id]
        );

        if (result.rows.length === 0) {
            throw new Error("Valor não encontrado");
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
  getAllPrices,
  createPrice,
  deletePrice,
  updatePrice,
};