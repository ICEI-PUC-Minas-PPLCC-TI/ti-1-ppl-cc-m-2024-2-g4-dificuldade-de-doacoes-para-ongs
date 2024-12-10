document.getElementById('ongForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evitar o comportamento padrão do formulário

    // Captura e validação das senhas
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return;
    }

    // Construção do objeto da ONG
    const ong = {
        id: Date.now().toString(), // ID único gerado pelo timestamp atual
        orgName: document.getElementById('orgName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        socialMedia: document.getElementById('socialMedia').value,
        description: document.getElementById('description').value,
        category: document.getElementById('orgCategory').value,
        address: document.getElementById('address').value,
        password: password,
    };

    // Validação de campos obrigatórios
    if (!ong.orgName || !ong.phone || !ong.email || !ong.password) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    try {
        // Salva os dados no servidor
        await fetch('http://localhost:3001/ongs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ong),
        });

        // Salva os dados localmente (localStorage)
        localStorage.setItem('registeredOng', JSON.stringify(ong));

        // Mensagem de sucesso e redirecionamento
        alert('Registro de ONG concluído com sucesso!');
        window.location.href = '../login/login.html';
    } catch (error) {
        console.error('Erro ao registrar ONG:', error);
        alert('Erro ao salvar os dados. Tente novamente mais tarde.');
    }
});
