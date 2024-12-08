const API_URL = "http://localhost:3000/projects";

const form = document.getElementById("sharing-Form_Ong");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("inpName").value;
  const categoria = document.getElementById("inpCategory").value;
  const valorAlvo = document.getElementById("inpTarget-Value").value;
  const estado = document.getElementById("inpState").value;
  const cidade = document.getElementById("inpCity").value;
  const cep = document.getElementById("inpZip-Code").value;
  const numero = document.getElementById("inpContactNumber").value;
  const redeSocial = document.getElementById("inpSocialMedia").value;

  const projectData = { nome, categoria, valorAlvo, estado, cidade, cep, numero, redeSocial};

  if (projectData) {
    // Criar contato
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    });
  } else{
    alert("Não foi possível criar o projeto");
  }

  form.reset();
  fetchContacts();
});