document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3001/usuarios');
        const db = await response.json();

        // Verificar se o usuário é um doador
        const donor = db.donors.find(user => user.email === email && user.password === password);

        if (donor) {
            alert('Login realizado com sucesso como doador!');
            window.location.href = '../Tela_Painel_Doador_por_Samuel_Mascarenhas/painelDoador.html';
            return;
        }

        // Verificar se o usuário é uma ONG
        const ong = db.ongs.find(user => user.email === email && user.password === password);

        if (ong) {
            alert('Login realizado com sucesso como ONG!');
            window.location.href = '../Tela_Painel_Ongs_David_Cristhian_Vieira_Fonseca/telaPainel.html';
            return;
        }

        alert('Credenciais inválidas. Tente novamente.');

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Ocorreu um erro. Tente novamente mais tarde.');
    }
});

document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');

    // Troca entre texto e senha
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
});
