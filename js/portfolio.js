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
    if (!grade) return;
    grade.innerHTML = '';
    var lista = itensAbertos.filter(function (i) { return !filtro || i.categoria === filtro; });
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

  /* ---------- liberar o portfólio completo ---------- */
  var completoCarregado = false;
  function mostrarCompleto(foco) {
    var form = document.getElementById('form-portfolio');
    var ok = document.getElementById('acesso-ok');
    var secao = document.getElementById('completo');
    if (form) form.hidden = true;
    if (ok) ok.hidden = false;
    if (secao) secao.hidden = false;
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
      var itens = d.itens || [];
      grade.innerHTML = '';
      itens.forEach(function (item, i) { grade.appendChild(NF.cartaoPortfolio(item, { atraso: ((i % 3) * .1) + 's' })); });
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
