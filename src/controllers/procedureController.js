const procedureService = require('../services/procedureService');
const toCamel = require('../utils/toCamel');

async function index(req, res) {
  try {
    const data = await procedureService.getAllProcedures();
    res.json(toCamel(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function store(req, res) {
  try {
    const procedure = await procedureService.createProcedure(req.body);
    res.json(toCamel(procedure));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function destroy(req, res) {
  try {
    await procedureService.deleteProcedure(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const procedure = await procedureService.updateProcedure(req.params.id, req.body);
    res.json(toCamel(procedure));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  index,
  store,
  destroy,
  update,
};