const express = require('express');
const app = express();
const porta = 3000;
const rotaGerente = require('./rotas/rotaGerente'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>Home</title>
            </head>
            <body>
                <h1>Home</h1>
                <a href="/rotaGerente">Cadastro de Gerente</a>
            </body>
        </html>
    `);
});

app.use('/rotaGerente', rotaGerente);

app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});
