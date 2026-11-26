/* =====================================================================
   NATH FILMES · LAYOUT COMPARTILHADO
   Monta o topo, o menu, o rodapé e o botão flutuante do WhatsApp em todas
   as páginas, a partir deste arquivo e do site.config.js.
   Para mudar um item do menu ou do rodapé, edite as listas logo abaixo.
   ===================================================================== */
(function () {
  'use strict';

  var C = window.SITE_CONFIG || {};
  var NF = (window.NF = window.NF || {});
  NF.config = C;
  NF.escolha = { modalidade: '', pacote: '' };

  /* ------------------------------------------------------------------
     WhatsApp: monta o link com a mensagem certa para cada situação
     ------------------------------------------------------------------ */
  NF.waUrl = function (contexto) {
    var numero = String(C.whatsapp || '').replace(/\D/g, '');
    var m = C.mensagens || {};
    var msg;
    if (contexto === 'orcamento') {
      var e = NF.escolha;
      if (e.modalidade || e.pacote) {
        msg = (m.orcamento || m.geral || '')
          .replace('{modalidade}', e.modalidade || 'ainda não escolhi')
          .replace('{pacote}', e.pacote || 'ainda não escolhi');
      } else {
        msg = m.orcamentoSemEscolha || m.geral;
      }
    } else {
      msg = m[contexto] || m.geral;
    }
    return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(msg || '');
  };

  NF.atualizarWa = function (raiz) {
    var padrao = document.body.getAttribute('data-wa-padrao') || 'reserva';
    (raiz || document).querySelectorAll('[data-wa]').forEach(function (a) {
      var ctx = a.getAttribute('data-wa');
      if (ctx === 'auto') ctx = padrao;
      a.setAttribute('href', NF.waUrl(ctx));
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });
  };

  /* ------------------------------------------------------------------
     Ícones (um conjunto só, reaproveitado com <use>)
     ------------------------------------------------------------------ */
  var SPRITE =
    '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +
    '<symbol id="i-whatsapp" viewBox="0 0 24 24"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41Z"/></symbol>' +
    '<symbol id="i-instagram" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r=".6"/></symbol>' +
    '<symbol id="i-tiktok" viewBox="0 0 24 24"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.3 2.6 2.1 4.4 5 4.6"/></symbol>' +
    '<symbol id="i-celular" viewBox="0 0 24 24"><rect x="6.5" y="2.5" width="11" height="19" rx="2.6"/><path d="M10.2 5.2h3.6"/><circle cx="12" cy="11.5" r="2.7"/><circle cx="12" cy="11.5" r=".7"/><path d="M11 18.6h2"/></symbol>' +
    '<symbol id="i-play" viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z" fill="currentColor" stroke="none"/></symbol>' +
    '<symbol id="i-seta-dir" viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></symbol>' +
    '<symbol id="i-seta-esq" viewBox="0 0 24 24"><path d="M20 12H5M11 6l-6 6 6 6"/></symbol>' +
    '<symbol id="i-fechar" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></symbol>' +
    '<symbol id="i-pessoas" viewBox="0 0 24 24"><circle cx="8" cy="8" r="3"/><circle cx="16.5" cy="8.5" r="2.6"/><path d="M2.5 20c0-3.3 2.4-5.5 5.5-5.5s5.5 2.2 5.5 5.5"/><path d="M14.4 14.9c.7-.3 1.4-.4 2.1-.4 2.9 0 5 2 5 5.2"/></symbol>' +
    '<symbol id="i-estrela" viewBox="0 0 24 24"><path d="M10.5 3l1.9 5.6L18 10.5l-5.6 1.9L10.5 18l-1.9-5.6L3 10.5l5.6-1.9z"/><path d="M19 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/></symbol>' +
    '<symbol id="i-drone" viewBox="0 0 24 24"><rect x="9.2" y="10.4" width="5.6" height="3.4" rx="1.3"/><path d="M9.6 11L5.9 8M14.4 11L18.1 8M9.6 13.2L5.9 16M14.4 13.2L18.1 16"/><ellipse cx="5" cy="7" rx="3.2" ry="1"/><ellipse cx="19" cy="7" rx="3.2" ry="1"/><ellipse cx="5" cy="17" rx="3.2" ry="1"/><ellipse cx="19" cy="17" rx="3.2" ry="1"/><circle cx="12" cy="12.1" r=".6"/></symbol>' +
    '<symbol id="i-calendario" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M9 15.2l2 2 4-4"/></symbol>' +
    '<symbol id="i-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12.4l2.7 2.7L16 9.6"/></symbol>' +
    '<symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.6v.2"/></symbol>' +
    '<symbol id="i-pasta" viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></symbol>' +
    '<symbol id="i-contrato" viewBox="0 0 24 24"><path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/></symbol>' +
    '<symbol id="i-filme" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/></symbol>' +
    '<symbol id="i-camera" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7l1.4-2.6h5.2L16 7"/><circle cx="12" cy="13.5" r="3.6"/></symbol>' +
    '<symbol id="i-chat" viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/></symbol>' +
    '<symbol id="i-video" viewBox="0 0 24 24"><rect x="2.5" y="6" width="13" height="12" rx="2"/><path d="M15.5 10.5l6-3v9l-6-3z"/></symbol>' +
    '</defs></svg>';

  function ico(nome, classe) {
    return '<svg class="ico' + (classe ? ' ' + classe : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + nome + '"/></svg>';
  }
  NF.ico = ico;

  function logo(nome, alt, w, h) {
    return '<picture><source srcset="assets/logo/' + nome + '.webp" type="image/webp">' +
      '<img src="assets/logo/' + nome + '.png" alt="' + alt + '" width="' + w + '" height="' + h + '"></picture>';
  }

  /* ------------------------------------------------------------------
     Itens do menu (edite aqui para mudar nomes ou endereços)
     ------------------------------------------------------------------ */
  var MENU = [
    { rotulo: 'Sobre',       href: 'sobre.html' },
    { rotulo: 'Experiência', href: 'experiencia.html' },
    { rotulo: 'Portfólio',   href: 'portfolio.html' },
    { rotulo: 'Empresas',    href: 'empresas.html' }
  ];

  var pagina = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (pagina === '') pagina = 'index.html';

  // Página de captação (casamento.html): <body data-lp>. Topo só com a logo e o botão de WhatsApp (sem menu, para a
  // visitante não se perder) e rodapé curto. As outras páginas não mudam.
  var LP = document.body.hasAttribute('data-lp');

  function itensMenu(classe) {
    return MENU.map(function (i) {
      var arquivo = i.href.split('#')[0].toLowerCase();
      var atual = i.href.indexOf('#') === -1 && arquivo === pagina ? ' aria-current="page"' : '';
      return '<a href="' + i.href + '"' + atual + '>' + i.rotulo + '</a>';
    }).join('');
  }

  /* ------------------------------------------------------------------
     Topo + menu móvel + botão flutuante
     ------------------------------------------------------------------ */
  function htmlTopo() {
    if (LP) {
      return '' +
        '<a class="pular" href="#principal">Pular para o conteúdo</a>' +
        '<header class="topo topo--lp" id="topo"><div class="container topo__in">' +
          '<span class="topo__logo">' + logo('logo-preto', 'Nath Filmes', 170, 28) + '</span>' +
          // em telas muito estreitas o "minha" some (.lp-opc), para o botão caber ao lado da logo
          '<div class="topo__cta"><a class="btn btn--escuro" data-wa="auto" href="#">Reservar<span class="lp-opc"> minha</span> data</a></div>' +
        '</div></header>' +
        '<a class="wa-flutuante" data-wa="auto" href="#" aria-label="Falar com a Nath no WhatsApp">' + ico('whatsapp', 'ico--solido') + '<span>Falar no WhatsApp</span></a>';
    }
    return '' +
      '<a class="pular" href="#principal">Pular para o conteúdo</a>' +
      '<header class="topo" id="topo"><div class="container topo__in">' +
        '<a class="topo__logo" href="index.html" aria-label="Nath Filmes, página inicial">' + logo('logo-preto', 'Nath Filmes', 170, 28) + '</a>' +
        '<nav class="topo__nav" aria-label="Principal">' + itensMenu() + '</nav>' +
        '<div class="topo__cta"><a class="btn btn--escuro" data-wa="auto" href="#">Reservar minha data</a></div>' +
        '<button class="topo__burger" type="button" aria-expanded="false" aria-controls="menu-mobile" aria-label="Abrir menu"><span></span></button>' +
      '</div></header>' +
      '<div class="topo-menu" id="menu-mobile" aria-hidden="true">' +
        '<nav aria-label="Menu principal">' +
          '<a href="index.html"' + (pagina === 'index.html' ? ' aria-current="page"' : '') + '>Início</a>' + itensMenu() +
        '</nav>' +
        '<a class="btn btn--claro" data-wa="auto" href="#">Reservar minha data</a>' +
      '</div>' +
      '<a class="wa-flutuante" data-wa="auto" href="#" aria-label="Falar com a Nath no WhatsApp">' + ico('whatsapp', 'ico--solido') + '<span>Falar no WhatsApp</span></a>';
  }

  /* ------------------------------------------------------------------
     Rodapé
     ------------------------------------------------------------------ */
  function htmlRodape() {
    var ano = new Date().getFullYear();
    var email = C.email ? '<li><a href="mailto:' + C.email + '">' + C.email + '</a></li>' : '';
    if (LP) {
      return '' +
        '<footer class="rodape rodape--lp"><div class="container">' +
          '<div class="rodape__lp">' +
            logo('logo-branco-cantos', 'Nath Filmes', 240, 95) +
            '<p class="rodape__frase">' + (C.marca || 'Nath Filmes') + ' · ' + (C.cidade || '') + '</p>' +
            '<ul class="rodape__redes">' +
              '<li><a href="' + (C.instagram || '#') + '" target="_blank" rel="noopener">Instagram @nath.filmes</a></li>' +
              '<li><a href="' + (C.tiktok || '#') + '" target="_blank" rel="noopener">TikTok @nath.filmes</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="rodape__base"><span>© ' + ano + ' Nath Filmes. Todos os direitos reservados.</span>' +
            '<a href="privacidade.html">Política de privacidade</a></div>' +
        '</div></footer>';
    }
    return '' +
      '<footer class="rodape"><div class="container">' +
        '<div class="rodape__grid">' +
          '<div class="rodape__marca">' + logo('logo-branco-cantos', 'Nath Filmes', 240, 95) +
            '<p class="rodape__frase">Crio lembranças que fazem o coração bater mais forte toda vez que você assistir!</p></div>' +
          '<nav aria-label="Rodapé"><h2>Navegue</h2><ul>' +
            '<li><a href="index.html">Início</a></li>' +
            '<li><a href="sobre.html">Sobre</a></li>' +
            '<li><a href="experiencia.html">Experiência</a></li>' +
            '<li><a href="portfolio.html">Portfólio</a></li>' +
            '<li><a href="empresas.html">Empresas e eventos</a></li>' +
            '<li><a data-wa="reserva" href="#">Reservar minha data</a></li>' +
          '</ul></nav>' +
          '<div><h2>Fale com a Nath</h2><ul>' +
            '<li><a href="' + (C.instagram || '#') + '" target="_blank" rel="noopener">Instagram</a></li>' +
            '<li><a href="' + (C.tiktok || '#') + '" target="_blank" rel="noopener">TikTok</a></li>' +
            '<li><a data-wa="geral" href="#">WhatsApp</a></li>' + email +
          '</ul><p class="pequeno texto-suave" style="margin-top:14px;color:var(--cinza-claro)">' + (C.cidade || '') + '</p></div>' +
        '</div>' +
        '<div class="rodape__base"><span>© ' + ano + ' Nath Filmes. Todos os direitos reservados.</span>' +
          '<a href="privacidade.html">Política de privacidade</a></div>' +
      '</div></footer>';
  }

  /* ------------------------------------------------------------------
     Injeção
     ------------------------------------------------------------------ */
  function incluir(nome, html) {
    var alvo = document.querySelector('[data-incluir="' + nome + '"]');
    if (!alvo) return null;
    alvo.insertAdjacentHTML('beforebegin', html);
    alvo.parentNode.removeChild(alvo);
    return true;
  }

  // 1) sprite + topo: já, para não piscar
  document.body.insertAdjacentHTML('afterbegin', SPRITE);
  incluir('topo', htmlTopo());
  NF.atualizarWa();

  // 2) menu móvel, sombra no topo ao rolar
  var burger = document.querySelector('.topo__burger');
  var menu = document.getElementById('menu-mobile');
  var topo = document.getElementById('topo');

  function abrirMenu(abrir) {
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', String(abrir));
    burger.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('aberto', abrir);
    menu.setAttribute('aria-hidden', String(!abrir));
    document.body.classList.toggle('menu-aberto', abrir);
  }
  if (burger) {
    burger.addEventListener('click', function () { abrirMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) abrirMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('aberto')) { abrirMenu(false); burger.focus(); }
    });
    window.matchMedia('(min-width: 960px)').addEventListener('change', function (e) { if (e.matches) abrirMenu(false); });
  }
  function sombra() { if (topo) topo.classList.toggle('com-sombra', window.scrollY > 8); }
  window.addEventListener('scroll', sombra, { passive: true });
  // (não lê o scroll agora: isso forçaria o navegador a calcular o layout antes da hora)
  window.addEventListener('load', sombra);

  // 3) rodapé: quando o resto da página já existe
  function rodape() {
    incluir('rodape', htmlRodape());
    NF.atualizarWa();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', rodape);
  else rodape();
})();
