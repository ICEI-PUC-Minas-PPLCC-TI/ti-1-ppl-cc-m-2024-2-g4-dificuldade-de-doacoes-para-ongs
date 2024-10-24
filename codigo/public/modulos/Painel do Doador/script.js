window.onload = function () {
  var profileImage = document.getElementById('profileImage'); // Corrigido o ID aqui
  var modal = document.getElementById('profileModal');
  var closeModal = document.getElementById('closeModal');
  var overlay = document.getElementById('modalOverlay');

  profileImage.onclick = function () {
      modal.classList.add('open');
      overlay.classList.add('open');
  }

  closeModal.onclick = function () {
      modal.classList.remove('open');
      overlay.classList.remove('open');
  }

  overlay.onclick = function () {
      modal.classList.remove('open');
      overlay.classList.remove('open');
  }
}