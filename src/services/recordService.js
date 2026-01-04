const pool = require("../config/db");

async function getAllRecords() {
    const result = await pool.query(`
        SELECT
        id,
        date::text AS date,
        collaborator_id,
        procedure_id,
        status,
        notes,
        extras,
        calculated_value,
        created_at
        FROM service_records;
    `);
    return result.rows;
}

async function createRecord(data) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const { date, collaboratorId, procedureId, status, notes, extras, calculatedValue} = data;
        const resRecord = await client.query(
            `INSERT INTO service_records (date, collaborator_id, procedure_id, status, notes, extras, calculated_value)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *`,
            [date, collaboratorId, procedureId, status, notes, extras, calculatedValue]
        );

        await client.query("COMMIT");
        return resRecord.rows[0];

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

async function deleteRecord(id) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query(
            "DELETE FROM service_records WHERE id = $1",
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
    getAllRecords,
    createRecord,
    deleteRecord,
};