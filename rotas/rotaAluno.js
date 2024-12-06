const express = require('express');
const fs = require('fs');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const carregaDadosAluno = () => {
    try {
        const memoriaDados = fs.readFileSync('alunos.json');
        const dadosJSON = memoriaDados.toString();
        return JSON.parse(dadosJSON);
    } catch (e) {
        return [];
    }
};

const salvaDadosAlunos = (dados) => {
    const dadosJSON = JSON.stringify(dados);
    fs.writeFileSync('alunos.json', dadosJSON);
};

router.post('/cadastro', (req, res) => {
    const { nome, idade, cpf, senha } = req.body;

    if (!nome || !idade || !cpf || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    const alunos = carregaDadosAluno();

    const cpfExiste = alunos.some(aluno => aluno.cpf === cpf);
    if (cpfExiste ) {
        return res.status(400).json({ error: 'CPF ou usuário já cadastrado!' });
    }

    const aluno = {
        id: uuidv4(),
        nome,
        idade,
        cpf,
        senha
    };

    alunos.push(aluno);
    salvaDadosAlunos(alunos);

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', aluno });
});

module.exports = router;
