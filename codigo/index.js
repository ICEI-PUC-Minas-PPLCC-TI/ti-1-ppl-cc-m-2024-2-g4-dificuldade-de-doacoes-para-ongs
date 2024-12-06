const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./db/db.json');
const path = require('path');
const express = require('express');
const app = express(); // Cria uma instância do Express
const cors = require('cors'); // Importa o middleware CORS

// Middleware para habilitar CORS
app.use(cors()); // Habilita CORS globalmente para todas as requisições

// Middleware para processar dados JSON nas requisições
app.use(express.json());

// Usar express.static para servir arquivos estáticos
server.use(express.static(path.join(__dirname, 'public')));

// Middleware padrão do JSON Server
server.use(jsonServer.defaults());


// Middleware padrão do JSON Server
server.use(jsonServer.defaults());

// Usar o router do JSON Server para as APIs
server.use(router);


// Iniciar o servidor
server.listen(3000, () => {
    console.log(`JSON Server is running em http://localhost:3000`);
});
