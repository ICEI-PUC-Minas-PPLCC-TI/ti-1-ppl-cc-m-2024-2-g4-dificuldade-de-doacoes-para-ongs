document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    // Cria um objeto com os dados do formulário
    const formData = {
        name: this.name.value,
        email: this.email.value,
        subject: this.subject.value,
        message: this.message.value
    };

    // Envia a requisição usando fetch
    fetch('http://localhost:3000/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Indica que estamos enviando JSON
        },
        body: JSON.stringify(formData) // Converte o objeto para uma string JSON
    })
    .then(response => response.json()) // Espera a resposta como JSON
    .then(data => {
        // Exibe mensagem de sucesso
        document.querySelector('.sent-message').style.display = 'block'; 
        document.querySelector('.error-message').style.display = 'none'; 
        this.reset(); // Limpa o formulário
    })
    .catch(error => {
        console.error('Error:', error);
        document.querySelector('.error-message').innerHTML = "Ocorreu um erro ao enviar sua mensagem."; 
        document.querySelector('.error-message').style.display = 'block'; 
        document.querySelector('.sent-message').style.display = 'none'; 
    });
});
