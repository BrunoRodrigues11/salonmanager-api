const collaboratorService = require("../services/collaboratorService");
const toCamel = require("../utils/toCamel");

async function index(req, res) {
  try {
    const data = await collaboratorService.getAllCollaborators();
    res.json(toCamel(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function store(req, res) {
  try {
    const collaborator = await collaboratorService.createCollaborator(req.body);
    res.json(toCamel(collaborator));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function destroy(req, res) {
  try {
    await collaboratorService.deleteCollaborator(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const collaborator = await collaboratorService.updateCollaborator(req.params.id, req.body);
    res.json(toCamel(collaborator));
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
