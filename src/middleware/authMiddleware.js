const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // O token vem no header assim: "Bearer eyJhbGci..."
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Pega só a parte do código

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Salva dados do user na requisição se precisar usar depois
        next(); // Pode passar, está autenticado
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
};