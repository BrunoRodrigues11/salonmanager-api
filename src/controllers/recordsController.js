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
        // O service já fez o cálculo e salvou
        const record = await recordService.createRecord(req.body);

        // 1. Usa status 201 (Created) - Semanticamente correto para criação
        // 2. Aplica toCamel E normalizeRecord (para garantir que calculatedValue seja Number)
        res.status(201).json(normalizeRecord(toCamel(record)));

    } catch (err) {
        // Se o erro for de regra de negócio (ex: preço não achado), devolve 400
        if (err.message.includes("Preço não configurado")) {
            return res.status(400).json({ error: err.message });
        }

        res.status(500).json({ error: err.message });
    }
}

async function destroy(req, res) {
    try {
        const { id } = req.params;
        
        // O service tenta deletar
        await recordService.deleteRecord(id);
        
        // Status 204: "Deu certo, não tenho conteúdo para mostrar, pode fechar."
        res.status(204).send(); 
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    index,
    store,
    destroy,
};