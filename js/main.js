/* =====================================================================
   NATH FILMES · SCRIPT PRINCIPAL
   - espaços de foto/vídeo (lê o site.config.js)
   - aparecer ao rolar, parallax leve, faixa em movimento, carrossel
   - cartões do portfólio e caixa de vídeo (usados na Home e no Portfólio)
   ===================================================================== */
(function () {
  'use strict';

  var NF = (window.NF = window.NF || {});
  var C = NF.config || window.SITE_CONFIG || {};
  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var telaPequena = window.matchMedia('(max-width: 767px)').matches;
  NF.semMovimento = semMovimento;

  if (window.__nfRev) clearTimeout(window.__nfRev);

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  NF.esc = esc;

  /* ------------------------------------------------------------------
     JSON com cache
     ------------------------------------------------------------------ */
  var cacheJson = {};
  NF.json = function (url) {
    if (!cacheJson[url]) {
      cacheJson[url] = fetch(url, { cache: 'no-cache' }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      });
      cacheJson[url].catch(function () { delete cacheJson[url]; });
    }
    return cacheJson[url];
  };

  /* ------------------------------------------------------------------
     Vídeos: só carregam quando chegam perto da tela e pausam ao sair
     ------------------------------------------------------------------ */
  var obsVideo = 'IntersectionObserver' in window ? new IntersectionObserver(function (entradas) {
    entradas.forEach(function (en) {
      var v = en.target;
      if (en.isIntersecting) {
        if (!v.getAttribute('src') && v.dataset.src) v.src = v.dataset.src;
        if (!semMovimento && !v.dataset.pausadoPorUsuario) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, { rootMargin: '240px 0px' }) : null;

  NF.observarVideo = function (v) {
    if (semMovimento) {
      // sem autoplay: mostra só a capa (ou o primeiro quadro)
      if (v.dataset.src && !v.poster) { v.preload = 'metadata'; v.src = v.dataset.src + '#t=0.1'; }
      return;
    }
    if (obsVideo) obsVideo.observe(v);
    else if (v.dataset.src) { v.src = v.dataset.src; v.play && v.play().catch(function () {}); }
  };

  /* ------------------------------------------------------------------
     Espaços de mídia
     ------------------------------------------------------------------ */
  var ICONE_RESERVADO = { foto: 'camera', video: 'video', print: 'chat' };
  var CAMINHO_PADRAO = { foto: 'assets/img/', video: 'assets/video/', print: 'assets/img/' };

  function reservado(legenda, tipo, nome) {
    var ic = ICONE_RESERVADO[tipo] || 'camera';
    return '<div class="reservado" role="img" aria-label="Espaço reservado: ' + esc(legenda) + '">' +
      '<b>Espaço reservado</b>' + NF.ico(ic) +
      '<strong>' + esc(legenda) + '</strong>' +
      (nome ? '<small>site.config.js → midia → “' + esc(nome) + '”</small>' : '') + '</div>';
  }
  NF.reservado = reservado;

  function montarSlot(el) {
    if (el.dataset.montado) return;
    el.dataset.montado = '1';
    var nome = el.getAttribute('data-slot');
    var tipo = el.getAttribute('data-tipo') || 'foto';
    var legenda = el.getAttribute('data-legenda') || 'Foto ou vídeo a enviar';
    var cfg = (C.midia && C.midia[nome]) || {};
    // se o arquivo for um vídeo (.mp4, .webm...), o espaço vira vídeo sozinho, mesmo sem data-tipo
    if (cfg.src && /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(cfg.src)) tipo = 'video';
    var prioridade = el.hasAttribute('data-prioridade');

    function imagem(src, srcset) {
      var img = new Image();
      img.alt = cfg.alt || legenda;
      img.decoding = 'async';
      img.loading = prioridade ? 'eager' : 'lazy';
      if (prioridade) img.setAttribute('fetchpriority', 'high');
      if (srcset) { img.srcset = srcset; img.sizes = el.getAttribute('data-sizes') || '(min-width: 900px) 50vw, 100vw'; }
      img.src = src;
      return img;
    }

    if (tipo === 'video' && cfg.src) {
      var v = document.createElement('video');
      v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true;
      v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      v.setAttribute('disablepictureinpicture', '');
      v.preload = 'none';
      v.setAttribute('aria-label', cfg.alt || legenda);
      var capa = (telaPequena && cfg.posterMobile) ? cfg.posterMobile : cfg.poster;
      if (capa) v.poster = capa;
      v.dataset.src = (telaPequena && cfg.srcMobile) ? cfg.srcMobile : cfg.src;
      el.appendChild(v);
      NF.observarVideo(v);
      if (el.hasAttribute('data-pausa') && !semMovimento) botaoPausa(el, v);
    } else if (tipo === 'video' && (cfg.poster || cfg.posterMobile)) {
      el.appendChild(imagem((telaPequena && cfg.posterMobile) ? cfg.posterMobile : (cfg.poster || cfg.posterMobile)));
    } else if (cfg.src && tipo !== 'video') {
      el.appendChild(imagem(cfg.src, cfg.srcset));
    } else {
      el.insertAdjacentHTML('beforeend', reservado(legenda, tipo, nome));
    }
  }

  function botaoPausa(el, v) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn-pausa';
    b.setAttribute('aria-label', 'Pausar vídeo de fundo');
    b.innerHTML = '<span aria-hidden="true">❚❚</span>';
    b.addEventListener('click', function () {
      if (v.paused) { v.dataset.pausadoPorUsuario = ''; delete v.dataset.pausadoPorUsuario; v.play().catch(function () {}); b.innerHTML = '<span aria-hidden="true">❚❚</span>'; b.setAttribute('aria-label', 'Pausar vídeo de fundo'); }
      else { v.dataset.pausadoPorUsuario = '1'; v.pause(); b.innerHTML = '<span aria-hidden="true">▶</span>'; b.setAttribute('aria-label', 'Reproduzir vídeo de fundo'); }
    });
    (el.closest('.hero') || el).appendChild(b);
  }

  NF.montarSlots = function (raiz) {
    (raiz || document).querySelectorAll('[data-slot]').forEach(montarSlot);
  };

  /* ------------------------------------------------------------------
     Aparecer ao rolar
     ------------------------------------------------------------------ */
  var obsRevelar = null;
  NF.revelar = function (raiz) {
    var itens = (raiz || document).querySelectorAll('.revelar:not(.visivel)');
    if (!itens.length) return;
    if (!('IntersectionObserver' in window) || semMovimento) { itens.forEach(function (i) { i.classList.add('visivel'); }); return; }
    if (!obsRevelar) {
      obsRevelar = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visivel'); obsRevelar.unobserve(e.target); } });
      }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    }
    itens.forEach(function (i) { obsRevelar.observe(i); });
  };

  /* ------------------------------------------------------------------
     Parallax leve (só transform, só quando visível)
     ------------------------------------------------------------------ */
  function parallax() {
    if (semMovimento) return;
    var itens = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (!itens.length) return;
    var visiveis = new Set();
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.isIntersecting ? visiveis.add(e.target) : visiveis.delete(e.target); });
      }, { rootMargin: '120px' });
      itens.forEach(function (i) { io.observe(i); });
    } else { itens.forEach(function (i) { visiveis.add(i); }); }
    var espera = false;
    function atualizar() {
      espera = false;
      var vh = window.innerHeight;
      visiveis.forEach(function (el) {
        var f = parseFloat(el.getAttribute('data-parallax')) || .1;
        // mede o elemento "pai" (que não se mexe) para o efeito não alimentar a si mesmo
        var r = (el.parentElement || el).getBoundingClientRect();
        var centro = r.top + r.height / 2 - vh / 2;
        var max = el.getBoundingClientRect().height * (el.hasAttribute('data-parallax-max') ? parseFloat(el.getAttribute('data-parallax-max')) : .06);
        var y = Math.max(-max, Math.min(max, -centro * f));
        el.style.setProperty('--py', y.toFixed(1) + 'px');
      });
    }
    window.addEventListener('scroll', function () { if (!espera) { espera = true; requestAnimationFrame(atualizar); } }, { passive: true });
    window.addEventListener('resize', atualizar);
    atualizar();
  }

  /* ------------------------------------------------------------------
     Faixa em movimento (marquee) + "agenda aberta" ligável
     ------------------------------------------------------------------ */
  function faixas() {
    document.querySelectorAll('[data-faixa]').forEach(function (faixa) {
      var textos = (faixa.getAttribute('data-faixa') || '').split('|').map(function (t) { return t.trim(); }).filter(Boolean);
      if (C.agendaAberta && C.agendaAberta.ativo && C.agendaAberta.texto) textos.unshift(C.agendaAberta.texto);
      var grupo = textos.map(function (t) { return '<span class="faixa__item">' + esc(t) + '</span>'; }).join('');
      // repete até passar da largura da tela, duas vezes (loop contínuo)
      var reps = Math.max(2, Math.ceil(1600 / (textos.join('').length * 14 + textos.length * 60)));
      var bloco = new Array(reps + 1).join(grupo);
      if (semMovimento) {
        // quem prefere menos movimento recebe a faixa parada, sem repetições
        faixa.innerHTML = '<div class="faixa__pista"><div class="faixa__grupo">' + grupo + '</div></div>';
      } else {
        faixa.innerHTML = '<div class="faixa__pista">' +
          '<div class="faixa__grupo">' + bloco + '</div>' +
          '<div class="faixa__grupo" aria-hidden="true">' + bloco + '</div></div>';
      }
      faixa.setAttribute('role', 'region');
      faixa.setAttribute('aria-label', textos.join(', '));
    });
  }

  /* ------------------------------------------------------------------
     Carrossel simples (rolagem + setas)
     ------------------------------------------------------------------ */
  NF.carrossel = function (raiz) {
    var pista = raiz.querySelector('.carrossel__pista');
    var ant = raiz.querySelector('[data-ant]');
    var prox = raiz.querySelector('[data-prox]');
    if (!pista) return;
    function passo() {
      var item = pista.querySelector('.carrossel__item');
      return item ? item.getBoundingClientRect().width + 20 : pista.clientWidth * .8;
    }
    function estado() {
      if (!ant || !prox) return;
      ant.disabled = pista.scrollLeft <= 4;
      prox.disabled = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 4;
    }
    if (ant) ant.addEventListener('click', function () { pista.scrollBy({ left: -passo(), behavior: semMovimento ? 'auto' : 'smooth' }); });
    if (prox) prox.addEventListener('click', function () { pista.scrollBy({ left: passo(), behavior: semMovimento ? 'auto' : 'smooth' }); });
    pista.addEventListener('scroll', function () { window.requestAnimationFrame(estado); }, { passive: true });
    pista.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); prox && prox.click(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); ant && ant.click(); }
    });
    window.addEventListener('resize', estado);
    estado();
  };

  /* ------------------------------------------------------------------
     Cartões do portfólio e caixa de vídeo
     ------------------------------------------------------------------ */
  function reproduzivel(item) { return !!(item.youtube || item.vimeo || item.arquivo); }

  NF.cartaoPortfolio = function (item, opcoes) {
    opcoes = opcoes || {};
    // "tipo" é o rótulo do cartão (ex.: Pré wedding, Making of da noiva, Cerimônia). Sem "tipo", usa o nome da categoria.
    var tipo = item.tipo || (item.categoria === 'empresa' ? 'Empresas e eventos' : item.categoria === 'trend' ? 'Trend' : 'Casamento');
    var pode = reproduzivel(item);
    var nome = item.titulo ? esc(item.titulo) : ''; // nome do casal ou da empresa: só aparece se você preencher (com autorização)
    var meta = item.local ? esc(item.local) : '';
    var el = document.createElement('article');
    el.className = 'pf-item revelar';
    if (opcoes.atraso) el.style.setProperty('--atraso', opcoes.atraso);

    var midia = '';
    var previa = item.previa || '';
    if (previa) midia = '<video muted loop playsinline preload="none" data-src="' + esc(previa) + '"' + (item.poster ? ' poster="' + esc(item.poster) + '"' : '') + ' aria-hidden="true"></video>';
    else if (item.poster) midia = '<img src="' + esc(item.poster) + '" alt="" loading="lazy" decoding="async">';
    else midia = NF.reservado(item.legenda || (item.categoria === 'empresa' && !item.tipo ? 'Vídeo institucional curto' : 'Vídeo de ' + tipo.toLowerCase()), 'video');

    var play = pode ? '<span class="pf__play">' + NF.ico('play') + '</span>' : '';
    // semInfo: usado nas "Histórias recentes" da Home, que mostram só o vídeo e o "Ver mais"
    var info = opcoes.semInfo ? '' :
      '<div class="pf__info"><span class="pf__tipo">' + esc(tipo) + '</span>' + (nome ? '<h3 class="pf__nome">' + nome + '</h3>' : '') + (meta ? '<p class="pf__meta">' + meta + '</p>' : '') + '</div>';
    var corpo = '<div class="slot">' + midia + play + '</div>' + info;

    var cls = 'pf' + (item.formato === 'horizontal' ? ' pf--horizontal' : '');
    if (pode) {
      el.innerHTML = '<button class="' + cls + '" type="button" aria-label="Assistir: ' + esc(item.titulo || tipo) + '">' + corpo + '</button>';
      el.firstChild.addEventListener('click', function () { NF.abrirPlayer(item, el.firstChild); });
    } else {
      el.innerHTML = '<div class="' + cls + '">' + corpo + '</div>';
    }
    var v = el.querySelector('video[data-src]');
    if (v) NF.observarVideo(v);
    if (opcoes.verMais) el.insertAdjacentHTML('beforeend', '<a class="link-seta" href="' + opcoes.verMais + '">Ver mais ' + NF.ico('seta-dir') + '</a>');
    return el;
  };

  var dlg = null, retorno = null;
  function criarPlayer() {
    dlg = document.createElement('dialog');
    dlg.className = 'player';
    dlg.setAttribute('aria-label', 'Reprodutor de vídeo');
    dlg.innerHTML = '<button class="player__fechar" type="button" aria-label="Fechar vídeo">' + NF.ico('fechar') + '</button><div class="player__corpo"></div>';
    document.body.appendChild(dlg);
    dlg.querySelector('.player__fechar').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () {
      dlg.querySelector('.player__corpo').innerHTML = '';
      if (retorno && retorno.focus) retorno.focus();
    });
  }
  NF.abrirPlayer = function (item, origem) {
    if (!dlg) criarPlayer();
    retorno = origem || null;
    var corpo = dlg.querySelector('.player__corpo');
    dlg.classList.toggle('player--vertical', item.formato === 'vertical');
    var html = '';
    if (item.youtube) {
      html = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(item.youtube) + '?autoplay=1&rel=0&playsinline=1" title="' + esc(item.titulo || 'Vídeo') + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';
    } else if (item.vimeo) {
      var id = String(item.vimeo);
      html = '<iframe src="https://player.vimeo.com/video/' + id + (id.indexOf('?') > -1 ? '&' : '?') + 'autoplay=1&dnt=1" title="' + esc(item.titulo || 'Vídeo') + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    } else if (item.arquivo) {
      html = '<video src="' + esc(item.arquivo) + '" controls autoplay playsinline' + (item.poster ? ' poster="' + esc(item.poster) + '"' : '') + '></video>';
    }
    corpo.innerHTML = html;
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  };

  /* ------------------------------------------------------------------
     Início
     ------------------------------------------------------------------ */
  function iniciar() {
    NF.montarSlots();
    faixas();
    NF.revelar();
    parallax();
    if (NF.atualizarWa) NF.atualizarWa();

    function buscar(chave) { return chave.split('.').reduce(function (o, k) { return o ? o[k] : undefined; }, C); }

    // blocos que só aparecem se o config estiver preenchido (ex.: número de casamentos)
    document.querySelectorAll('[data-so-se]').forEach(function (el) {
      var ok = el.getAttribute('data-so-se').split(/\s+/).every(function (k) { return !!buscar(k); });
      el.hidden = !ok;
    });

    // texto vindo do config (ex.: número de casamentos, e-mail, TikTok)
    document.querySelectorAll('[data-config]').forEach(function (el) {
      var chave = el.getAttribute('data-config');
      var valor = buscar(chave);
      if (valor === undefined || valor === '' || valor === null) {
        if (el.hasAttribute('data-config-esconder')) el.hidden = true;
        return;
      }
      el.textContent = valor;
    });
    document.querySelectorAll('[data-link-config]').forEach(function (a) {
      var v = C[a.getAttribute('data-link-config')];
      if (v) a.setAttribute('href', v);
    });

    document.dispatchEvent(new CustomEvent('nf:pronto'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
