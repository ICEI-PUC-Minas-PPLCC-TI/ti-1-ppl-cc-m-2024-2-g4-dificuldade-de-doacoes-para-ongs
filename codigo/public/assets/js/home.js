function initHome() {
    let usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioCorrenteJSON) {
        let usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
        document.getElementById('userInfo').innerHTML = `Bem-vindo, ${usuarioCorrente.nome}`;
    }

    document.getElementById('btnLogin').addEventListener('click', function() {
        window.location.href = "/modulos/login/login.html"; // Redireciona para a tela de login
    });
}

document.addEventListener('DOMContentLoaded', initHome);
