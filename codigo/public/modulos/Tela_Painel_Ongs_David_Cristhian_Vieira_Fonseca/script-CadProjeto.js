const API_URL = "http://localhost:3001/projects";

document.addEventListener("DOMContentLoaded", () => {
  // Certifica-se de que o formulário está no DOM
  const form = document.getElementById("form-Cad");

  // Verifica se o formulário foi encontrado antes de adicionar o evento
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
    
      // Coleta os dados do formulário
      const nome = document.getElementById("inpName").value;
      const categoria = document.getElementById("inpCategory").value;
      const valorAlvo = Number(document.getElementById("inpTarget-Value").value);
      const estado = document.getElementById("inpState").value;
      const cidade = document.getElementById("inpCity").value;
      const cep = Number(document.getElementById("inpZip-Code").value);
      const numero = Number(document.getElementById("inpContactNumber").value);
      const redeSocial = document.getElementById("inpSocialMedia").value;
      const descricao = document.getElementById("inpDescription").value;

      // Prepara os dados para envio
      const projectData = {
        nome,
        categoria,
        valorAlvo,
        estado,
        cidade,
        cep,
        numero,
        redeSocial,
        descricao
      };

      console.log(projectData);

      // Valida os campos antes de enviar
      if (nome && categoria && valorAlvo && estado && cidade && cep && numero && redeSocial && descricao) {
        try {
          // Envia os dados para o servidor via POST
          const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(projectData),
          });

          if (!response.ok) {
            throw new Error("Erro ao enviar os dados para o servidor.");
          }

          // Alerta ou realiza algo quando o envio for bem-sucedido
          alert("Projeto cadastrado com sucesso!");
        } catch (error) {
          // Tratar erros durante o processo de envio
          alert("Erro ao enviar os dados: " + error.message);
        }
      } else {
        alert("Por favor, preencha todos os campos.");
      }

      // Limpa o formulário após o envio
      form.reset();

    });
  } else {
    console.error("Formulário não encontrado!");
  }
});