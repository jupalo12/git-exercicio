const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.static(__dirname + 'public'));

// colocando as rota em variáveis
const rotaProdutos = require('./ROUTES/produtos-rota');
app.use("uploads",express.static("uploads")); //TORNA A PASTA "UPLOADS" PÚBLICA
app.use(bodyParser.urlencoded({ extended: false }));// APENAS DADOS SIMPLES 
app.use(bodyParser.json());// JSON DE ENTRADA NO BODY
app.use(express.static(__dirname + '/'));// Linha De codigo enviada por god
// MIDDLEWARES
app.use('/produtos', rotaProdutos);
// MIDDLEWARE TESTE
app.use('/teste', (req, res, next) => {
    res.status(200).send({
        mensagem: 'OK, Deu certo'
    })
});

app.get('/', (req, res) => {

    res.sendFile(__dirname + '/index.html');

});



module.exports = app;