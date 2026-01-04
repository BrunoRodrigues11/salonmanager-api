const recordService = require('../services/recordService');
const toCamel = require('../utils/toCamel');

function normalizeRecord(record) {
    return {
        ...record,
        calculatedValue: Number(record.calculatedValue),
    };
}

async function index(req, res) {
    try {
        const records = await recordService.getAllRecords();
        res.json(records.map(record => normalizeRecord(toCamel(record))));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function store(req, res) {
    try {
        const record = await recordService.createRecord(req.body);
        res.json(toCamel(record));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function destroy(req, res) {
    try {
        await recordService.deleteRecord(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    index,
    store,
    destroy,
};