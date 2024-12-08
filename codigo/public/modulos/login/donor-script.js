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
        id: Date.now().toString(), // Convertendo o ID para string
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        interests: document.getElementById('interests').value,
        category: document.getElementById('category').value,
        password: password,
    };

    try {
        // Enviar o novo doador ao servidor com POST
        const response = await fetch('http://localhost:3001/donors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donor),
        });

        if (!response.ok) {
            throw new Error(`Erro ao registrar o doador: ${response.statusText}`);
        }

        alert('Registro de doador concluído com sucesso!');
        window.location.href = '../login/login.html';
    } catch (error) {
        console.error('Erro ao registrar doador:', error);
        alert('Ocorreu um erro ao salvar os dados. Tente novamente mais tarde.');
    }
});
