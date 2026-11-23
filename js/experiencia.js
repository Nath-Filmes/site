/* =====================================================================
   NATH FILMES · PÁGINA EXPERIÊNCIA
   Guarda a modalidade e o pacote escolhidos e monta a mensagem do WhatsApp.
   ===================================================================== */
(function () {
  'use strict';
  var NF = window.NF;

  function iniciar() {
    var resumo = document.getElementById('resumo-escolha');
    var radiosMod = document.querySelectorAll('input[name="modalidade"]');
    var radiosPac = document.querySelectorAll('input[name="pacote"]');

    function atualizar() {
      var mod = document.querySelector('input[name="modalidade"]:checked');
      var pac = document.querySelector('input[name="pacote"]:checked');
      NF.escolha.modalidade = mod ? mod.value : '';
      NF.escolha.pacote = pac ? pac.value : '';
      if (resumo) {
        var m = NF.escolha.modalidade ? '<em>' + NF.esc(NF.escolha.modalidade) + '</em>' : 'escolha a modalidade';
        var p = NF.escolha.pacote ? '<em>' + NF.esc(NF.escolha.pacote) + '</em>' : 'escolha o pacote';
        resumo.innerHTML = m + ' · ' + p;
      }
      NF.atualizarWa();
    }

    radiosMod.forEach(function (r) { r.addEventListener('change', atualizar); });
    radiosPac.forEach(function (r) { r.addEventListener('change', atualizar); });

    // permite chegar já com escolha: experiencia.html?modalidade=filmmaker&pacote=essencial
    try {
      var q = new URLSearchParams(location.search);
      var m = (q.get('modalidade') || '').toLowerCase();
      var p = (q.get('pacote') || '').toLowerCase();
      radiosMod.forEach(function (r) { if (r.id === 'mod-' + m) r.checked = true; });
      radiosPac.forEach(function (r) { if (r.id === 'pac-' + p) r.checked = true; });
    } catch (e) { /* ignora */ }

    atualizar();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
