function mostrarPerfil() {
    var perfil = document.getElementById("perfil");
    if (perfil.style.display === "none") {
      perfil.style.display = "block"; // Mostra
    } else {
      perfil.style.display = "none"; // Esconde se já estiver visível
    }
  }
  