// const LOGIN_URL = "/modulos/login/login.html";
// let RETURN_URL = "/modulos/Tela_Home/index.html";
// const API_URL = '/usuarios';
// var db_usuarios = {};
// var usuarioCorrente = {};

// // Inicializa a aplicação de Login
// function initLoginApp() {
//     let pagina = window.location.pathname;

//     if (pagina !== LOGIN_URL) {
//         sessionStorage.setItem('returnURL', pagina);
//         RETURN_URL = pagina;

//         // Verifica se há um usuário logado
//         let usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
//         if (usuarioCorrenteJSON) {
//             usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
//         } else {
//             window.location.href = LOGIN_URL;
//         }

//         document.addEventListener('DOMContentLoaded', function() {
//             showUserInfo('userInfo');
//         });
//     } else {
//         let returnURL = sessionStorage.getItem('returnURL');
//         RETURN_URL = returnURL || RETURN_URL;
        
//         carregarUsuarios(() => {
//             console.log('Usuários carregados...');
//         });
//     }
// }

// function carregarUsuarios(callback) {
//     fetch(API_URL)
//         .then(response => response.json())
//         .then(data => {
//             db_usuarios = data;
//             callback();
//         })
//         .catch(error => {
//             console.error('Erro ao ler usuários via API JSONServer:', error);
//             displayMessage("Erro ao ler usuários");
//         });
// }

// function loginUser(login, senha) {
//     for (var i = 0; i < db_usuarios.length; i++) {
//         var usuario = db_usuarios[i];

//         if (login === usuario.login && senha === usuario.senha) {
//             usuarioCorrente.id = usuario.id;
//             usuarioCorrente.login = usuario.login;
//             usuarioCorrente.email = usuario.email;
//             usuarioCorrente.nome = usuario.nome;

//             sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
//             window.location.href = RETURN_URL; // Redireciona para a página de retorno
//             return true;
//         }
//     }
//     return false;
// }

// function logoutUser() {
//     sessionStorage.removeItem('usuarioCorrente');
//     window.location = LOGIN_URL;
// }

// function addUser(nome, login, senha, email) {
//     let usuario = { "login": login, "senha": senha, "nome": nome, "email": email };

//     fetch(API_URL, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(usuario),
//     })
//         .then(response => response.json())
//         .then(data => {
//             db_usuarios.push(usuario);
//             displayMessage("Usuário inserido com sucesso");
//         })
//         .catch(error => {
//             console.error('Erro ao inserir usuário via API JSONServer:', error);
//             displayMessage("Erro ao inserir usuário");
//         });
// }

// function showUserInfo(element) {
//     var elemUser = document.getElementById(element);
//     if (elemUser) {
//         elemUser.innerHTML = `${usuarioCorrente.nome} (${usuarioCorrente.login}) 
//                     <a onclick="logoutUser()">❌</a>`;
//     }
// }

// // Inicializa o aplicativo de login
// initLoginApp();
