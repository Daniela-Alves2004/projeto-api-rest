const express = require('express');
const fs = require('fs');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const verificaGerente = require('../middleware/verificaGerente');

const carregaDadosGerente = () => {
    try {
        const memoriaDados = fs.readFileSync('./gerente.json');
        const dadosJSON = memoriaDados.toString();
        return JSON.parse(dadosJSON);
    } catch (e) {
        return [];
    }
};

const salvaDadosGerente = (dados) => {
    const dadosJSON = JSON.stringify(dados);
    fs.writeFileSync('./gerente.json', dadosJSON);
};

const criaAdminPadrao = () => {
    const gerentes = carregaDadosGerente();
    const adminExiste = gerentes.some(gerente => gerente.admin);

    if (!adminExiste) {
        const adminPadrao = {
            id: uuidv4(),
            usuario: 'admin',
            senha: 'admin123',
            cpf: '00000000000',
            admin: true, 
        };
        gerentes.push(adminPadrao);
        salvaDadosGerente(gerentes);
        console.log('Administrador padrão criado.');
    }
};
criaAdminPadrao();

router.post('/cadastro', (req, res) => {
    try {
        const { usuario, senha, cpf } = req.body;

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
            cpf,
            admin: req.body.admin || false, 
        };

        gerentes.push(gerente);
        salvaDadosGerente(gerentes);

        res.status(201).json({ message: 'Gerente cadastrado com sucesso!', gerente });
    } catch (error) {
        console.error('Erro ao cadastrar gerente:', error);
        res.status(500).json({ error: 'Erro ao cadastrar gerente' });
    }
});

router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const gerentes = carregaDadosGerente();
        const gerente = gerentes.find(g => g.id === id);

        if (!gerente) {
            return res.status(404).json({ error: 'Gerente não encontrado!' });
        }

        const gerentesAtualizados = gerentes.filter(g => g.id !== id);
        salvaDadosGerente(gerentesAtualizados);

        res.status(200).json({ message: 'Gerente excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir gerente:', error);
        res.status(500).json({ error: 'Erro ao excluir gerente' });
    }
});

router.put('/usuarios/:id', verificaGerente, (req, res) => {
    try {
        const { id } = req.params;
        const { nome, idade, cpf, senha } = req.body;

        const gerentes = carregaDadosGerente();
        const gerente = gerentes.find(g => g.id === id);

        if (!gerente) {
            return res.status(404).json({ error: 'Usuário não encontrado!' });
        }

        if (nome) gerente.nome = nome;
        if (idade) gerente.idade = idade;
        if (cpf) gerente.cpf = cpf;
        if (senha) gerente.senha = senha;

        salvaDadosGerente(gerentes);
        res.status(200).json({ message: 'Usuário atualizado com sucesso!', gerente });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

module.exports = router;
