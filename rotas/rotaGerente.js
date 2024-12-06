const express = require('express');
const fs = require('fs');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const carregaDadosGerente = () => {
    try {
        const memoriaDados = fs.readFileSync('gerente.json');
        const dadosJSON = memoriaDados.toString();
        return JSON.parse(dadosJSON);
    } catch (e) {
        return [];
    }
};

const salvaDadosGerente = (dados) => {
    const dadosJSON = JSON.stringify(dados);
    fs.writeFileSync('gerente.json', dadosJSON);
};

router.post('/cadastro', (req, res) => {
    const { usuario, senha, cpf} = req.body;

    if (!usuario || !senha || !cpf) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    const gerentes = carregaDadosGerente();

    const gerenteExiste = gerentes.some(gerente => gerente.usuario === usuario);
    if (gerenteExiste) {
        return res.status(400).json({ error: 'Esse gerente já está cadastrado!' });
    }

    const gerente = {
        id: uuidv4(),
        usuario,
        senha,
        cpf
    };

    gerentes.push(gerente);
    salvaDadosGerente(gerentes);

    res.status(201).json({ message: 'Gerente cadastrado com sucesso!', gerente });
});

module.exports = router;
