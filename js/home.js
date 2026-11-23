/* =====================================================================
   NATH FILMES · HOME
   - "Histórias recentes": lê data/portfolio-aberto.json (os 3 marcados com "destaqueHome")
   - "Palavras de quem viveu": lê data/depoimentos.json
   Se o arquivo .json não puder ser lido, ficam os espaços reservados do HTML.
   ===================================================================== */
(function () {
  'use strict';
  var NF = window.NF;

  function historias() {
    var alvo = document.querySelector('[data-historias]');
    if (!alvo) return;
    var padrao = [{ categoria: 'casamento' }, { categoria: 'casamento' }, { categoria: 'casamento' }];
    function desenhar(itens) {
      alvo.innerHTML = '';
      itens.forEach(function (item, i) {
        alvo.appendChild(NF.cartaoPortfolio(item, { atraso: (i * .12) + 's', verMais: 'portfolio.html#exemplos', semInfo: true }));
      });
      NF.revelar(alvo);
    }
    // os 3 vídeos da Home ficam em data/historias-home.json (independentes da página Portfólio)
    NF.json('data/historias-home.json').then(function (dados) {
      var itens = (dados.itens || []).slice(0, 3);
      desenhar(itens.length ? itens : padrao);
    }).catch(function () { desenhar(padrao); }); // ex.: abriu o arquivo direto, sem servidor
  }

  function depoimentos() {
    var pista = document.querySelector('[data-depoimentos]');
    if (!pista) return;
    var carrossel = pista.closest('.carrossel');
    function ligar() { NF.carrossel(carrossel); }
    var padrao = [
      { tipo: 'reservado', contexto: 'StoryMaker' },
      { tipo: 'reservado', contexto: 'FilmMaker mobile' },
      { tipo: 'reservado', legenda: 'Depoimento de empresa (virá depois)', contexto: 'Empresas' },
      { tipo: 'reservado', contexto: 'Depoimento 4' },
      { tipo: 'reservado', contexto: 'Depoimento 5' }
    ];

    function desenhar(itens) {
      pista.innerHTML = itens.map(function (d) {
        var ctx = [d.autor, d.contexto].filter(Boolean).map(NF.esc).join(' · ');
        if (d.tipo === 'print' && d.imagem) {
          return '<li class="carrossel__item"><figure class="dep-card dep-card--print"><img src="' + NF.esc(d.imagem) + '" alt="' + NF.esc(d.alt || 'Print de conversa de WhatsApp com depoimento de cliente') + '" loading="lazy" decoding="async">' +
            (ctx ? '<figcaption>' + ctx + '</figcaption>' : '') + '</figure></li>';
        }
        if (d.tipo === 'texto' && d.texto) {
          return '<li class="carrossel__item"><figure class="dep-card"><div class="dep-card__aspas" aria-hidden="true">“</div><blockquote>' + NF.esc(d.texto) + '</blockquote>' +
            (ctx ? '<figcaption>' + ctx + '</figcaption>' : '') + '</figure></li>';
        }
        return '<li class="carrossel__item"><figure class="dep-card dep-card--reservado"><span class="rotulo">Espaço reservado</span>' + NF.ico('chat') +
          '<p>' + NF.esc(d.legenda || 'Depoimento autorizado (print de WhatsApp ou texto)') + '</p>' +
          '<figcaption>' + NF.esc(d.contexto || 'Modalidade') + '</figcaption></figure></li>';
      }).join('');
      ligar();
    }

    NF.json('data/depoimentos.json').then(function (dados) {
      desenhar((dados.itens && dados.itens.length) ? dados.itens : padrao);
    }).catch(function () { desenhar(padrao); });
  }

  /* ------------------------------------------------------------------
     "Onde o amor vira filme": cada quadro tem a sua foto ou vídeo e a sua palavra.
     Passa sozinho (a bolinha da vez vira uma barrinha vinho que marca o tempo) e
     pausa quando a pessoa passa o mouse, usa o teclado, troca de aba, sai da
     tela ou aperta o botão de pausa. Com "reduzir movimento" ligado no
     aparelho, só troca quando a pessoa toca numa bolinha.
     ------------------------------------------------------------------ */
  function amor() {
    var raiz = document.querySelector('[data-amor]');
    if (!raiz) return;
    var slides = [].slice.call(raiz.querySelectorAll('.amor__slide'));
    var itens = [].slice.call(raiz.querySelectorAll('.amor__pontos button'));
    var botaoPausa = raiz.querySelector('.amor__pausa');
    if (!slides.length || slides.length !== itens.length) return;

    var atual = 0, comecou = false;
    var pausas = { usuario: false, fora: true, mouse: false, foco: false, aba: document.hidden };

    function videosDo(i, tocar) {
      [].forEach.call(slides[i].querySelectorAll('video'), function (v) {
        if (tocar) {
          delete v.dataset.pausadoPorUsuario;
          if (NF.semMovimento) return;
          if (!v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src;
          try { v.currentTime = 0; } catch (e) {}
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          v.dataset.pausadoPorUsuario = '1'; // impede o carregador de vídeos de tocar este aqui
          v.pause();
        }
      });
    }

    function atualizarPausa() {
      var parar = pausas.usuario || pausas.fora || pausas.mouse || pausas.foco || pausas.aba;
      raiz.classList.toggle('em-pausa', parar);
    }

    function mostrar(i) {
      atual = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        var ligado = k === atual;
        s.classList.toggle('ativa', ligado);
        s.setAttribute('aria-hidden', ligado ? 'false' : 'true');
        videosDo(k, ligado);
      });
      itens.forEach(function (b, k) {
        b.classList.remove('ativa');
        b.removeAttribute('aria-current');
        if (k === atual) {
          void b.offsetWidth; // reinicia a barrinha
          b.classList.add('ativa');
          b.setAttribute('aria-current', 'true');
        }
      });
    }

    // vídeos das fotos que ainda não estão na vez ficam parados
    slides.forEach(function (s, k) { if (k !== 0) videosDo(k, false); });

    itens.forEach(function (b, k) {
      b.addEventListener('click', function () { comecou = true; mostrar(k); });
    });

    if (!NF.semMovimento) {
      // a barrinha terminou: próxima foto
      raiz.addEventListener('animationend', function (e) {
        if (e.animationName === 'amor-barra') mostrar(atual + 1);
      });
    } else if (botaoPausa) {
      botaoPausa.hidden = true;
    }

    // o mouse sobre a foto ou sobre as bolinhas pausa (sobre o botão "Conhecer a experiência", não)
    [raiz.querySelector('.amor__palco'), raiz.querySelector('.amor__pontos')].forEach(function (el) {
      el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { pausas.mouse = true; atualizarPausa(); } });
      el.addEventListener('pointerleave', function () { pausas.mouse = false; atualizarPausa(); });
    });
    raiz.addEventListener('focusin', function (e) { pausas.foco = !!(e.target.matches && e.target.matches(':focus-visible')); atualizarPausa(); });
    raiz.addEventListener('focusout', function () { pausas.foco = false; atualizarPausa(); });
    document.addEventListener('visibilitychange', function () { pausas.aba = document.hidden; atualizarPausa(); });

    if (botaoPausa) {
      botaoPausa.addEventListener('click', function () {
        pausas.usuario = !pausas.usuario;
        botaoPausa.firstElementChild.textContent = pausas.usuario ? '▶' : '❚❚';
        botaoPausa.setAttribute('aria-label', pausas.usuario ? 'Retomar a troca automática' : 'Pausar a troca automática');
        videosDo(atual, !pausas.usuario);
        atualizarPausa();
      });
    }

    // só começa a contar o tempo quando a seção aparece na tela
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        pausas.fora = !es[0].isIntersecting;
        if (!pausas.fora && !comecou) { comecou = true; mostrar(0); }
        atualizarPausa();
      }, { threshold: 0.35 }).observe(raiz);
    } else {
      pausas.fora = false; comecou = true; mostrar(0);
    }
    atualizarPausa();
  }

  function iniciar() { historias(); depoimentos(); amor(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
