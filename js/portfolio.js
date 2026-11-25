/* =====================================================================
   NATH FILMES · PÁGINA PORTFÓLIO
   1) Exemplos disponíveis (abas Casamentos, Trends, Empresas) → data/portfolio-aberto.json
   2) Formulário (nome, e-mail, celular) com máscara, validação e envio
      para o serviço configurado em FORM_TIPO (hoje: "supabase", tabela leads_portfolio)
   3) Depois do envio libera a grade completa → data/portfolio-completo.json
      (essa lista só é baixada depois do envio; o bloqueio é "suave")
   ===================================================================== */
(function () {
  'use strict';
  var NF = window.NF;
  var C = NF.config || {};
  var CHAVE = 'nf_portfolio_liberado';

  /* ---------- armazenamento (com proteção para navegador sem localStorage) ---------- */
  var memoria = false;
  function lerFlag() { try { return localStorage.getItem(CHAVE) === '1'; } catch (e) { return memoria; } }
  function gravarFlag() { memoria = true; try { localStorage.setItem(CHAVE, '1'); } catch (e) { /* ok */ } }

  /* ---------- exemplos abertos ---------- */
  var itensAbertos = [];
  function desenharAbertos(filtro) {
    var grade = document.getElementById('grade-aberta');
    var cta = document.getElementById('empresas-cta');
    if (!grade) return;
    grade.innerHTML = '';
    var lista = itensAbertos.filter(function (i) { return !filtro || i.categoria === filtro; });
    // Empresas: cartões ainda sem vídeo não aparecem. Sem nenhum vídeo pronto, a aba mostra só o botão
    // "Solicitar orçamento e portfólio" (WhatsApp). Quando um cartão ganhar vídeo, a grade volta sozinha.
    var soEmpresa = (filtro === 'empresa');
    if (soEmpresa) lista = lista.filter(function (i) { return i.arquivo || i.youtube || i.vimeo; });
    var mostrarBotao = soEmpresa && !lista.length;
    if (cta) cta.hidden = !mostrarBotao;
    grade.hidden = mostrarBotao;
    if (mostrarBotao) return;
    if (!lista.length) {
      grade.innerHTML = '<p class="completo__estado" style="grid-column:1/-1">Em breve, mais vídeos nesta categoria.</p>';
      return;
    }
    lista.forEach(function (item, i) { grade.appendChild(NF.cartaoPortfolio(item, { atraso: ((i % 3) * .1) + 's' })); });
    NF.revelar(grade);
  }

  function carregarAbertos() {
    var grade = document.getElementById('grade-aberta');
    if (!grade) return;
    NF.json('data/portfolio-aberto.json').then(function (d) {
      itensAbertos = d.itens || [];
      // começa na aba marcada no HTML (hoje: Casamentos)
      var marcada = document.querySelector('.p-filtros button[aria-pressed="true"]');
      desenharAbertos(marcada ? marcada.getAttribute('data-filtro') : 'casamento');
    }).catch(function () {
      grade.innerHTML = '<p class="completo__estado" style="grid-column:1/-1">Não consegui carregar os exemplos agora. Atualize a página ou fale comigo pelo WhatsApp.</p>';
    });

    document.querySelectorAll('.p-filtros button').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.p-filtros button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        desenharAbertos(b.getAttribute('data-filtro'));
      });
    });
  }

  /* ---------- máscara e validação ---------- */
  function mascaraCelular(v) {
    var d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2) return '(' + d;
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  var regras = {
    nome: function (v) {
      v = v.trim();
      if (v.length < 2) return 'Conta pra mim o seu nome, por favor.';
      return '';
    },
    email: function (v) {
      v = v.trim();
      if (!v) return 'Preciso do seu e-mail para liberar o portfólio.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Esse e-mail parece estar incompleto. Pode conferir?';
      return '';
    },
    celular: function (v) {
      var d = v.replace(/\D/g, '');
      if (!d) return 'Informe seu celular com DDD, por favor.';
      if (d.length < 10 || d.length > 11) return 'O celular precisa ter DDD e 8 ou 9 dígitos. Exemplo: (35) 99999-9999.';
      if (/^0/.test(d) || +d.slice(0, 2) < 11) return 'Confira o DDD, por favor.';
      if (d.length === 11 && d.charAt(2) !== '9') return 'Celulares com 11 dígitos começam com 9 depois do DDD.';
      return '';
    }
  };

  function marcarErro(campo, msg) {
    var wrap = campo.closest('.campo');
    var erro = wrap.querySelector('.campo__erro');
    if (msg) {
      wrap.setAttribute('data-erro', '1');
      campo.setAttribute('aria-invalid', 'true');
      erro.textContent = msg;
    } else {
      wrap.removeAttribute('data-erro');
      campo.removeAttribute('aria-invalid');
      erro.textContent = '';
    }
    return !msg;
  }

  /* ---------- envio ---------- */
  function comTempo(ms) {
    var ctl = ('AbortController' in window) ? new AbortController() : null;
    var t = setTimeout(function () { if (ctl) ctl.abort(); }, ms);
    return { signal: ctl ? ctl.signal : undefined, limpar: function () { clearTimeout(t); } };
  }

  /* ---- Supabase: grava a linha na tabela (só insert; o público não consegue ler nada) ---- */
  var clienteSb = null;
  function clienteSupabase() {
    if (clienteSb) return clienteSb;
    if (!window.supabase || typeof window.supabase.createClient !== 'function') return null;
    // sem login: nada de sessão guardada no navegador de quem visita
    clienteSb = window.supabase.createClient(
      String(C.SUPABASE_URL).trim(),
      String(C.SUPABASE_PUBLISHABLE_KEY).trim(),
      { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
    );
    return clienteSb;
  }

  function enviarSupabase(dados, t) {
    var temConfig = String(C.SUPABASE_URL || '').trim() && String(C.SUPABASE_PUBLISHABLE_KEY || '').trim();
    if (!temConfig) {
      t.limpar();
      return new Promise(function (ok) { setTimeout(function () { ok({ demo: true }); }, 700); });
    }
    var sb = clienteSupabase();
    if (!sb) { t.limpar(); return Promise.reject(new Error('A biblioteca do Supabase não carregou.')); }

    // Os limites de tamanho são os mesmos das regras da tabela (veja tools/supabase/leads-portfolio.sql)
    var consulta = sb.from(String(C.SUPABASE_TABELA || 'leads_portfolio').trim()).insert({
      nome: dados.nome.slice(0, 120),
      email: dados.email.slice(0, 254),
      celular: dados.celular.slice(0, 20),
      consentimento: true,
      origem: dados.origem,
      pagina: dados.pagina.slice(0, 500)
    });
    if (t.signal) consulta = consulta.abortSignal(t.signal);
    return consulta.then(function (res) {
      t.limpar();
      if (res.error) throw res.error;
      return {};
    }, function (e) { t.limpar(); throw e; });
  }

  function enviar(dados) {
    var ep = String(C.FORM_ENDPOINT || '').trim();
    var tipo = String(C.FORM_TIPO || 'formspree').toLowerCase();
    var t = comTempo(15000);
    var req;

    if (tipo === 'supabase') return enviarSupabase(dados, t);

    if (!ep && tipo !== 'netlify') {
      t.limpar();
      return new Promise(function (ok) { setTimeout(function () { ok({ demo: true }); }, 700); });
    }

    if (tipo === 'netlify') {
      var corpo = new URLSearchParams();
      corpo.append('form-name', 'portfolio');
      Object.keys(dados).forEach(function (k) { corpo.append(k, dados[k]); });
      req = fetch(ep || '/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: corpo.toString(), signal: t.signal });
    } else if (tipo === 'googlescript') {
      // o Apps Script não devolve cabeçalhos CORS; a resposta é "opaca" e basta não dar erro de rede
      req = fetch(ep, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(dados), signal: t.signal })
        .then(function () { return { ok: true }; });
    } else {
      req = fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(dados), signal: t.signal });
    }

    return req.then(function (r) {
      t.limpar();
      if (r && r.ok === false) throw new Error('HTTP ' + r.status);
      return {};
    }, function (e) { t.limpar(); throw e; });
  }

  /* ---------- StoryMaker: bolinhas com anel + visualizador estilo "stories do Instagram" ---------- */
  var SOM_LIGADO = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  var SOM_DESLIGADO = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';

  function montarStories(itens) {
    var lista = document.createElement('ul');
    lista.className = 'stories';
    var botoes = [];
    itens.forEach(function (item, i) {
      var rotulo = item.tipo || 'Story';
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'story';
      b.setAttribute('aria-label', 'Assistir ao story: ' + rotulo);
      var anel = document.createElement('span');
      anel.className = 'story__anel';
      var capa = document.createElement('span');
      capa.className = 'story__capa';
      if (item.poster) {
        var img = new Image();
        img.src = item.poster; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
        capa.appendChild(img);
      } else {
        capa.innerHTML = NF.ico('filme');
      }
      anel.appendChild(capa);
      var nome = document.createElement('span');
      nome.className = 'story__nome';
      nome.textContent = rotulo;
      b.appendChild(anel);
      b.appendChild(nome);
      b.addEventListener('click', function () { abrirStories(itens, i, botoes); });
      botoes.push(b);
      li.appendChild(b);
      lista.appendChild(li);
    });
    return lista;
  }

  var visualizador = null;
  function abrirStories(itens, inicio, botoes) {
    if (!visualizador) visualizador = criarStories();
    visualizador.abrir(itens, inicio, botoes);
  }

  function criarStories() {
    var dlg = document.createElement('dialog');
    dlg.className = 'sv';
    dlg.setAttribute('aria-label', 'Stories do StoryMaker');
    dlg.innerHTML =
      '<div class="sv__palco">' +
        '<div class="sv__barras" aria-hidden="true"></div>' +
        '<div class="sv__topo">' +
          '<span class="sv__marca"><img src="assets/logo/logo-branco.png" alt="Nath Filmes"><span class="sv__rotulo"></span></span>' +
          '<button class="sv__btn sv__som" type="button" hidden></button>' +
          '<button class="sv__btn sv__fechar" type="button" aria-label="Fechar os stories">' + NF.ico('fechar') + '</button>' +
        '</div>' +
        '<div class="sv__midia"></div>' +
        '<button class="sv__zona sv__zona--esq" type="button" aria-label="Story anterior"></button>' +
        '<button class="sv__zona sv__zona--dir" type="button" aria-label="Próximo story"></button>' +
      '</div>';
    document.body.appendChild(dlg);

    var barras = dlg.querySelector('.sv__barras');
    var midia = dlg.querySelector('.sv__midia');
    var rotuloEl = dlg.querySelector('.sv__rotulo');
    var btnSom = dlg.querySelector('.sv__som');
    var e = { itens: [], i: 0, botoes: [], origem: null, raf: 0, v: null, dur: 0, decorrido: 0, ultimo: 0, pausado: false, semSom: false, hold: 0, segurou: false, aberto: false, barra: null };

    function atualizarSom() {
      btnSom.innerHTML = e.semSom ? SOM_DESLIGADO : SOM_LIGADO;
      btnSom.setAttribute('aria-label', e.semSom ? 'Ligar o som' : 'Desligar o som');
    }

    function parar() {
      cancelAnimationFrame(e.raf);
      e.raf = 0;
      if (e.v) { try { e.v.pause(); } catch (x) { /* ok */ } e.v = null; }
      midia.innerHTML = '';
    }

    // a barrinha da vez enche enquanto o story passa; as anteriores ficam cheias
    function tick(t) {
      if (!e.aberto) return;
      var p;
      if (e.v) p = e.v.duration ? e.v.currentTime / e.v.duration : 0;
      else if (e.dur) { if (!e.pausado) e.decorrido += t - e.ultimo; p = e.decorrido / e.dur; }
      else { e.barra.style.width = '100%'; return; } // vídeo de fora (YouTube/Vimeo): a pessoa toca para avançar
      e.ultimo = t;
      e.barra.style.width = Math.min(100, p * 100) + '%';
      if (!e.v && p >= 1) { proximo(); return; }
      e.raf = requestAnimationFrame(tick);
    }

    function mostrar(n) {
      parar();
      e.i = n;
      var item = e.itens[n] || {};
      var is = barras.querySelectorAll('i');
      for (var j = 0; j < is.length; j++) is[j].style.width = j < n ? '100%' : '0%';
      e.barra = is[n];
      rotuloEl.textContent = item.tipo || '';
      if (e.botoes[n]) e.botoes[n].classList.add('story--vista');
      e.pausado = false; e.decorrido = 0; e.dur = 0; e.ultimo = performance.now();
      btnSom.hidden = true;

      if (item.arquivo) {
        var v = document.createElement('video');
        v.playsInline = true;
        v.setAttribute('playsinline', '');
        v.muted = e.semSom;
        v.preload = 'auto'; // só o story da vez é baixado
        if (item.poster) v.poster = item.poster;
        v.src = item.arquivo;
        v.addEventListener('ended', proximo);
        midia.appendChild(v);
        e.v = v;
        btnSom.hidden = false;
        atualizarSom();
        var tentativa = v.play();
        if (tentativa && tentativa.catch) tentativa.catch(function () { v.muted = true; e.semSom = true; atualizarSom(); v.play().catch(function () { /* ok */ }); });
      } else if (item.youtube || item.vimeo) {
        var f = document.createElement('iframe');
        f.title = item.tipo || 'Story';
        f.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
        f.setAttribute('allowfullscreen', '');
        f.src = item.youtube
          ? 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(item.youtube) + '?autoplay=1&rel=0&playsinline=1'
          : 'https://player.vimeo.com/video/' + String(item.vimeo) + (String(item.vimeo).indexOf('?') > -1 ? '&' : '?') + 'autoplay=1&dnt=1';
        midia.appendChild(f);
      } else {
        // ainda sem vídeo: espaço reservado por 5 segundos, depois passa para o próximo
        var caixa = document.createElement('div');
        caixa.className = 'slot slot--escuro';
        caixa.innerHTML = NF.reservado(item.tipo || 'Story', 'video');
        midia.appendChild(caixa);
        e.dur = 5000;
      }
      e.raf = requestAnimationFrame(tick);
    }

    function proximo() { if (e.i < e.itens.length - 1) mostrar(e.i + 1); else dlg.close(); }
    function anterior() { mostrar(Math.max(0, e.i - 1)); }
    function pausar() { e.pausado = true; if (e.v) e.v.pause(); }
    function retomar() { if (!e.pausado) return; e.pausado = false; e.ultimo = performance.now(); if (e.v) e.v.play().catch(function () { /* ok */ }); }

    // toque rápido avança ou volta; segurar o dedo pausa (como no Instagram)
    function ligarZona(botao, acao) {
      botao.addEventListener('pointerdown', function () {
        e.segurou = false;
        clearTimeout(e.hold);
        e.hold = setTimeout(function () { e.segurou = true; pausar(); }, 300);
      });
      function soltar() { clearTimeout(e.hold); if (e.segurou) retomar(); }
      botao.addEventListener('pointerup', soltar);
      botao.addEventListener('pointerleave', soltar);
      botao.addEventListener('pointercancel', soltar);
      botao.addEventListener('keydown', function () { e.segurou = false; });
      botao.addEventListener('click', function () { if (e.segurou) { e.segurou = false; return; } acao(); });
    }
    ligarZona(dlg.querySelector('.sv__zona--esq'), anterior);
    ligarZona(dlg.querySelector('.sv__zona--dir'), proximo);

    dlg.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowRight') { ev.preventDefault(); proximo(); }
      else if (ev.key === 'ArrowLeft') { ev.preventDefault(); anterior(); }
    });
    btnSom.addEventListener('click', function () { e.semSom = !e.semSom; if (e.v) e.v.muted = e.semSom; atualizarSom(); });
    dlg.querySelector('.sv__fechar').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (ev) { if (ev.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () {
      e.aberto = false;
      parar();
      if (e.origem && e.origem.focus) e.origem.focus();
    });

    return {
      abrir: function (itens, inicio, botoes) {
        e.itens = itens;
        e.botoes = botoes || [];
        e.origem = e.botoes[inicio] || null;
        e.aberto = true;
        barras.innerHTML = '';
        itens.forEach(function () { var s = document.createElement('span'); s.appendChild(document.createElement('i')); barras.appendChild(s); });
        if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
        mostrar(inicio);
      }
    };
  }

  /* ---------- liberar o portfólio completo ---------- */
  var completoCarregado = false;
  function mostrarCompleto(foco) {
    var form = document.getElementById('form-portfolio');
    var ok = document.getElementById('acesso-ok');
    var secao = document.getElementById('completo');
    if (form) form.hidden = true;
    if (ok) ok.hidden = false;
    if (secao) secao.hidden = false;
    // o botão "Ver portfólio completo" (depois dos exemplos) passa a levar direto para a lista completa
    var verCompleto = document.getElementById('ver-completo');
    if (verCompleto) verCompleto.setAttribute('href', '#completo');
    carregarCompleto();
    if (foco && ok) {
      var h = ok.querySelector('h2');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      secao.scrollIntoView({ behavior: NF.semMovimento ? 'auto' : 'smooth', block: 'start' });
    }
    NF.atualizarWa();
  }

  function carregarCompleto() {
    var grade = document.getElementById('grade-completa');
    var estado = document.getElementById('completo-estado');
    if (!grade || completoCarregado) return;
    estado.hidden = false;
    estado.innerHTML = '<span class="girando" aria-hidden="true"></span> Carregando o portfólio completo…';
    NF.json('data/portfolio-completo.json').then(function (d) {
      // Formato novo: "secoes" (uma por modalidade, cada uma com seus itens).
      // Formato antigo: só "itens" (vira uma grade única, sem título).
      var secoes = (d.secoes && d.secoes.length) ? d.secoes : [{ itens: d.itens || [] }];
      grade.innerHTML = '';
      secoes.forEach(function (s, si) {
        var sec = document.createElement('section');
        sec.className = 'p-secao';
        if (s.titulo) {
          var idTitulo = 'p-secao-' + (s.id || si);
          sec.setAttribute('aria-labelledby', idTitulo);
          var cab = document.createElement('header');
          cab.className = 'p-secao__cab revelar';
          var rotulo = document.createElement('p');
          rotulo.className = 'eyebrow';
          rotulo.textContent = s.rotulo || 'Modalidade';
          var h = document.createElement('h3');
          h.id = idTitulo;
          h.className = 'titulo t-lg';
          h.appendChild(document.createTextNode(s.titulo));
          if (s.destaque) {
            h.appendChild(document.createTextNode(' '));
            var em = document.createElement('em');
            em.textContent = s.destaque;
            h.appendChild(em);
          }
          cab.appendChild(rotulo);
          cab.appendChild(h);
          if (s.dica) {
            var dica = document.createElement('p');
            dica.className = 'p-secao__dica';
            dica.textContent = s.dica;
            cab.appendChild(dica);
          }
          sec.appendChild(cab);
        }
        if (s.estilo === 'stories') {
          // StoryMaker: bolinhas com anel que abrem o visualizador em tela cheia, como os stories do Instagram
          sec.appendChild(montarStories(s.itens || []));
        } else {
          var g = document.createElement('div');
          g.className = 'p-grade';
          (s.itens || []).forEach(function (item, i) { g.appendChild(NF.cartaoPortfolio(item, { atraso: ((i % 3) * .1) + 's' })); });
          sec.appendChild(g);
        }
        grade.appendChild(sec);
      });
      NF.revelar(grade);
      estado.hidden = true;
      completoCarregado = true;
    }).catch(function () {
      estado.hidden = false;
      estado.innerHTML = 'Não consegui carregar o portfólio completo agora. <br><button class="btn btn--escuro" type="button" id="tentar-de-novo">Tentar de novo</button>';
      document.getElementById('tentar-de-novo').addEventListener('click', carregarCompleto);
    });
  }

  /* ---------- formulário ---------- */
  function ligarFormulario() {
    var form = document.getElementById('form-portfolio');
    if (!form) return;
    var nome = form.elements.nome, email = form.elements.email, cel = form.elements.celular;
    var consent = form.elements.consentimento;
    var msg = document.getElementById('form-msg');
    var botao = form.querySelector('button[type="submit"]');
    var rotulo = botao.innerHTML;

    cel.addEventListener('input', function () { cel.value = mascaraCelular(cel.value); });
    [['nome', nome], ['email', email], ['celular', cel]].forEach(function (par) {
      par[1].addEventListener('blur', function () { if (par[1].value) marcarErro(par[1], regras[par[0]](par[1].value)); });
      par[1].addEventListener('input', function () { if (par[1].closest('.campo').hasAttribute('data-erro')) marcarErro(par[1], regras[par[0]](par[1].value)); });
    });
    consent.addEventListener('change', function () { consent.closest('.consentimento').removeAttribute('data-erro'); consent.removeAttribute('aria-invalid'); });

    function aviso(texto, tipo) { msg.textContent = texto || ''; msg.setAttribute('data-tipo', tipo || ''); }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      aviso('');
      var validos = [
        marcarErro(nome, regras.nome(nome.value)),
        marcarErro(email, regras.email(email.value)),
        marcarErro(cel, regras.celular(cel.value))
      ];
      var okConsent = consent.checked;
      var boxConsent = consent.closest('.consentimento');
      if (!okConsent) { boxConsent.setAttribute('data-erro', '1'); consent.setAttribute('aria-invalid', 'true'); aviso('Para liberar o portfólio, preciso que você aceite o contato e o uso dos dados.', 'erro'); }
      if (validos.indexOf(false) > -1 || !okConsent) {
        var primeiro = [nome, email, cel].filter(function (c) { return c.hasAttribute('aria-invalid'); })[0] || (okConsent ? null : consent);
        if (validos.indexOf(false) > -1) aviso('Confira os campos destacados, por favor.', 'erro');
        if (primeiro) primeiro.focus();
        return;
      }

      // armadilha anti-robô: campo invisível preenchido = robô; finge sucesso sem enviar
      if (form.elements.site_empresa && form.elements.site_empresa.value) { gravarFlag(); mostrarCompleto(true); return; }

      var dados = {
        nome: nome.value.trim(),
        email: email.value.trim(),
        celular: cel.value.trim(),
        consentimento: 'sim',
        origem: 'portfolio',
        pagina: location.href.split('#')[0],
        data: new Date().toISOString()
      };

      botao.disabled = true;
      botao.setAttribute('aria-busy', 'true');
      botao.innerHTML = '<span class="girando" aria-hidden="true"></span> Enviando…';
      aviso('Só um instante…', 'aviso');

      enviar(dados).then(function (r) {
        gravarFlag();
        if (r && r.demo) console.warn('[Nath Filmes] Formulário em MODO DE TESTE: nada foi enviado. Confira FORM_TIPO, SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY (ou FORM_ENDPOINT) no site.config.js.');
        var demo = document.getElementById('aviso-teste');
        if (demo) demo.hidden = !(r && r.demo);
        mostrarCompleto(true);
      }).catch(function (err) {
        console.error('[Nath Filmes] Erro ao enviar o formulário:', err);
        aviso('Não consegui enviar agora. Confira sua internet e tente de novo. Se preferir, fale comigo pelo WhatsApp.', 'erro');
      }).then(function () {
        botao.disabled = false;
        botao.removeAttribute('aria-busy');
        botao.innerHTML = rotulo;
      });
    });
  }

  function iniciar() {
    carregarAbertos();
    ligarFormulario();
    if (lerFlag()) mostrarCompleto(false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
