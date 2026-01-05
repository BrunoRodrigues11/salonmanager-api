const priceService = require("../services/priceService");
const toCamel = require('../utils/toCamel');

function normalizePrice(price) {
    return {
    ...price,
    valueDone: Number(price.valueDone),
    valueNotDone: Number(price.valueNotDone),
    valueAdditional: Number(price.valueAdditional),
  };
}

async function index(req, res) {
    try {
        const prices = await priceService.getAllPrices();
        res.json(prices.map(price => normalizePrice(toCamel(price))));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function store(req, res) {
    try {
        const price = await priceService.createPrice(req.body);
        res.json(price);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function destroy(req, res) {
    try {
        await priceService.deletePrice(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function update(req, res) {
    try {
        const price = await priceService.updatePrice(req.params.id, req.body);
        res.json(normalizePrice(toCamel(price)));
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