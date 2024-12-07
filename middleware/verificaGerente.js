const fs = require('fs');

const carregaDadosGerente = () => {
    try {
        const memoriaDados = fs.readFileSync('../gerente.json');
        const dadosJSON = memoriaDados.toString();
        return JSON.parse(dadosJSON);
    } catch (e) {
        console.error('Erro ao carregar os dados do gerente:', e.message);
        return [];
    }
};
const verificaGerente = (req, res, next) => {
    // Lógica de verificação de gerente (admin)
    const gerentes = carregaDadosGerente();
    const gerente = gerentes.find(g => g.usuario === req.body.usuario);

    if (gerente && gerente.admin) {
        next(); // Admin válido, continuar
    } else {
        res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
    }
};

module.exports = verificaGerente;
