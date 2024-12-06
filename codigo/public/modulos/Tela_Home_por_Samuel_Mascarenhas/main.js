

(function () {
  "use strict";


  /**
 * Aplica a classe .scrolled ao corpo enquanto a página é rolada para baixo
 */
  function toggleScrolled() {
    const selectBody = document.querySelector('body'); // Seleciona o elemento body
    const selectHeader = document.querySelector('#header'); // Seleciona o cabeçalho da página
    // Verifica se o cabeçalho não possui as classes 'scroll-up-sticky', 'sticky-top' ou 'fixed-top'
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    // Adiciona ou remove a classe 'scrolled' no body com base na posição de rolagem
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  // Adiciona um evento de scroll para aplicar a função toggleScrolled
  document.addEventListener('scroll', toggleScrolled);
  // Chama a função toggleScrolled ao carregar a página
  window.addEventListener('load', toggleScrolled);

  /**
  * Alternar navegação móvel
  */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle'); // Seleciona o botão de alternância da navegação móvel

  function mobileNavToogle() {
    // Alterna a classe 'mobile-nav-active' no body
    document.querySelector('body').classList.toggle('mobile-nav-active');
    // Alterna os ícones do botão entre lista e cruz
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }

  // Adiciona um evento de clique para o botão de alternância da navegação móvel
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
  * Ocultar navegação móvel em links de mesma página/hash
  */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      // Se a navegação móvel estiver ativa, chama a função de alternância
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  /**
  * Alternar dropdowns da navegação móvel
  */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault(); // Previne o comportamento padrão do link
      // Alterna a classe 'active' no item pai do dropdown
      this.parentNode.classList.toggle('active');
      // Alterna a classe 'dropdown-active' no próximo elemento irmão
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation(); // Impede que outros eventos de clique sejam disparados
    });
  });

  /**
  * Preloader
  */
  const preloader = document.querySelector('#preloader'); // Seleciona o elemento preloader
  if (preloader) {
    // Remove o preloader quando a página for carregada
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
  * Botão Voltar ao Topo
  */
  let scrollTop = document.querySelector('.scroll-top'); // Seleciona o botão de rolar para cima

  function toggleScrollTop() {
    if (scrollTop) {
      // Adiciona ou remove a classe 'active' no botão com base na posição de rolagem
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }

  // Adiciona um evento de clique para o botão de rolar para cima
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault(); // Previne o comportamento padrão do link
    // Rola a página suavemente para o topo
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  // Adiciona um evento que chama a função toggleScrollTop quando a página é carregada
  window.addEventListener('load', toggleScrollTop);
  // Adiciona um evento que chama a função toggleScrollTop quando ocorre rolagem na página
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Função de animação ao rolar e inicialização
   */
  function aosInit() {
    // Inicializa a biblioteca AOS (Animate On Scroll)
    AOS.init({
      duration: 600, // Duração da animação em milissegundos
      easing: 'ease-in-out', // Efeito de transição da animação
      once: true, // Anima apenas uma vez por elemento
      mirror: false // Desativa a animação ao rolar para cima
    });
  }

  // Adiciona um evento que chama a função aosInit quando a página é carregada
  window.addEventListener('load', aosInit);

  /**
   * Inicializa o GLightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox' // Seleciona os elementos com a classe 'glightbox' para o lightbox
  });

  /**
   * Inicializa os sliders do Swiper
   */
  function initSwiper() {
    // Seleciona todos os elementos que possuem a classe "init-swiper"
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      // Obtém a configuração do swiper a partir de um elemento interno
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim() // Converte a configuração em objeto
      );

      // Verifica se o swiperElement é do tipo "swiper-tab" para configuração personalizada
      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config); // Inicializa com paginação personalizada
      } else {
        new Swiper(swiperElement, config); // Cria uma nova instância do Swiper com a configuração
      }
    });
  }

  // Adiciona um evento que chama a função initSwiper quando a página é carregada
  window.addEventListener("load", initSwiper);


  /**
 * Inicializa o Pure Counter
 */
  new PureCounter(); // Cria uma nova instância do PureCounter, que é uma biblioteca para contagem animada de números

  /**
   * Inicializa o layout e filtros do Isotope
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    // Obtém o layout padrão a partir do atributo data-layout ou usa 'masonry' como padrão
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    // Obtém o filtro padrão a partir do atributo data-default-filter ou usa '*' como padrão (todos os itens)
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    // Obtém o método de ordenação a partir do atributo data-sort ou usa 'original-order' como padrão
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope; // Declara uma variável para a instância do Isotope

    // Aguarda o carregamento das imagens no contêiner antes de inicializar o Isotope
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item', // Define o seletor dos itens a serem filtrados
        layoutMode: layout, // Define o modo de layout a ser utilizado (ex: masonry)
        filter: filter, // Define o filtro inicial
        sortBy: sort // Define a ordenação inicial
      });
    });

    // Adiciona eventos de clique aos itens de filtro dentro do layout do Isotope
    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
        // Remove a classe 'filter-active' do filtro atualmente ativo
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        // Adiciona a classe 'filter-active' ao filtro que foi clicado
        this.classList.add('filter-active');
        // Organiza os itens do Isotope com base no filtro selecionado
        initIsotope.arrange({
          filter: this.getAttribute('data-filter') // Obtém o filtro do atributo data-filter do item clicado
        });
        // Se a função aosInit estiver definida, a chama novamente para reiniciar as animações
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });
  });


  /**
  * Alternância das Perguntas Frequentes (FAQ)
  */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    // Adiciona um evento de clique a cada cabeçalho de item de FAQ ou botão de alternância
    faqItem.addEventListener('click', () => {
      // Alterna a classe 'faq-active' no elemento pai do item de FAQ clicado
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Corrige a posição de rolagem ao carregar a página para URLs que contêm links de hash.
   */
  window.addEventListener('load', function (e) {
    // Verifica se a URL atual contém um hash (ex: #secao)
    if (window.location.hash) {
      // Verifica se o elemento correspondente ao hash existe na página
      if (document.querySelector(window.location.hash)) {
        // Aguarda 100 milissegundos antes de executar a rolagem suave
        setTimeout(() => {
          let section = document.querySelector(window.location.hash); // Seleciona a seção correspondente ao hash
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop; // Obtém a margem superior de rolagem definida no estilo da seção
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop), // Define a posição de rolagem levando em conta a margem
            behavior: 'smooth' // Ativa o comportamento de rolagem suave
          });
        }, 100);
      }
    }
  });


  /**
 * Navmenu Scrollspy
 */
  let navmenulinks = document.querySelectorAll('.navmenu a'); // Seleciona todos os links no menu de navegação

  /**
   * Função para verificar o estado do scroll e ativar os links do menu correspondentes às seções visíveis
   */
  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => { // Itera sobre cada link do menu de navegação
      if (!navmenulink.hash) return; // Se o link não tiver um hash, pula para o próximo

      let section = document.querySelector(navmenulink.hash); // Seleciona a seção correspondente ao hash do link
      if (!section) return; // Se a seção não existir, pula para o próximo

      let position = window.scrollY + 200; // Obtém a posição de rolagem atual e adiciona um offset de 200 pixels

      // Verifica se a posição de rolagem está dentro dos limites da seção
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        // Remove a classe 'active' de todos os links do menu
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        // Adiciona a classe 'active' ao link do menu correspondente à seção visível
        navmenulink.classList.add('active');
      } else {
        // Remove a classe 'active' do link se a seção não estiver visível
        navmenulink.classList.remove('active');
      }
    });
  }

  // Adiciona um listener para o evento 'load' para executar a função na carga da página
  window.addEventListener('load', navmenuScrollspy);
  // Adiciona um listener para o evento 'scroll' para verificar a posição ao rolar a página
  document.addEventListener('scroll', navmenuScrollspy);


})();