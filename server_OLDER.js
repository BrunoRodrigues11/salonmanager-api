require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASS),
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});


// Helper para converter snake_case do banco para camelCase do front
const toCamel = (o) => {
  if (!o || typeof o !== 'object') return o;
  if (Array.isArray(o)) return o.map(toCamel);
  return Object.keys(o).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    acc[camelKey] = toCamel(o[key]);
    return acc;
  }, {});
};

// --- ROTAS ---

// Colaboradoras
app.get('/api/collaborators', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, 
      COALESCE(json_agg(cap.procedure_id) FILTER (WHERE cap.procedure_id IS NOT NULL), '[]') as allowed_procedure_ids
      FROM collaborators c
      LEFT JOIN collaborator_allowed_procedures cap ON c.id = cap.collaborator_id
      GROUP BY c.id
    `);
    res.json(toCamel(result.rows));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/collaborators', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { name, role, active, allowedProcedureIds } = req.body;
    
    const resCollab = await client.query(
      'INSERT INTO collaborators (name, role, active) VALUES ($1, $2, $3) RETURNING *',
      [name, role, active]
    );
    const newId = resCollab.rows[0].id;

    if (allowedProcedureIds && allowedProcedureIds.length > 0) {
      for (const procId of allowedProcedureIds) {
        await client.query(
          'INSERT INTO collaborator_allowed_procedures (collaborator_id, procedure_id) VALUES ($1, $2)',
          [newId, procId]
        );
      }
    }
    await client.query('COMMIT');
    res.json(toCamel({ ...resCollab.rows[0], allowed_procedure_ids: allowedProcedureIds }));
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally { client.release(); }
});

app.put('/api/collaborators/:id', async (req, res) => {
  // Implementação simplificada de update (necessário limpar allowed_procedures e reinserir)
  // ... (exercício para implementação completa)
  res.status(501).json({message: "Update não implementado neste snippet curto"});
});

app.delete('/api/collaborators/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM collaborators WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Procedimentos
app.get('/api/procedures', async (req, res) => {
  const result = await pool.query('SELECT * FROM procedures');
  res.json(toCamel(result.rows));
});

app.post('/api/procedures', async (req, res) => {
  const { name, category, active } = req.body;
  const result = await pool.query(
    'INSERT INTO procedures (name, category, active) VALUES ($1, $2, $3) RETURNING *',
    [name, category, active]
  );
  res.json(toCamel(result.rows[0]));
});

// Preços
app.get('/api/prices', async (req, res) => {
  const result = await pool.query('SELECT * FROM price_configs');
  res.json(toCamel(result.rows));
});

app.post('/api/prices', async (req, res) => {
  const { procedureId, valueDone, valueNotDone, valueAdditional, active } = req.body;
  const result = await pool.query(
    'INSERT INTO price_configs (procedure_id, value_done, value_not_done, value_additional, active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [procedureId, valueDone, valueNotDone, valueAdditional, active]
  );
  res.json(toCamel(result.rows[0]));
});

// Registros
app.get('/api/records', async (req, res) => {
  const result = await pool.query('SELECT * FROM service_records ORDER BY date DESC');
  res.json(toCamel(result.rows)); // O PG converte array TEXT[] automaticamente para array JS
});

app.post('/api/records', async (req, res) => {
  const { date, collaboratorId, procedureId, status, notes, extras, calculatedValue } = req.body;
  const result = await pool.query(
    `INSERT INTO service_records 
    (date, collaborator_id, procedure_id, status, notes, extras, calculated_value) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [date, collaboratorId, procedureId, status, notes, extras, calculatedValue]
  );
  res.json(toCamel(result.rows[0]));
});

app.delete('/api/records/:id', async (req, res) => {
  await pool.query('DELETE FROM service_records WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});