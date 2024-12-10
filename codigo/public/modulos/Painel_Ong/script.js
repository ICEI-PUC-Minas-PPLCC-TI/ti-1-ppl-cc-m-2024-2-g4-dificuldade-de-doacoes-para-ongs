document.addEventListener('DOMContentLoaded', () => {
    // Tabs
    const tabs = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    // Função para enviar o novo projeto para o servidor
    document.getElementById('createProjectForm').addEventListener('submit', async (e) => {
        e.preventDefault();  // Impede o envio padrão do formulário

        // Captura os dados do formulário
        const projectData = {
            title: document.getElementById('projectName').value,
            description: document.getElementById('projectDescription').value,
            category: document.getElementById('projectCategory').value,
            goal: parseFloat(document.getElementById('projectGoal').value),
            image: Array.from(document.getElementById('projectImages').files).map(file => file.name), // Nomes das imagens (a lógica de upload pode ser adaptada)
            projectLeader: document.getElementById('projectLeader').value,
            contact: document.getElementById('projectContact').value,
            location: document.getElementById('projectLocation').value,
            startDate: document.getElementById('projectStartDate').value,
            endDate: document.getElementById('projectEndDate').value || null,
            ngoId: 1  // ID da ONG, você pode alterar isso conforme necessário ou capturar dinamicamente.
        };

        // Validação dos campos obrigatórios
        if (!projectData.title || !projectData.description || !projectData.category || !projectData.goal || !projectData.projectLeader || !projectData.contact || !projectData.location || !projectData.startDate) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Envia os dados para o servidor
        try {
            const response = await fetch('http://localhost:3001/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData),
            });

            if (response.ok) {
                const newProject = await response.json();
                alert('Projeto criado com sucesso!');
                // Você pode redirecionar o usuário ou limpar o formulário aqui, se desejar.
                document.getElementById('createProjectForm').reset();
            } else {
                throw new Error('Erro ao criar o projeto');
            }
        } catch (error) {
            console.error('Erro ao salvar o projeto:', error);
            alert('Houve um problema ao criar o projeto.');
        }
    });

    // Função para exibir os projetos no formato de cards
    async function displayProjects() {
        const projectsContainer = document.getElementById("publishedProjectsContainer"); // Atualizado para o novo ID

        // Limpa os projetos existentes na tela antes de adicionar novos
        projectsContainer.innerHTML = '';

        // Realiza a requisição para obter os dados dos projetos
        const projects = await fetchData('projects'); // Ajuste a URL conforme necessário

        // Verifica se existem projetos
        if (projects && projects.length > 0) {
            projects.forEach(project => {
                const projectCard = document.createElement("li"); // Criando o item da lista
                projectCard.classList.add("list-group-item");

                projectCard.innerHTML = `
            <div class="card">
                <img src="${project.image || 'default-image.jpg'}" alt="${project.title}" class="card-img-top"> <!-- Usando uma imagem padrão -->
                <div class="card-body">
                    <h5 class="card-title">${project.title}</h5>
                    <p class="card-category">${project.category}</p>
                    <a href="${project.link || '#'}" class="btn btn-primary">Ver Detalhes</a>
                </div>
            </div>
            `;

                // Adiciona o card ao container de projetos
                projectsContainer.appendChild(projectCard);
            });
        } else {
            projectsContainer.innerHTML = '<li class="list-group-item">Nenhum projeto encontrado.</li>';
        }
    }

// Função para controlar a navegação entre as abas
function setupNavigation() {
    const projectsButton = document.getElementById("projectsButton");
    const createProjectsTab = document.getElementById("createProjectsTab");
    const viewDonationsTab = document.getElementById("viewDonationsTab");
    const viewDonorsTab = document.getElementById("viewDonorsTab");
    const postStoriesTab = document.getElementById("postStoriesTab");
    const generateReportsTab = document.getElementById("generateReportsTab");
    const manageProfileTab = document.getElementById("manageProfileTab");

    // Função para esconder todas as abas
    function hideTabs() {
        const tabs = document.querySelectorAll(".tab-content");
        tabs.forEach(tab => tab.classList.add("d-none"));
    }

    // Verificar se o elemento existe antes de tentar manipulá-lo
    if (projectsButton) {
        projectsButton.addEventListener('click', () => {
            hideTabs();
            const projectsTab = document.getElementById("projectsTab");
            if (projectsTab) {
                projectsTab.classList.remove("d-none"); // Exibe a aba de projetos
                displayProjects(); // Exibe os projetos ao abrir a aba
            }
        });
    }

    // Adicionar eventos semelhantes para as outras abas, como "Criar Projetos", "Visualizar", etc.
    if (createProjectsTab) {
        createProjectsTab.addEventListener('click', () => {
            hideTabs();
            const createProjectsTabContent = document.getElementById("createProjectsTabContent");
            if (createProjectsTabContent) {
                createProjectsTabContent.classList.remove("d-none");
            }
        });
    }

    // Outros botões de navegação, conforme necessário
}

// Chama a função para configurar a navegação ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    displayProjects();
});


    // Função para buscar os dados de projetos do servidor
    async function fetchData(endpoint) {
        try {
            const response = await fetch(`http://localhost:3001/${endpoint}`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            return null; // Retorna null em caso de erro
        }
    }

    // Função para alternar as abas
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.id.replace('Tab', '')).classList.add('active');

            // Quando a aba de projetos for ativada, recarregue os projetos
            if (tab.id === 'projectsTab') {
                displayProjects();
            }
        });
    });

    // Chama a função para exibir os projetos ao carregar a página
    displayProjects();

    // Load Donations
    fetchData('doacoes').then(doacoes => {
        const list = document.getElementById('donationsList');

        if (doacoes.length > 0) {
            list.innerHTML = doacoes.map(d => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <strong>${d.nome || 'Anônimo'}</strong>: ${d.mensagem || 'Sem descrição'} - 
                <strong>R$${d.valor.toFixed(2)}</strong>
            </div>
            <button class="btn btn-primary btn-sm sendMessageButton" data-id="${d.id}" data-ong="${d.idOng}">
                Enviar Mensagem
            </button>
            <div class="messageBox" style="display: none; margin-top: 10px;">
                <textarea class="form-control feedbackMessage" rows="2" placeholder="Escreva sua mensagem"></textarea>
                <button class="btn btn-success btn-sm saveMessageButton" data-id="${d.id}" data-ong="${d.idOng}">
                    Enviar
                </button>
                <button class="btn btn-secondary btn-sm cancelMessageButton">
                    Cancelar
                </button>
            </div>
        </li>
        
            `).join('');
        } else {
            list.innerHTML = '<li class="list-group-item">Nenhuma doação encontrada.</li>';
        }

        // Lógica para abrir/fechar a caixa de texto
        document.querySelectorAll('.sendMessageButton').forEach(button => {
            button.addEventListener('click', () => {
                const messageBox = button.nextElementSibling;
                messageBox.style.display = 'block';
            });
        });

        document.querySelectorAll('.cancelMessageButton').forEach(button => {
            button.addEventListener('click', () => {
                const messageBox = button.parentElement;
                messageBox.style.display = 'none';
            });
        });

        // Lógica para enviar o feedback
        document.querySelectorAll('.saveMessageButton').forEach(button => {
            button.addEventListener('click', async () => {
                const idDoacao = button.dataset.id;
                const idOng = button.dataset.ong;
                const messageBox = button.parentElement;
                const feedbackMessage = messageBox.querySelector('.feedbackMessage').value;

                if (feedbackMessage.trim() === '') {
                    alert('Por favor, escreva uma mensagem antes de enviar.');
                    return;
                }

                // Obter a ONG para vincular ao feedback
                const ongData = await fetch(`http://localhost:3001/ongs/${idOng}`).then(res => res.json());

                const feedback = {
                    id: idDoacao,
                    ong: ongData.nome || "ONG Desconhecida",
                    feedback: feedbackMessage
                };

                // Salvar feedback no servidor (db.json)
                await fetch(`http://localhost:3001/feedbacks`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(feedback)
                }).then(response => response.json())
                    .then(data => {
                        alert('Mensagem enviada com sucesso!');
                        messageBox.style.display = 'none';
                    })
                    .catch(error => {
                        console.error('Erro ao salvar o feedback:', error);
                        alert('Erro ao enviar a mensagem.');
                    });
            });
        });
    }).catch(error => {
        console.error('Erro ao carregar as doações:', error);
        alert('Erro ao carregar as doações.');
    });

    // Load Donors
    fetchData('donors').then(donors => {
        const list = document.getElementById('donorsList');
        list.innerHTML = donors.map(d => `<li class="list-group-item">${d.name} (${d.email})</li>`).join('');
    }).catch(error => {
        console.error(error);
        alert('Erro ao carregar os doadores.');
    });

    // Post Stories
    document.getElementById('postStoryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const story = {
            title: document.getElementById('storyTitle').value,
            content: document.getElementById('storyContent').value,
            date: new Date().toISOString(),
        };

        await fetch('http://localhost:3001/stories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(story),
        }).then(response => response.json())
            .then(data => {
                alert('História postada com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao postar a história:', error);
                alert('Erro ao postar a história.');
            });
    });

    // Generate Report
    document.getElementById('generateReportButton').addEventListener('click', async () => {
        try {
            const donations = await fetch('http://localhost:3001/donations')
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Erro na requisição: ${response.statusText}`);
                    }
                    return response.json();
                });
    
            const reportOutput = document.getElementById('reportOutput');
            reportOutput.innerHTML = ''; // Limpa o conteúdo anterior
    
            if (donations.length === 0) {
                reportOutput.innerHTML = '<p>Nenhum relatório disponível.</p>';
                return;
            }
    
            // Cria a tabela de impacto
            const table = document.createElement('table');
            table.className = 'table table-bordered';
    
            // Cabeçalho da tabela
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th>Nome do Doador</th>
                    <th>Valor (R$)</th>
                    <th>ONG Beneficiada</th>
                    <th>Utilização</th>
                    <th>Data</th>
                </tr>
            `;
            table.appendChild(thead);
    
            // Corpo da tabela
            const tbody = document.createElement('tbody');
            donations.forEach((donation) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${donation.doador}</td>
                    <td>${donation.valor.toFixed(2)}</td>
                    <td>${donation.ong}</td>
                    <td>${donation.utilizacao}</td>
                    <td>${new Date(donation.data).toLocaleDateString()}</td>
                `;
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
    
            // Adiciona a tabela ao container
            reportOutput.appendChild(table);
        } catch (error) {
            console.error('Erro ao buscar o relatório de impacto:', error);
            alert('Erro ao gerar o relatório de impacto.');
        }
    });
    
    document.getElementById('downloadReportButton').addEventListener('click', async () => {
        try {
            const donations = await fetch('http://localhost:3001/donations')
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Erro na requisição: ${response.statusText}`);
                    }
                    return response.json();
                });
    
            if (donations.length === 0) {
                alert('Nenhum relatório disponível para download.');
                return;
            }
    
            // Importa o jsPDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
    
            // Título do Relatório
            pdf.setFontSize(18);
            pdf.text('Relatório de Impacto', 10, 10);
    
            // Cabeçalhos da tabela
            pdf.setFontSize(12);
            const headers = ['Nome do Doador', 'Valor (R$)', 'ONG', 'Utilização', 'Data'];
            let startY = 20;
    
            headers.forEach((header, index) => {
                pdf.text(header, 10 + index * 40, startY);
            });
    
            startY += 10;
    
            // Adiciona os dados da tabela
            donations.forEach((donation) => {
                pdf.text(donation.doador, 10, startY);
                pdf.text(donation.valor.toFixed(2), 50, startY);
                pdf.text(donation.ong, 90, startY);
                pdf.text(donation.utilizacao, 130, startY);
                pdf.text(new Date(donation.data).toLocaleDateString(), 170, startY);
                startY += 10;
    
                // Verifica se precisa de uma nova página
                if (startY > 280) {
                    pdf.addPage();
                    startY = 10;
                }
            });
    
            // Salva o PDF
            pdf.save('Relatorio_de_Impacto.pdf');
        } catch (error) {
            console.error('Erro ao gerar o PDF:', error);
            alert('Erro ao gerar o PDF do relatório.');
        }
    });

    

// Garante que o código será executado após o DOM estar carregado
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM totalmente carregado.');

    // Recuperando os dados do localStorage
    const localStorageData = localStorage.getItem('registeredOng');
    if (!localStorageData) {
        console.warn('Nenhuma ONG registrada encontrada no localStorage.');
        return;
    }

    const ongData = JSON.parse(localStorageData);
    console.log('Dados carregados do localStorage:', ongData); // Verificar o que está sendo carregado do localStorage

    try {
        // Verifica se o campo 'id' está presente nos dados
        if (!ongData.id) {
            console.error('ID da ONG não encontrado nos dados do localStorage.');
            return;
        }

        // Preencher os campos do formulário
        document.getElementById('orgId').value = ongData.id || '';
        document.getElementById('orgName').value = ongData.orgName || '';
        document.getElementById('orgDescription').value = ongData.description || '';
        document.getElementById('orgSocialMedia').value = ongData.socialMedia || '';
        document.getElementById('orgCategory').value = ongData.category || '';
        document.getElementById('orgAddress').value = ongData.address || '';
        document.getElementById('orgPhone').value = ongData.phone || '';
        document.getElementById('orgEmail').value = ongData.email || '';
        console.log('Campos preenchidos com sucesso.');
    } catch (error) {
        console.error('Erro ao preencher os campos:', error);
    }
});

// Atualizar Perfil
document.getElementById('updateProfileForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evitar comportamento padrão do formulário

    // Captura os valores atualizados do formulário
    const updatedOng = {
        id: document.getElementById('orgId').value,
        orgName: document.getElementById('orgName').value,
        description: document.getElementById('orgDescription').value,
        socialMedia: document.getElementById('orgSocialMedia').value,
        category: document.getElementById('orgCategory').value,
        address: document.getElementById('orgAddress').value,
        phone: document.getElementById('orgPhone').value,
        email: document.getElementById('orgEmail').value,
    };

    console.log('ID da ONG para atualização:', updatedOng.id); // Log para verificar o valor do ID

    // Verificar se o id da ONG está presente
    if (!updatedOng.id) {
        alert("ID da ONG não encontrado.");
        return;
    }

    try {
        // Imprime a URL para a requisição PUT para verificar se o ID está correto
        const updateUrl = `http://localhost:3001/ongs/${updatedOng.id}`;
        console.log('Requisição PUT para:', updateUrl); // Log da URL de requisição

        // Atualiza os dados no servidor (db.json)
        const response = await fetch(updateUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedOng),
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro ao atualizar no servidor. Status: ${response.status}`);
        }

        // Log de depuração
        const responseData = await response.json();
        console.log('Resposta do servidor:', responseData);

        // Atualiza os dados localmente (localStorage)
        localStorage.setItem('registeredOng', JSON.stringify(updatedOng));

        // Mensagem de sucesso
        alert('Perfil atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar o perfil:', error);
        alert('Erro ao atualizar os dados. Tente novamente mais tarde.');
    }
});





// Garante que o código será executado após o DOM estar carregado
document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOM totalmente carregado.');

    // Recupera o ID da ONG logada do localStorage
    const loggedOrgId = localStorage.getItem('loggedOrgId');
    if (!loggedOrgId) {
        console.warn('Nenhuma ONG registrada encontrada. Faça login novamente.');
        window.location.href = 'login.html';
        return;
    }

    try {
        // Busca os dados da ONG no servidor (db.json)
        const response = await fetch(`http://localhost:3001/ongs/${loggedOrgId}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados da ONG no servidor.');
        }

        const ongData = await response.json();
        console.log('Dados carregados do servidor:', ongData);

        // Preenche os campos do formulário com os dados da ONG
        document.getElementById('orgId').value = ongData.id || '';
        document.getElementById('orgName').value = ongData.orgName || '';
        document.getElementById('orgDescription').value = ongData.description || '';
        document.getElementById('orgSocialMedia').value = ongData.socialMedia || '';
        document.getElementById('orgCategory').value = ongData.category || '';
        document.getElementById('orgAddress').value = ongData.address || '';
        document.getElementById('orgPhone').value = ongData.phone || '';
        document.getElementById('orgEmail').value = ongData.email || '';

        // Atualiza o localStorage para manter os dados sincronizados
        localStorage.setItem('registeredOng', JSON.stringify(ongData));

        console.log('Campos preenchidos com sucesso.');
    } catch (error) {
        console.error('Erro ao carregar os dados da ONG:', error);
        alert('Erro ao carregar os dados. Faça login novamente.');
        window.location.href = 'login.html';
    }
});




    // Função de compartilhamento
    function shareStory(platform) {
        const url = 'https://example.com/stories'; // Alterar para a URL real
        const message = `Confira esta incrível história de sucesso no nosso site: ${url}`;

        if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`);
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`);
        }
    }

    // Funções para alternar abas (referenciado no início)
    function openTab(evt, tabName) {
        let i, tabContent, tabLinks;
        tabContent = document.getElementsByClassName("tab-content");
        for (i = 0; i < tabContent.length; i++) {
            tabContent[i].style.display = "none";
        }
        tabLinks = document.getElementsByClassName("tab-link");
        for (i = 0; i < tabLinks.length; i++) {
            tabLinks[i].className = tabLinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }
});
