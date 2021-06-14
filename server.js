const http = require('http'); //importando o http pro projeto
const app = require('./app')
const port = process.env.PORT || 3000; //porta do servidor
const server = http.createServer(app); //cria o server rodando o app

server.listen(port);  
console.log('conectou')
localhost:3000