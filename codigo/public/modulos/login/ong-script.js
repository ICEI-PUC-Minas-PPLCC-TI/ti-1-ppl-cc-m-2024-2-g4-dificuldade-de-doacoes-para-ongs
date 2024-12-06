document.getElementById('ongForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }

    const ong = {
        orgName: document.getElementById('orgName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        socialMedia: document.getElementById('socialMedia').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        address: document.getElementById('address').value,
        password: password, // Armazena a senha
    };

    try {
        const response = await fetch('http://localhost:3001/usuarios');
        const db = await response.json();

        db.ongs.push(ong);

        await fetch('http://localhost:3001/usuarios', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(db),
        });

        alert('Registro de ONG concluído com sucesso!');
        window.location.href = '../login/login.html';
    } catch (error) {
        console.error('Erro ao registrar ONG:', error);
        alert('Ocorreu um erro ao salvar os dados. Tente novamente mais tarde.');
    }
});
