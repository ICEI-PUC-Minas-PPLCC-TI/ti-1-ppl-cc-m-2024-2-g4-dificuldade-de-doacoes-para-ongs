// script.js - Lógica de envio do formulário de Doador e ONG

// Lógica de envio do formulário de Doador
if (document.getElementById('doador-form')) {
    document.getElementById('doador-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Enviar dados de Doador para o servidor
        fetch('http://localhost:3001/register', {  // A URL está apontando para o servidor na porta 3001
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...data, userType: 'doador' }),
        })
        .then(response => response.json())
        .then(responseData => {
            alert(responseData.message);
            // Redirecionar após o sucesso do registro
            window.location.href = '/modulos/login/login.html';
        })
        .catch(error => console.error('Erro ao cadastrar Doador:', error));
    });
}

// Lógica de envio do formulário de ONG
if (document.getElementById('ong-form')) {
    document.getElementById('ong-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Enviar dados de ONG para o servidor
        fetch('http://localhost:3001/register', {  // A URL está apontando para o servidor na porta 3001
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...data, userType: 'ong' }),
        })
        .then(response => response.json())
        .then(responseData => {
            alert(responseData.message);
            // Após o registro bem-sucedido, redirecionar para a página de login
            window.location.href = '/modulos/login/login.html'; 
        })
        .catch(error => console.error('Erro ao cadastrar ONG:', error));
    });
}
