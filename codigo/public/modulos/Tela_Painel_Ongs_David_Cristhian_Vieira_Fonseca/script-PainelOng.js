
// Controle dinâmico da página

async function carregarSecao(sct) {
    try {
        // Cria uma variável que recebera o id da seção
        const section = sct;
        
        // Realiza o fetch para obter o conteúdo do outro HTML
        const resposta = await fetch('sessoes-Ong.html');
        
        // Converte o conteúdo em texto
        const texto = await resposta.text();

        // Converte o texto em um documento HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(texto, 'text/html');

        // Seleciona a seção específica do documento
        const secao = doc.querySelector(section);
        if (secao) {
            // Insere o conteúdo da seção no elemento destino
            document.getElementById('conteudo').innerHTML = secao.outerHTML;
        } else {
            document.getElementById('conteudo').innerHTML = '<p>Seção não encontrada!</p>';
        }
    } catch (erro) {
        console.error('Erro ao carregar a seção:', erro);
        document.getElementById('conteudo').innerHTML = '<p>Erro ao carregar a seção.</p>';
    }
}


// Estilização do aside por meio do js
// Aguarda o carregamento do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os links do menu
    const links = document.querySelectorAll('.option-Control-Panel_Ong');
  
    // Adiciona o evento de clique a cada link
    links.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault(); // Evita o comportamento padrão do link
  
        // Remove a classe "active-Link-Options-Control_Ong" de todos os links
        links.forEach(l => l.classList.remove('active-Link-Options-Control_Ong'));
  
        // Adiciona a classe "active-Link-Options-Control_Ong" ao link clicado
        link.classList.add('active-Link-Options-Control_Ong');
      });
    });
  });