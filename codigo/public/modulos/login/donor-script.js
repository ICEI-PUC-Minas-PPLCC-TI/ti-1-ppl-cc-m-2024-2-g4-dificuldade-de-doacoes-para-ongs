document.getElementById('donorForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validar se as senhas coincidem
    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }

    const donor = {
        id: Date.now(), // Gerando um ID único baseado no timestamp
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        interests: document.getElementById('interests').value,
        category: document.getElementById('category').value,
        password: password,
    };
    

    try {
        const response = await fetch('http://localhost:3001/usuarios');
        const db = await response.json();

        // Adicionar o novo doador
        db.donors.push(donor);

        // Atualizar o db.json
        await fetch('http://localhost:3001/usuarios', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(db),
        });

        alert('Registro de doador concluído com sucesso!');
        window.location.href = '../login/login.html';
    } catch (error) {
        console.error('Erro ao registrar doador:', error);
        alert('Ocorreu um erro ao salvar os dados. Tente novamente mais tarde.');
    }
});
