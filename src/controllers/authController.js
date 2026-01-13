const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { password } = req.body;
    
    // Compara com a senha que está no .env (não no código!)
    if (password === process.env.ADMIN_PASSWORD) {
        // Gera um token que vale por, ex: 8 horas
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, {
            expiresIn: '8h'
        });
        return res.json({ auth: true, token });
    }
    return res.status(401).json({ auth: false, message: 'Senha incorreta' });
};

module.exports = { login };