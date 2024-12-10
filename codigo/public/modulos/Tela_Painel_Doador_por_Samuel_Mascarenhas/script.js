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
        // Requisição para a API para buscar as informações do usuário logado, incluindo o histórico de doações
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Erro ao carregar informações do doador.");

        const data = await response.json();

        // Atualizar painel de exibição
        const nomeElement = document.getElementById("nome");
        if (nomeElement) {
            nomeElement.textContent = data.name || "Nome não disponível";
        } else {
            console.warn('Elemento "nome" não encontrado!');
        }

        const descElement = document.getElementById("desc");
        if (descElement) {
            descElement.textContent = data.interests || "Descrição não disponível";
        }

        const locElement = document.getElementById("loc");
        if (locElement) {
            locElement.textContent = data.address || "Localização não disponível";
        }

        // Preencher o formulário de edição com as informações carregadas
        document.getElementById('name').value = data.name || "";
        document.getElementById('about').value = data.interests || "";
        document.getElementById('location').value = data.address || "";
        document.getElementById('number').value = data.phone || "";
        document.getElementById('email').value = data.email || "";
        document.getElementById('cause').value = data.category || "Selecionar";

        // Exibir imagem de perfil se houver
        if (data.profilePic) {
            const profilePicElement = document.getElementById('profilePic');
            if (profilePicElement) {
                profilePicElement.src = data.profilePic;
            }
        }

        // Verificar se 'historico' é um array e obter apenas o histórico do usuário logado
        const historico = Array.isArray(data.historico) ? data.historico : [];
        console.log("Histórico de Doações do Usuário:", historico);  // Log para verificar o histórico

        // Limpar a lista de doações antes de adicionar as novas
        const historicoListaElement = document.getElementById("historico-lista");
        if (historicoListaElement) {
            historicoListaElement.innerHTML = ''; // Limpar a lista
        }

        // Calcular o total doado e exibir cada doação na tabela
        let totalDoado = 0;
        historico.forEach(doacao => {
            // Extraindo o valor de forma segura e convertendo para número
            const valor = parseFloat(doacao.valor.replace("R$", "").replace(",", "."));
            if (!isNaN(valor)) {
                totalDoado += valor;
            } else {
                console.warn(`Valor inválido encontrado: ${doacao.valor}`);
            }

            // Criar uma nova linha para a tabela
            const linha = document.createElement("tr");

            // Criar e preencher as células para data, valor e projeto
            const dataCell = document.createElement("td");
            dataCell.textContent = doacao.data || "Data não disponível";
            linha.appendChild(dataCell);

            const valorCell = document.createElement("td");
            valorCell.textContent = `R$ ${valor.toFixed(2)}`;
            linha.appendChild(valorCell);

            const projetoCell = document.createElement("td");
            projetoCell.textContent = doacao.projeto || "Projeto não informado";
            linha.appendChild(projetoCell);

            // Adicionar a linha à tabela
            historicoListaElement.appendChild(linha);
        });

        // Exibir o total doado
        const totalDoadoElement = document.getElementById("total-doado");
        if (totalDoadoElement) {
            totalDoadoElement.textContent = `Total Doado: R$ ${totalDoado.toFixed(2)}`;
        }

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar informações do perfil.");
    }
}




// Carregar dados do db.json
async function carregarDados() {
    try {
        // Fazendo a requisição para obter os dados do JSON
        const response = await fetch('http://localhost:3001/');
        if (!response.ok) {
            throw new Error("Erro ao carregar dados: " + response.statusText);
        }

        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("A resposta não é um JSON válido!");
        }

        const data = await response.json();

        // Exibindo os prêmios dinamicamente no HTML
        const premiosContainer = document.getElementById("premios");
        if (premiosContainer) {
            premiosContainer.innerHTML = ""; // Limpar conteúdo anterior

            // Criar um card para cada prêmio no array
            (data.premios || []).forEach(premio => {
                const premioCard = document.createElement("div");
                premioCard.classList.add("premio-card");

                // Adicionando o conteúdo do prêmio ao card
                premioCard.innerHTML = `
                    <h4>R$ ${premio.valor}</h4>
                    <p>${premio.descricao}</p>
                `;

                // Adicionando o card ao container de prêmios
                premiosContainer.appendChild(premioCard);
            });
        }

        // Exibindo o impacto dinâmicamente
        const impactoContainer = document.querySelector(".impacto");
        if (impactoContainer) {
            impactoContainer.innerHTML = `
                <p id="impacto-msg">${data.impacto.mensagem}</p>
                <progress value="${data.impacto.percentual}" max="100" class="progresso" id="progresso-bar"></progress>
                <p id="progresso-desc">${data.impacto.percentual}% do objetivo alcançado!</p>
            `;
        }
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }
}

// Inicializa a página ao carregar
document.addEventListener("DOMContentLoaded", function () {
    carregarInformacoes();
    carregarDados();

    // Configurar modal de histórico
    document.getElementById('abrir-modal').onclick = function () {
        carregarHistorico();
        document.getElementById('historicoModal').style.display = "block";
    };

    document.getElementById('fechar-modal').onclick = function () {
        document.getElementById('historicoModal').style.display = "none";
    };
});



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







// -------------------

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
                                    <button class="btn-primary-4" onclick="abrirFormularioFeedback('${ong.id}')">Avaliar ONG</button>
                                    <button class="btn-secondary-4" onclick="abrirFormularioDoacao('${ong.id}')">Doar Novamente</button>
                                </div>
                            </div>
                        </div>`;
                    contribuidasCardsContainer.innerHTML += cardHTML; // Adiciona o card ao contêiner
                });
            })
            .catch((error) => console.error("Erro ao carregar ONGs contribuídas:", error));
    }

    // Função para abrir o formulário de doação
    window.abrirFormularioDoacao = function(idOng) {
        // Mostra o modal de doação
        const modal = document.querySelector(".modal-doacao");
        modal.style.display = "block";
    
        // Definir a ONG para a doação
        document.getElementById("doar-novamente-btn").onclick = function () {
            const valor = parseFloat(document.getElementById("valor-doacao").value);
            const mensagem = document.getElementById("mensagem-doacao").value;
    
            if (isNaN(valor) || valor <= 0) {
                alert("Por favor, insira um valor válido.");
                return;
            }
    
            if (!mensagem.trim()) {
                alert("A mensagem é obrigatória.");
                return;
            }
    
            // Obter o ID do doador do localStorage
            const doadorId = localStorage.getItem("donorId");
            if (!doadorId) {
                alert("Doador não encontrado.");
                return;
            }
    
            // Buscar o histórico de doações do doador
            fetch(`http://localhost:3001/donors/${doadorId}`)
                .then(response => response.json())
                .then(doador => {
                    const historicoAtualizado = [
                        ...doador.historico,
                        {
                            data: new Date().toISOString().split('T')[0], // Data atual no formato YYYY-MM-DD
                            valor: `R$ ${valor.toFixed(2)}`,
                            projeto: `Doação para ONG ${idOng}`,
                            id: generateUniqueId()
                        }
                    ];
    
                    // Atualizar o histórico do doador
                    return fetch(`http://localhost:3001/donors/${doadorId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            historico: historicoAtualizado
                        })
                    });
                })
                .then(() => {
                    // Adicionar a doação à lista de doações
                    return fetch("http://localhost:3001/doacoes", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            idDoador: doadorId,
                            nome: localStorage.getItem("donorName"),
                            idOng: idOng,
                            valor: valor,
                            data: new Date().toISOString().split('T')[0],
                            mensagem: mensagem,
                            status: "pendente"
                        })
                    });
                })
                .then(() => {
                    alert("Doação realizada com sucesso!");
                    modal.style.display = "none"; // Fecha o modal após a doação ser registrada
                    fetchAndRenderOngsContribuidas(); // Atualiza a lista de ONGs
                    carregarHistorico(); // Atualiza o histórico de doações
                })
                .catch(error => {
                    console.error("Erro ao processar a doação:", error);
                    alert("Ocorreu um erro ao processar sua doação.");
                });
        }
    };
    
    // Função para gerar um ID único para cada doação
    function generateUniqueId() {
        return Math.random().toString(36).substr(2, 9);
    }
    

    // Função para fechar o modal de doação
    document.querySelector(".close-doacao").onclick = function () {
        const modal = document.querySelector(".modal-doacao");
        modal.style.display = "none";
    };

    // Chama a função para buscar e renderizar as ONGs contribuídas
    fetchAndRenderOngsContribuidas();
});

let ongSelecionadaId = null; // Variável para armazenar o ID da ONG selecionada

// Função para abrir o formulário de feedback
function abrirFormularioFeedback(ongId) {
  ongSelecionadaId = ongId; // Salva o ID da ONG selecionada
  const feedbackDiv = document.querySelector('.feedback');
  feedbackDiv.style.display = 'block'; // Exibe o formulário de feedback
}

// Função para enviar o feedback
function enviarFeedback() {
  const avaliacao = document.getElementById('avaliacao').value;
  const comentario = document.getElementById('comentario-doador').value;

  if (!ongSelecionadaId) {
    console.error("Erro: Nenhuma ONG selecionada.");
    return;
  }

  // Dados do feedback
  const feedback = {
    ongId: ongSelecionadaId,
    avaliacao,
    comentario,
  };

  console.log("Feedback enviado:", feedback);

  // Simulação de envio para a API
  fetch(`http://localhost:3001/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedback),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao enviar o feedback");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Feedback salvo com sucesso:", data);
      fecharFormularioFeedback();
    })
    .catch((error) => {
      console.error("Erro ao enviar o feedback:", error);
    });
}

// Função para fechar o formulário
function fecharFormularioFeedback() {
  document.getElementById('FormFeedback').style.display = 'none';
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
        // Fazendo a requisição ao endpoint correto para obter o histórico de doações
        const response = await fetch('http://localhost:3001/doacoes');
        if (!response.ok) throw new Error(`Erro ao carregar dados: ${response.status} ${response.statusText}`);

        const data = await response.json();

        // Itera sobre os dados do histórico
        for (const doacao of data) {
            // Buscar o nome da ONG usando o idOng
            const ongResponse = await fetch(`http://localhost:3001/ongs/${doacao.idOng}`);
            
            if (!ongResponse.ok) {
                // Se a ONG não for encontrada, define um nome padrão
                console.error(`Erro ao buscar ONG com id ${doacao.idOng}`);
                var nomeOng = 'ONG não encontrada';
            } else {
                const ongData = await ongResponse.json();
                nomeOng = ongData.orgName || 'Nome da ONG não disponível';
            }

            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${doacao.data}</td>
                <td>R$ ${doacao.valor.toFixed(2)}</td>
                <td>${nomeOng}</td>
            `;
            lista.appendChild(linha);
        }
    } catch (error) {
        console.error('Erro ao carregar o histórico:', error);
        lista.innerHTML = '<tr><td colspan="3">Erro ao carregar o histórico</td></tr>';
    }
}




// 




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

const swiper = new Swiper('.swiper-container', {
    loop: true,
    slidesPerView: 1, // ajuste conforme necessário
    slidesPerGroup: 1, // ajuste conforme necessário
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
