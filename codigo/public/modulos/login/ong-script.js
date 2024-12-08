document.getElementById('ongForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }

    const ong = {
        id: Date.now().toString(), // ID único como string
        orgName: document.getElementById('orgName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        socialMedia: document.getElementById('socialMedia').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        address: document.getElementById('address').value,
        password: password,
    };

    // Verificação de campos obrigatórios
    if (!ong.orgName || !ong.phone || !ong.email || !ong.password) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    try {
        // Enviar os dados para o servidor
        await fetch('http://localhost:3001/ongs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ong),
        });

        alert('Registro de ONG concluído com sucesso!');
        window.location.href = '../login/login.html';
    } catch (error) {
        console.error('Erro ao registrar ONG:', error);
        alert('Ocorreu um erro ao salvar os dados. Tente novamente mais tarde.');
    }
});
