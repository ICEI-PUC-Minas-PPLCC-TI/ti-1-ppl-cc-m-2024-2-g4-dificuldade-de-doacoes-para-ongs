loadFavorites(); // Carrega os favoritos ao inicializar

window.onload = function () {
    var profileImage = document.getElementById('profileImage');
    var modal = document.getElementById('profileModal');
    var closeModal = document.getElementById('closeModal');
    var overlay = document.getElementById('modalOverlay');
    const nomeElement = document.getElementById('nome'); // Elemento <h2> para exibir o nome

    // Ao clicar na imagem do perfil, abre o modal
    profileImage.onclick = function () {
        modal.classList.add('open');
        overlay.classList.add('open');
    };

    // Fechar modal ao clicar no botão de fechar
    closeModal.onclick = function () {
        modal.classList.remove('open');
        overlay.classList.remove('open');
    };

    // Fechar modal ao clicar no overlay
    overlay.onclick = function () {
        modal.classList.remove('open');
        overlay.classList.remove('open');
    };

    // Função para carregar o nome do usuário no <h2>
    function loadUserName() {
        let objDados = leDados();
        if (objDados.Usuario.length > 0) {
            const usuario = objDados.Usuario[0];
            nomeElement.textContent = usuario.nome;
        }
    }

    // Chama a função para carregar os dados das ONGs
    loadCards();
    
};

// Adiciona ONG aos favoritos no servidor
function addToFavorites(ong) {
    fetch('http://localhost:3000/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ong)
    })
    .then(response => {
        if (response.ok) {
            alert(`A ONG "${ong.name}" foi adicionada aos favoritos!`);
        } else {
            alert('Erro ao adicionar a ONG aos favoritos.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao conectar ao servidor.');
    });
}

// Função para carregar os cartões ao carregar a página
function loadCards() {
    fetch('http://localhost:3000/ongs')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar os dados.');
            }
            return response.json();
        })
        .then(ongs => {
            console.log(ongs); // Verifique os dados retornados no console
            const cardBox = document.getElementById('cardBox');
            cardBox.innerHTML = ''; // Limpa os cards existentes

            // Criação dos cards com os dados obtidos
            ongs.forEach(ong => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('col-md-4');
                cardElement.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${ong.name}</h5>
                            <p class="card-text">${ong.description}</p>
                            <button class="fav">Adicionar aos Favoritos</button>
                        </div>
                    </div>
                `;
                // Adiciona o evento ao botão para salvar nos favoritos
                cardElement.querySelector('.fav').addEventListener('click', () => addToFavorites(ong));
                cardBox.appendChild(cardElement);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os dados:', error);
        });
}

// Função para carregar ONGs favoritas do servidor
function loadFavorites() {
    fetch('http://localhost:3000/favorites')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar os favoritos.');
            }
            return response.json();
        })
        .then(favorites => {
            const favoritesContainer = document.getElementById('favoritesContainer');
            favoritesContainer.innerHTML = ''; // Limpa os favoritos existentes

            favorites.forEach(ong => {
                console.log("ad");
                
                const favoriteElement = document.createElement('div');
                favoriteElement.classList.add('favorite-card');
                favoriteElement.innerHTML = `   
                    <h5>${ong.name}</h5>
                    <p>${ong.description}</p>
                `;
                favoritesContainer.appendChild(favoriteElement);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os favoritos:', error);
        });

    }
    document.addEventListener('DOMContentLoaded', function() {
        const botaoSalvar = document.getElementById('botaosalvar');
        
        if (botaoSalvar) {
            botaoSalvar.addEventListener('click', function() {
                // Adicione um console.log para testar
                console.log('Botão de salvar clicado!');
                
                // Colete os valores dos campos
                const name = document.getElementById('name').value;
                const about = document.getElementById('about').value;
                const location = document.getElementById('location').value;
                const number = document.getElementById('number').value;
                const email = document.getElementById('email').value;
                const cause = document.getElementById('cause').value;
    
                // Log dos valores para verificação
                console.log('Dados:', { name, about, location, number, email, cause });
    
                // Resto do código de salvamento
                const userData = {
                    nome: name,
                    descricao: about,
                    location: location,
                    telefone: number,
                    email: email,
                    causa: cause
                };
    
                fetch('http://localhost:3000/doadores', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                })
                .then(response => {
                    console.log('Resposta do servidor:', response);
                    if (response.ok) {
                        alert('Informações salvas com sucesso!');
                        document.getElementById('editForm').style.display = 'none';
                    } else {
                        alert('Erro ao salvar informações.');
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                    alert('Erro ao conectar ao servidor.');
                });
            });
        } else {
            console.error('Botão de salvar não encontrado!');
        }
    });