const express = require('express');
const app = express();
const porta = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {  
    res.send('Hello World!');  
});

app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);


});
