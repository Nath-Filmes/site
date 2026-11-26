/* =====================================================================
   NATH FILMES · PÁGINA DE CASAMENTO (casamento.html)
   1) Prévia do portfólio: os vídeos de data/lp-casamento.json (tocam ao clicar)
   2) Fluxo "Entender as modalidades" (3 passos) que termina no WhatsApp, sem valores
   3) Frase com o número de casamentos (vem do site.config.js)
   4) Carrega a biblioteca do Supabase só quando o formulário está perto de aparecer
   O formulário em si (máscara, validação, envio, "portfólio liberado") é o js/portfolio.js,
   o mesmo da página Portfólio. Os contatos desta página aparecem no Supabase com origem "lp-casamento".
   ===================================================================== */
(function () {
  'use strict';
  var NF = window.NF;
  var C = NF.config || {};

  // Número do WhatsApp: vem do site.config.js (é o único lugar onde ele muda). Formato: 55 + DDD + número.
  var WHATSAPP_NUMBER = String(C.whatsapp || '').replace(/\D/g, '');

  /* ---------- 1) prévia do portfólio ---------- */
  function previa() {
    var alvo = document.getElementById('lp-previa');
    if (!alvo) return;
    function comVideo(i) { return i.arquivo || i.youtube || i.vimeo; }
    // A lista desta página fica em data/lp-casamento.json (independente do Portfólio e da Home).
    // Se ela não existir ou estiver vazia, usa os 3 primeiros casamentos com vídeo de data/portfolio-aberto.json.
    NF.json('data/lp-casamento.json').then(function (d) {
      var itens = (d.itens || []).filter(comVideo).slice(0, 4);
      if (itens.length) return itens;
      throw new Error('lista vazia');
    }).catch(function () {
      return NF.json('data/portfolio-aberto.json').then(function (d) {
        return (d.itens || []).filter(function (i) { return i.categoria === 'casamento' && comVideo(i); }).slice(0, 3);
      });
    }).then(function (itens) {
      alvo.innerHTML = '';
      alvo.setAttribute('data-n', String(itens.length)); // o CSS centraliza 1 a 3 cartões e usa 4 colunas para 4
      itens.forEach(function (item, i) { alvo.appendChild(NF.cartaoPortfolio(item, { atraso: (i * .1) + 's' })); });
      NF.revelar(alvo);
    }).catch(function () {
      alvo.innerHTML = '<p class="completo__estado" style="grid-column:1/-1">Não consegui carregar os vídeos agora. Atualize a página ou fale comigo pelo WhatsApp.</p>';
    });
  }

  /* ---------- 3) frase do número de casamentos ---------- */
  function casamentos() {
    var p = document.querySelector('[data-lp-casamentos]');
    var c = C.casamentos || {};
    if (!p || !c.mostrar || !c.total) return;
    p.textContent = 'Já filmei ' + (c.prefixo ? c.prefixo + ' ' : '') + c.total + ' casamentos' + (c.desde ? ' desde ' + c.desde : '') +
      ', e cada um me ensinou que o que importa não é só o que aconteceu, mas como fez você sentir.';
    p.hidden = false;
  }

  /* ---------- 4) biblioteca do Supabase só quando precisa (a página abre mais leve) ---------- */
  function supabaseSobDemanda() {
    var secao = document.getElementById('acesso');
    var form = document.getElementById('form-portfolio');
    if (!secao || !form) return;
    var pedido = false;
    function carregar() {
      if (pedido || window.supabase) return;
      pedido = true;
      var s = document.createElement('script');
      s.src = 'js/vendor/supabase.js';
      s.async = true;
      document.head.appendChild(s);
    }
    form.addEventListener('focusin', carregar);
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { carregar(); io.disconnect(); }
      }, { rootMargin: '1400px 0px' });
      io.observe(secao);
    } else { carregar(); }
  }

  /* ---------- 2) fluxo de escolha (modal em 3 passos) ---------- */
  function fluxo() {
    var dlg = document.getElementById('lp-fluxo');
    if (!dlg) return;
    var titulo = document.getElementById('fluxo-titulo');
    var passoTxt = document.getElementById('fluxo-passo');
    var erro = document.getElementById('fluxo-erro');
    var resumo = document.getElementById('fluxo-resumo');
    var etapas = [].slice.call(dlg.querySelectorAll('[data-etapa]'));
    var btnVoltar = dlg.querySelector('[data-fluxo-voltar]');
    var btnSeguir = dlg.querySelector('[data-fluxo-seguir]');
    var btnWa = dlg.querySelector('[data-fluxo-wa]');
    var TITULOS = ['Qual modalidade você quer?', 'Quais momentos você quer registrar?', 'Tudo certo. Vamos conversar?'];
    var atual = 1;
    var origem = null;

    function escolhas() {
      var mod = dlg.querySelector('input[name="modalidade"]:checked');
      var momentos = [].slice.call(dlg.querySelectorAll('input[name="momento"]:checked')).map(function (i) { return i.value; });
      return { modalidade: mod ? mod.value : '', momentos: momentos };
    }
    function juntar(lista) {
      if (lista.length <= 1) return lista.join('');
      return lista.slice(0, -1).join(', ') + ' e ' + lista[lista.length - 1];
    }
    function mensagem() {
      var e = escolhas();
      return 'Oi, Nath! Quero entender as modalidades. Tenho interesse em ' + e.modalidade + ' para ' + juntar(e.momentos) + '.';
    }

    function ir(n, focar) {
      atual = n;
      etapas.forEach(function (el) { el.hidden = Number(el.getAttribute('data-etapa')) !== n; });
      titulo.textContent = TITULOS[n - 1];
      passoTxt.textContent = 'Passo ' + n + ' de 3';
      erro.textContent = '';
      btnVoltar.hidden = n === 1;
      btnSeguir.hidden = n === 3;
      btnWa.hidden = n !== 3;
      if (n === 3) {
        var e = escolhas();
        resumo.innerHTML = '';
        resumo.appendChild(document.createTextNode('Você escolheu '));
        var b1 = document.createElement('b'); b1.textContent = e.modalidade; resumo.appendChild(b1);
        resumo.appendChild(document.createTextNode(' para '));
        var b2 = document.createElement('b'); b2.textContent = juntar(e.momentos); resumo.appendChild(b2);
        resumo.appendChild(document.createTextNode('.'));
        btnWa.setAttribute('href', 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(mensagem()));
      }
      if (focar) { titulo.focus({ preventScroll: true }); }
    }

    btnSeguir.addEventListener('click', function () {
      var e = escolhas();
      if (atual === 1 && !e.modalidade) { erro.textContent = 'Escolha uma opção para continuar.'; return; }
      if (atual === 2 && !e.momentos.length) { erro.textContent = 'Escolha pelo menos um momento para continuar.'; return; }
      ir(atual + 1, true);
    });
    btnVoltar.addEventListener('click', function () { ir(atual - 1, true); });
    dlg.addEventListener('change', function () { erro.textContent = ''; });
    dlg.querySelector('[data-fechar-fluxo]').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (ev) { if (ev.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { if (origem && origem.focus) origem.focus(); });

    document.querySelectorAll('[data-abrir-fluxo]').forEach(function (b) {
      b.addEventListener('click', function () {
        origem = b;
        [].forEach.call(dlg.querySelectorAll('input'), function (i) { i.checked = false; });
        ir(1, false);
        if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
        titulo.focus({ preventScroll: true });
      });
    });
  }

  function iniciar() {
    previa();
    casamentos();
    supabaseSobDemanda();
    fluxo();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
