// URL base do JSON Server
const API_URL = 'http://localhost:3001/donors';


// Função para alternar a visibilidade do formulário de edição
function toggleEdit() {
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.style.display = editForm.style.display === 'block' ? 'none' : 'block';
    }
}

// Função para fechar o formulário de edição
function fecharFormulario() {
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.style.display = 'none';
    }
}

// Função para exibir a pré-visualização da imagem de perfil
function previewImage(event) {
    const output = document.getElementById('profilePic');
    if (output) {
        output.src = URL.createObjectURL(event.target.files[0]);
    }
}

// Carregar informações do perfil do doador
async function carregarInformacoes() {
    const id = localStorage.getItem('donorId');
    if (!id) {
        alert("ID do doador não encontrado. Faça login novamente.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Erro ao carregar informações do doador.");

        const data = await response.json();

        // Atualizar painel de exibição
        document.getElementById("nome").textContent = data.name || "Nome não disponível";
        document.getElementById("desc").textContent = data.interests || "Descrição não disponível";
        document.getElementById("loc").textContent = data.address || "Localização não disponível";
        document.getElementById("total-doado").textContent = `R$ ${data.totalDoado || 0}`;
        document.getElementById("doacoes-recorrentes").textContent = `R$ ${data.doacoesRecorrentes || 0}/mês`;
        document.getElementById("nivel-badge").textContent = data.nivel || "Iniciante";
        document.getElementById("nivel-desc").textContent = `Você está no nível ${data.nivel || "Iniciante"}. Continue contribuindo para subir de nível.`;

        // Atualizar prêmios
        const premiosContainer = document.getElementById("premios");
        if (premiosContainer) {
            premiosContainer.innerHTML = "";
            (data.premios || []).forEach(premio => {
                const premioDiv = document.createElement("div");
                premioDiv.classList.add("premio");
                premioDiv.innerHTML = `
                    <h4>R$ ${premio.valor}</h4>
                    <p>${premio.descricao}</p>
                `;
                premiosContainer.appendChild(premioDiv);
            });
        }

        // Atualizar impacto
        document.getElementById("impacto-msg").textContent = data.impacto?.mensagem || "Sem impacto disponível.";
        document.getElementById("progresso-bar").value = data.impacto?.percentual || 0;
        document.getElementById("progresso-desc").textContent = `Faltam ${100 - (data.impacto?.percentual || 0)}% para o próximo marco! Vamos lá!`;

        // Preencher o formulário de edição com as informações carregadas
        document.getElementById('name').value = data.name || "";
        document.getElementById('about').value = data.interests || "";
        document.getElementById('location').value = data.address || "";
        document.getElementById('number').value = data.phone || "";
        document.getElementById('email').value = data.email || "";
        document.getElementById('cause').value = data.category || "Selecionar";

        // Exibir imagem de perfil se houver
        if (data.profilePic) {
            document.getElementById('profilePic').src = data.profilePic;
        }

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar informações do perfil.");
    }
}


// Função para salvar as informações editadas
async function salvarInformacoes() {
    const id = localStorage.getItem('donorId');
    if (!id) {
        alert("ID do doador não encontrado. Faça login novamente.");
        return;
    }

    const nome = document.getElementById('name').value;
    const sobre = document.getElementById('about').value;
    const localizacao = document.getElementById('location').value;
    const telefone = document.getElementById('number').value;
    const email = document.getElementById('email').value;
    const causa = document.getElementById('cause').value;

    const db = {
        name: nome,
        interests: sobre,
        address: localizacao,
        phone: telefone,
        email: email,
        category: causa,
    };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(db),
        });

        if (response.ok) {
            alert("Informações atualizadas com sucesso!");
            carregarInformacoes();
            fecharFormulario();      // Fechar o formulário de edição
        } else {
            throw new Error("Erro ao atualizar as informações.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao salvar as informações. Tente novamente.");
    }
}

// Inicializa a página ao carregar
document.addEventListener("DOMContentLoaded", function () {
    carregarInformacoes();

    // Configurar modal de histórico
    document.getElementById('abrir-modal').onclick = function () {
        carregarHistorico();
        document.getElementById('historicoModal').style.display = "block";
    };

    document.getElementById('fechar-modal').onclick = function () {
        document.getElementById('historicoModal').style.display = "none";
    };
});

// Função para carregar o histórico de doações
async function carregarHistorico() {
    const lista = document.getElementById('historico-lista');
    lista.innerHTML = '';

    try {
        const response = await fetch(`${API_URL}/historico`);
        if (!response.ok) throw new Error("Erro ao carregar histórico.");

        const data = await response.json();

        data.forEach(doacao => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${doacao.data}</td>
                <td>${doacao.valor}</td>
                <td>${doacao.projeto}</td>
            `;
            lista.appendChild(linha);
        });
    } catch (error) {
        console.error(error);
        lista.innerHTML = '<tr><td colspan="3">Erro ao carregar o histórico.</td></tr>';
    }
}


// -------------------


function enviarFeedback() {
    const avaliacao = document.getElementById('avaliacao').value;
    const comentario = document.getElementById('comentario-doador').value;
    console.log(`Avaliação: ${avaliacao}`);
    console.log(`Comentário: ${comentario}`);
    // Aqui você pode enviar os dados para a API ou armazená-los conforme necessário
}


// Função para abrir o modal
document.getElementById('abrir-modal').onclick = function () {
    carregarHistorico(); // Carrega os dados dinamicamente
    document.getElementById('historicoModal').style.display = "block";
};

document.getElementById('fechar-modal').onclick = function () {
    document.getElementById('historicoModal').style.display = "none";
};


// ------------------
// Função para preencher o histórico de forma dinâmica
async function carregarHistorico() {
    const lista = document.getElementById('historico-lista');

    // Limpa a tabela antes de adicionar novos dados
    lista.innerHTML = '';

    try {
        // Fazendo a requisição ao endpoint correto
        const response = await fetch('http://localhost:3001/historico');
        if (!response.ok) throw new Error(`Erro ao carregar dados: ${response.status} ${response.statusText}`);

        const data = await response.json();

        // Itera sobre os dados do histórico
        data.forEach(doacao => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${doacao.data}</td>
                <td>${doacao.valor}</td>
                <td>${doacao.projeto}</td>
            `;
            lista.appendChild(linha);
        });
    } catch (error) {
        console.error('Erro ao carregar o histórico:', error);
        lista.innerHTML = '<tr><td colspan="3">Erro ao carregar o histórico</td></tr>';
    }
}

// 

// Função para mostrar a div de feedback
function mostrarFeedback() {
    const feedbackDiv = document.querySelector('.feedback');
    //feedbackDiv.style.display = 'block' || 'none'; // Exibe a div de feedback


    // Alterna a visibilidade do formulário feedback
    if (feedbackDiv.style.display === 'none' || feedbackDiv.style.display === '') {
        feedbackDiv.style.display = 'block';  // Exibe o formulário
    } else {
        feedbackDiv.style.display = 'none';  // Oculta o formulário
    }
}

// Função para fechar o formulário
function fecharFormularioFeedback() {
    document.getElementById('FormFeedback').style.display = 'none';  // Oculta o formulário
}
document.addEventListener("DOMContentLoaded", function () {
    const ongCardsContainer = document.getElementById("ong-cards-container");

    // Função para buscar ONGs favoritas e renderizar os cards
    function fetchAndRenderOngsFavoritas() {
        fetch("http://localhost:3001/ongsFavoritas") // Endpoint do JSON Server para "ongsFavoritas"
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar ONGs favoritas");
                }
                return response.json();
            })
            .then((ongsFavoritas) => {
                ongCardsContainer.innerHTML = ""; // Limpa qualquer conteúdo existente

                ongsFavoritas.forEach((ong) => {
                    const cardHTML = `
                        <div class="col-md-4 mb-4 d-flex justify-content-center">
                            <div class="card">
                                <img class="card-img-top" src="${ong.imagem}" alt="${ong.nome}">
                                <div class="card-body">
                                    <h5 class="card-title">${ong.nome}</h5>
                                    <p class="card-text">${ong.descricao}</p>
                                    <a href="${ong.link}" class="btn btn-primary-2">Ver Detalhes</a>
                                </div>
                            </div>
                        </div>`;
                    ongCardsContainer.innerHTML += cardHTML; // Adiciona o card ao contêiner
                });
            })
            .catch((error) => console.error("Erro ao carregar ONGs favoritas:", error));
    }

    // Chama a função para buscar e renderizar as ONGs favoritas
    fetchAndRenderOngsFavoritas();
});

document.addEventListener("DOMContentLoaded", function () {
    const recomendacoesCardsContainer = document.getElementById("recomendacoes-cards-container");

    // Função para buscar ONGs recomendadas e renderizar os cards
    function fetchAndRenderOngsRecomendadas() {
        fetch("http://localhost:3001/ongsRecomendadas") // Endpoint do JSON Server para "ongsRecomendadas"
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar ONGs recomendadas");
                }
                return response.json();
            })
            .then((ongsRecomendadas) => {
                recomendacoesCardsContainer.innerHTML = ""; // Limpa qualquer conteúdo existente

                ongsRecomendadas.forEach((ong) => {
                    const cardHTML = `
                        <div class="col-md-4 mb-4 d-flex justify-content-center">
                            <div class="card">
                                <img class="card-img-top" src="${ong.imagem}" alt="${ong.nome}">
                                <div class="card-body">
                                    <h5 class="card-title">${ong.nome}</h5>
                                    <p class="card-text">${ong.descricao}</p>
                                    <a href="${ong.link}" class="btn btn-primary-2">Ver Detalhes</a>
                                </div>
                            </div>
                        </div>`;
                    recomendacoesCardsContainer.innerHTML += cardHTML; // Adiciona o card ao contêiner
                });
            })
            .catch((error) => console.error("Erro ao carregar ONGs recomendadas:", error));
    }

    // Chama a função para buscar e renderizar as ONGs recomendadas
    fetchAndRenderOngsRecomendadas();
});

document.addEventListener("DOMContentLoaded", function () {
    const contribuidasCardsContainer = document.getElementById("contribuidas-cards-container");

    // Função para buscar e renderizar as ONGs contribuídas
    function fetchAndRenderOngsContribuidas() {
        fetch("http://localhost:3001/ongsContribuidas") // Endpoint do JSON Server
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar ONGs contribuídas");
                }
                return response.json();
            })
            .then((ongsContribuidas) => {
                contribuidasCardsContainer.innerHTML = ""; // Limpa o conteúdo existente

                ongsContribuidas.forEach((ong) => {
                    const cardHTML = `
                        <div class="col-md-4 mb-4 d-flex justify-content-center">
                            <div class="card">
                                <img class="card-img-top" src="${ong.imagem}" alt="${ong.nome}">
                                <div class="card-body">
                                    <h5 class="card-title">${ong.nome}</h5>
                                    <p class="card-text">${ong.descricao}</p>
                                    <a href="#FormFeedback">
                                        <button type="button" class="btn btn-primary-2" onclick="mostrarFeedback()">Avaliar</button>
                                    </a>
                                </div>
                            </div>
                        </div>`;
                    contribuidasCardsContainer.innerHTML += cardHTML; // Adiciona o card ao contêiner
                });
            })
            .catch((error) => console.error("Erro ao carregar ONGs contribuídas:", error));
    }

    // Chama a função para buscar e renderizar as ONGs contribuídas
    fetchAndRenderOngsContribuidas();
});


document.addEventListener("DOMContentLoaded", function () {
    const fotosContainer = document.getElementById("fotos-recentes-container");
    const videosContainer = document.getElementById("videos-recentes-container");

    // Função para buscar e renderizar as mídias (fotos e vídeos)
    function fetchAndRenderMidias() {
        fetch("http://localhost:3001/midias") // Endpoint do JSON Server
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar mídias");
                }
                return response.json();
            })
            .then((midias) => {
                // Renderizar fotos
                midias.fotos.forEach((foto) => {
                    const fotoHTML = `
                        <a href="${foto.src}" data-lightbox="fotos-recentes">
                            <img src="${foto.src}" alt="${foto.alt}">
                        </a>`;
                    fotosContainer.innerHTML += fotoHTML;
                });

                // Renderizar vídeos
                midias.videos.forEach((video) => {
                    const videoHTML = `
                        <video controls>
                            <source src="${video.src}" type="${video.type}">
                            Seu navegador não suporta o formato de vídeo.
                        </video>`;
                    videosContainer.innerHTML += videoHTML;
                });
            })
            .catch((error) => console.error("Erro ao carregar mídias:", error));
    }

    // Chama a função para buscar e renderizar as mídias
    fetchAndRenderMidias();
});


document.addEventListener("DOMContentLoaded", function () {
    const feedbackContainer = document.getElementById("feedback-container");

    // Função para buscar e renderizar os feedbacks
    function fetchAndRenderFeedbacks() {
        fetch("http://localhost:3001/feedbacks") // Endpoint do JSON Server
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar feedbacks");
                }
                return response.json();
            })
            .then((feedbacks) => {
                feedbacks.forEach((feedback) => {
                    const feedbackHTML = `
                        <div class="swiper-slide">
                            <div class="testimonial-item">
                                <h3>${feedback.ong}</h3>
                                <p>
                                    <i class="bi bi-quote quote-icon-left"></i>
                                    <span>${feedback.feedback}</span>
                                    <i class="bi bi-quote quote-icon-right"></i>
                                </p>
                            </div>
                        </div>`;
                    feedbackContainer.innerHTML += feedbackHTML;
                });

                // Reinitialize Swiper after content is dynamically loaded
                const swiperConfig = JSON.parse(
                    document.querySelector(".swiper-config").textContent
                );
                new Swiper(".init-swiper", swiperConfig);
            })
            .catch((error) => console.error("Erro ao carregar feedbacks:", error));
    }

    // Chama a função para buscar e renderizar os feedbacks
    fetchAndRenderFeedbacks();
});
