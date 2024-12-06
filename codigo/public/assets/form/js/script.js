document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Intercepta o envio tradicional do formulário

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
            'Content-Type': 'application/json' // Envia como JSON
        },
        body: JSON.stringify(formData) // Transforma o objeto em JSON
    })
    .then(response => {
        // Verifica se a resposta é OK
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json(); // Retorna os dados da resposta em formato JSON
    })
    .then(data => {
        console.log('Mensagem enviada com sucesso:', data);
        document.querySelector('.sent-message').style.display = 'block'; // Exibe a mensagem de sucesso
        document.querySelector('.error-message').style.display = 'none'; // Esconde a mensagem de erro
        this.reset(); // Reseta o formulário após o envio
        document.querySelector('button').disabled = false; // Reabilita o botão de envio
    })
    .catch(error => {
        console.error('Erro ao enviar a mensagem:', error);
        document.querySelector('.error-message').innerHTML = "Ocorreu um erro ao enviar sua mensagem."; // Exibe mensagem de erro
        document.querySelector('.error-message').style.display = 'block'; // Exibe a mensagem de erro
        document.querySelector('.sent-message').style.display = 'none'; // Esconde a mensagem de sucesso
        document.querySelector('button').disabled = false; // Reabilita o botão de envio
    });
});
