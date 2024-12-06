const tabelaDoacoes = document.getElementById('doacoes-tabela');

// Função para buscar e exibir doações
function carregarDoacoes() {
    fetch('http://localhost:3000/doacoes') // Obtém a lista de doações
        .then(response => response.json())
        .then(doacoes => {
            // Percorre cada doação
            doacoes.forEach(doacoes => {
                // Busca o usuário correspondente ao userId da doação
                fetch(`http://localhost:3000/usuarios/${doacoes.userId}`)
                    .then(response => response.json())
                    .then(usuario => {
                        // Cria uma nova linha para cada doação
                        const row = document.createElement('tr');
                        
                        // Preenche as células da linha com os dados da doação e do usuário
                        row.innerHTML = `
                            <td>${usuario.nome}</td>
                            <td>${usuario.email}</td>
                            <td>R$ ${doacoes.valor}</td>
                        `;
                        tabelaDoacoes.appendChild(row);
                    })
                    .catch(error => console.error('Erro ao buscar usuário:', error));
            });
        })
        .catch(error => console.error('Erro ao buscar doações:', error));
}

// Chama a função ao carregar a página
window.onload = carregarDoacoes;