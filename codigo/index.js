const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./db/db.json');
const path = require('path');
const express = require('express');

// Middleware para permitir alterações
const middlewares = jsonServer.defaults({ noCors: true });
server.use(middlewares);

// Redirecionar a rota raiz "/" para a tela home
server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'modulos', 'Tela_Home', 'index.html'));
});

// Usar express.static para servir arquivos estáticos da pasta "modulos"
server.use(express.static(path.join(__dirname, 'modulos')));

// Usar o router do JSONServer
server.use(router);

server.listen(3000, () => {
    console.log(`JSON Server is running em http://localhost:3000`);
});
