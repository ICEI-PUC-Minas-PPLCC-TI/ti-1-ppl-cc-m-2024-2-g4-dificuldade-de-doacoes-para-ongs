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

    var ratingStars = document.querySelectorAll('.star');
    ratingStars.forEach(function(star) {
        star.onclick = function() {
            ratingStars.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
        }
    });

    var submitFeedback = document.getElementById('submitFeedback');
    submitFeedback.onclick = function() {
        var selectedRating = document.querySelector('.star.selected');
        var feedbackText = document.getElementById('feedbackText').value;

        if (selectedRating) {
            alert('Avaliação: ' + selectedRating.dataset.value + '\nComentário: ' + feedbackText);
            modal.classList.remove('open');
            overlay.classList.remove('open');
            document.getElementById('feedbackText').value = '';
            ratingStars.forEach(s => s.classList.remove('selected'));
        } else {
            alert('Por favor, selecione uma avaliação.');
        }
    }
}
function toggleEdit() {
    const editForm = document.getElementById('editForm');
    editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
}
function previewImage(event) {
    const profilePic = document.getElementById('profilePic');
    profilePic.src = URL.createObjectURL(event.target.files[0]);
}
function toggleEdit() {
    const editForm = document.getElementById('editForm');
    editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
}

function previewImage(event) {
    const profilePic = document.getElementById('profilePic');
    profilePic.src = URL.createObjectURL(event.target.files[0]);
}
function leDados() {
    let strDados = localStorage.getItem('db');
    let objDados = {};

    if (strDados) {
        objDados = JSON.parse(strDados);
    } else {
        objDados = {
            Usuario: [
                { nome: "Roberto", email: "roberto@gmail.com", numero: "31983129229", location: "Belo Horizonte" },
                { nome: "Pedro", email: "pedroroberto@gmail.com", numero: "31983329229", location: "Belo Horizonte" },
                { nome: "Lucas", email: "lucasroberto@gmail.com", numero: "31943129229", location: "Belo Horizonte" }
            ]
        };
        salvaDados(objDados);
    }
    return objDados;
}

function salvaDados(dados) {
    localStorage.setItem('db', JSON.stringify(dados));
}

function informacoes() {
    let objDados = leDados();
    let nome = document.getElementById('name').value;
    let localizacao = document.getElementById('location').value;
    let sobre = document.getElementById('about').value;
    let numero = document.getElementById('number').value;
    let email = document.getElementById('email').value;
    let causa = document.getElementById('cause').value;

    let novoUsuario =
{
    nome:strNome,
    localizacao:Strloc,
    sobre:strsobre,
    numero: strnum,
    email:stremail,
    causa:strcausa

};

objDados.contato.push (novoUsuario);
salvaDados(objDados);
    // Adicione as novas informações ao objeto de dados aqui, se necessário
}

document.getElementById('logar').addEventListener('click', async () => {
    const email = document.getElementById('user').value;
    const senha = document.getElementById('pass').value;
    const loc = '';
    const desc = '';
  
    try {
      const response = await fetch('http://localhost:3000/usuarios');
      const usuarios = await response.json();
  
      let usuarioEncontrado = usuarios.find(usuario => usuario.email === email && usuario.senha === senha && usuario.location === loc && usuario.descricao === desc);
      console.log(usuarioEncontrado);
  
      if (usuarioEncontrado) {
        console.log(usuarioEncontrado);

        alert('Login bem-sucedido!');
        // Aqui você pode redirecionar o usuário para outra página
        window.location.href = '../Painel do Doador/index.html'; 
      } else {
        alert('Email ou senha incorretos.');
      }
    } catch (error) {
      console.error('Erro ao acessar os usuários:', error);
      alert('Houve um problema ao tentar fazer o login. Tente novamente mais tarde.');
    }
  });

  window.onload = function(){

      
      document.getElementById('nome').innerText = usuarioEncontrado.nome;
      document.getElementById('loc').innerText = usuarioEncontrado.location;
      document.getElementById('desc').innerText = usuarioEncontrado.descricao;
    }