// Função para carregar o JSON e preencher o select
function carregarOngs() {
    fetch('http://localhost:3000/ongs')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(ongs => {
            const selectElement = document.getElementById('ong-select');
            ongs.forEach(ong => {
                const option = document.createElement('option');
                option.value = ong.id;
                option.textContent = ong.name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Houve um problema com a solicitação:', error);
        });
}

document.addEventListener('DOMContentLoaded', carregarOngs);

window.onload = function () {
    var profileImage = document.getElementById('profileImage');
    var modal = document.getElementById('profileModal');
    var closeModal = document.getElementById('closeModal');
    var overlay = document.getElementById('modalOverlay');

    profileImage.onclick = function() {
        modal.classList.add('open');
        overlay.classList.add('open');
    }

    closeModal.onclick = function() {
        modal.classList.remove('open');
        overlay.classList.remove('open');
    }

    overlay.onclick = function() {
        modal.classList.remove('open');
        overlay.classList.remove('open');
    }
}

const stars = document.querySelectorAll('.star');
const output = document.getElementById('rating-output');
let selectedRating = 0;

stars.forEach(star => {
    star.addEventListener('click', () => {
        const ratingValue = star.getAttribute('data-value');
        selectedRating = ratingValue; // Atualiza a avaliação selecionada
        updateStars(ratingValue);
        output.textContent = `Você avaliou com ${ratingValue} estrela${ratingValue > 1 ? 's' : ''}`;
    });
});

// Função para atualizar as estrelas
function updateStars(ratingValue) {
    stars.forEach(star => {
        star.style.color = star.getAttribute('data-value') <= ratingValue ? 'gold' : 'lightgray';
        star.classList.toggle('selected', star.getAttribute('data-value') == ratingValue);
    });
}

document.getElementById('save-btn').addEventListener('click', async function() {
    const ongId = document.getElementById('ong-select').value;
    const feedback = document.getElementById('feedback').value;

    if (!ongId || !selectedRating || !feedback) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const data = {
        rating: selectedRating, // Use o rating selecionado
        feedback: feedback
    };

    try {
        const response = await fetch(`http://localhost:3000/ongs/${ongId}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar ONG');
        }
        const ongData = await response.json();

        // Atualiza as avaliações da ONG
        const updatedAvaliacoes = [...ongData.avaliacoes, data];

        const updateResponse = await fetch(`http://localhost:3000/ongs/${ongId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                avaliacoes: updatedAvaliacoes
            })
        });

        if (!updateResponse.ok) {
            throw new Error('Erro ao salvar feedback');
        }

        alert('Feedback salvo com sucesso!');
        document.getElementById('ong-select').value = '';
        selectedRating = 0; // Resetar o rating selecionado
        document.querySelectorAll('.star-rating .star').forEach(star => star.classList.remove('selected'));
        document.getElementById('feedback').value = '';
        output.textContent = 'Você avaliou com 0 estrelas'; // Reseta a mensagem de avaliação
    } catch (error) {
        alert('Erro: ' + error.message);
    }
});

function exibirFeedbacks() {
    fetch('http://localhost:3000/ongs')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(ongs => {
            const feedbackContainer = document.getElementById('feedbackMostrar');
            feedbackContainer.innerHTML = ''; // Limpa a div antes de adicionar feedbacks
            
            ongs.forEach(ong => {
                ong.avaliacoes.forEach(avaliacao => {
                    feedbackContainer.innerHTML += `
                        <div class="avaliacao">
                            <h1>Nome da ONG: ${ong.name}</h1>
                            <h1>Avaliação foi de: ${avaliacao.rating}</h1>
                            <h1>Seu feedback:</h1>
                            <h3>${avaliacao.feedback}</h3>
                        </div>
                    `;
                });
            });
        })
        .catch(error => {
            console.error('Houve um problema ao carregar os feedbacks:', error);
        });
}

// Carregar ONGs e feedbacks ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarOngs();
    exibirFeedbacks();
});