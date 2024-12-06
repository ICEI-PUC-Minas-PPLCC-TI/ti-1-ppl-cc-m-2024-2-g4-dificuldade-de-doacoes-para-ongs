// URL base do JSON Server
const API_URL = "http://localhost:3001/perfilDoador";

// Função para alternar entre o formulário de edição e visualização
function toggleEdit() {
    var editForm = document.getElementById('editForm');

    // Alterna a visibilidade do formulário
    if (editForm.style.display === 'none' || editForm.style.display === '') {
        editForm.style.display = 'block';  // Exibe o formulário
    } else {
        editForm.style.display = 'none';  // Oculta o formulário
    }
}

// Função para fechar o formulário
function fecharFormulario() {
    document.getElementById('editForm').style.display = 'none';  // Oculta o formulário
}


// Função para exibir a pré-visualização da imagem de perfil
function previewImage(event) {
    var output = document.getElementById('profilePic');
    output.src = URL.createObjectURL(event.target.files[0]);
}

// Modal Profile
window.onload = function () {
    // Verifique se os elementos existem antes de definir o evento
    const closeModalButton = document.getElementById("closeModal");
    const profileModal = document.getElementById("profileModal");
    const modalOverlay = document.getElementById("modalOverlay");

    if (closeModalButton && profileModal && modalOverlay) {
        closeModalButton.onclick = function () {
            profileModal.style.display = "none";
            modalOverlay.style.display = "none";
        };

        profileModal.style.display = "block";
        modalOverlay.style.display = "block";
    }
};

// Dados de exemplo para o doador
const doador = {
    nivel: "Iniciante",
    totalDoado: 1200,
    doacoesRecorrentes: 500,
    premios: [
        { valor: 100, descricao: "Certificado de Agradecimento" },
        { valor: 500, descricao: "Cupom de Desconto" },
        { valor: 1000, descricao: "Camiseta Exclusiva" }
    ],
    impacto: {
        percentual: 50,
        mensagem: "Você ajudou a financiar a educação de 50 crianças! Obrigado por fazer a diferença!"
    }
};

// Função para atualizar os dados no painel
// Função para atualizar os dados no painel
function atualizarPainel() {
    const nome = document.getElementById('name').value;
    const sobre = document.getElementById('about').value;
    const localizacao = document.getElementById('location').value;
    const telefone = document.getElementById('number').value;
    const email = document.getElementById('email').value;
    const causa = document.getElementById('cause').value;

    document.getElementById("nome").textContent = nome;
    document.getElementById("desc").textContent = sobre;
    document.getElementById("loc").textContent = localizacao;

    document.getElementById("total-doado").textContent = `R$ ${doador.totalDoado}`;
    document.getElementById("doacoes-recorrentes").textContent = `R$ ${doador.doacoesRecorrentes}/mês`;
    document.getElementById("nivel-badge").textContent = doador.nivel;
    document.getElementById("nivel-desc").textContent = `Você está no nível ${doador.nivel}! Continue contribuindo para subir de nível.`;

    const premiosContainer = document.getElementById("premios");
    premiosContainer.innerHTML = ""; // Limpa os prêmios anteriores
    doador.premios.forEach(premio => {
        const premioDiv = document.createElement("div");
        premioDiv.classList.add("premio");
        premioDiv.innerHTML = `
                <h4>R$ ${premio.valor}</h4>
                <p>${premio.descricao}</p>
            `;
        premiosContainer.appendChild(premioDiv);
    });

    document.getElementById("impacto-msg").textContent = doador.impacto.mensagem;
    document.getElementById("progresso-bar").value = doador.impacto.percentual;
    document.getElementById("progresso-desc").textContent = `Faltam ${100 - doador.impacto.percentual}% para o próximo marco! Vamos lá!`;
}


atualizarPainel();

// Função para salvar as informações editadas no JSON Server
async function salvarInformacoes() {
    var nome = document.getElementById('name').value;
    var sobre = document.getElementById('about').value;
    var localizacao = document.getElementById('location').value;
    var telefone = document.getElementById('number').value;
    var email = document.getElementById('email').value;
    var causa = document.getElementById('cause').value;
    var imagem = document.getElementById('uploadImage').files[0];

    var db = {
        nome: nome,
        sobre: sobre,
        localizacao: localizacao,
        telefone: telefone,
        email: email,
        causa: causa,
        imagem: imagem
    };


    const id = 1; // ID do perfil a ser atualizado

    try {
        // Verifica se o perfil com o ID já existe
        const getResponse = await fetch(API_URL + '/' + id); // URL corrigida
        if (getResponse.ok) {
            // Se o perfil existe, faz o PUT para atualizar
            const putResponse = await fetch(API_URL + '/' + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(db)
            });

            if (putResponse.ok) {
                alert("Informações atualizadas com sucesso!");
                // Chama a função para atualizar o painel com os dados mais recentes
                atualizarPainel();
            } else {
                alert("Erro ao atualizar as informações.");
            }
        } else {
            // Se o perfil não existir, faz o POST para criar um novo
            const postResponse = await fetch(API_URL, { // URL corrigida para POST
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(db)
            });

            if (postResponse.ok) {
                alert("Perfil criado com sucesso!");
                // Chama a função para atualizar o painel com os dados mais recentes
                atualizarPainel();
            } else {
                alert("Erro ao criar o perfil.");
            }
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Ocorreu um erro ao tentar salvar as informações.");
    }

    toggleEdit(); // Fecha o modal ou formulário de edição
}



// Função para carregar as informações do perfil do JSON Server
async function carregarInformacoes() {
    const id = 1; // ID do perfil a ser carregado

    try {
        const response = await fetch(API_URL + '/' + id); // A URL agora busca pelo ID
        if (response.ok) {
            const perfil = await response.json();

            // Verifique o conteúdo do perfil no console
            console.log("Dados recebidos do servidor:", perfil);

            // Atualize os campos com os dados do perfil
            document.getElementById('nome').textContent = perfil.nome || '';
            document.getElementById('desc').textContent = perfil.sobre || '';
            document.getElementById('loc').textContent = perfil.localizacao || '';

            document.getElementById('name').value = perfil.nome || '';
            document.getElementById('about').value = perfil.sobre || '';
            document.getElementById('location').value = perfil.localizacao || '';
            document.getElementById('number').value = perfil.telefone || '';
            document.getElementById('email').value = perfil.email || '';
            document.getElementById('cause').value = perfil.causa || '';
        } else {
            console.warn("Erro ao carregar os dados do servidor.");
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
    }
}



// Chama a função para carregar os dados do perfil ao abrir a página
carregarInformacoes();

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
