/* =====================================================================
   NATH FILMES · CONFIGURAÇÃO DO SITE
   ---------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa abrir para trocar número de
   WhatsApp, links, mensagens, fotos e vídeos. Os textos das páginas
   ficam nos próprios arquivos .html (abra com o Bloco de Notas ou VS Code).

   Regras para editar sem quebrar:
   - Troque só o que está entre aspas "assim".
   - Não apague as vírgulas no fim das linhas.
   - Salvou? Atualize a página no navegador (Ctrl + F5).
   ===================================================================== */

window.SITE_CONFIG = {

  /* ------------------------------------------------------------------
     1) CONTATO
     ------------------------------------------------------------------ */
  marca: "Nath Filmes",
  cidade: "Pouso Alegre (MG) e região",

  // Número do WhatsApp, só com dígitos: 55 (Brasil) + DDD + número.
  // Ex.: 5535991234567
  whatsapp: "5535998903361",

  // Instagram e TikTok confirmados pela Nath em 23/11/2026.
  instagram: "https://www.instagram.com/nath.filmes/",
  tiktok: "https://www.tiktok.com/@nath.filmes",

  // E-mail de contato. Deixe "" enquanto não existir (aparece como "a definir").
  email: "",

  /* ------------------------------------------------------------------
     2) MENSAGENS PRÉ-PREENCHIDAS DO WHATSAPP
        {modalidade} e {pacote} são trocados pela escolha da pessoa.
     ------------------------------------------------------------------ */
  mensagens: {
    reserva:
      "Oi, Nath! Vi o seu site e quero reservar a data do meu casamento. Podemos conversar?",
    orcamento:
      "Oi, Nath! Vi o seu site e gostaria de um orçamento. Modalidade: {modalidade}. Pacote: {pacote}. Podemos conversar?",
    orcamentoSemEscolha:
      "Oi, Nath! Vi o seu site e gostaria de um orçamento para o meu casamento. Pode me ajudar a escolher a modalidade e o pacote?",
    empresas:
      "Oi, Nath! Vi o seu site e quero conversar sobre vídeos e conteúdo para a minha empresa.",
    portfolio:
      "Oi, Nath! Acabei de ver o seu portfólio completo e quero reservar a data do meu casamento.",
    geral:
      "Oi, Nath! Vi o seu site e gostaria de conversar."
  },

  /* ------------------------------------------------------------------
     3) FORMULÁRIO DO PORTFÓLIO COMPLETO
        Hoje ele grava no SUPABASE (banco de dados). Para ver os contatos:
        supabase.com/dashboard → projeto "nath filmes site Project" → Table Editor → leads_portfolio.
        Veja o README.md (seção "Formulário") para mais detalhes.
     ------------------------------------------------------------------ */
  // Qual serviço recebe nome, e-mail e celular? Use um destes:
  //   "supabase"     → grava no banco de dados do Supabase (o que está em uso)
  //   "formspree"    → https://formspree.io/f/xxxxxxx           (preencha FORM_ENDPOINT)
  //   "netlify"      → só funciona se o site estiver na Netlify (NÃO funciona na Vercel)
  //   "googlescript" → https://script.google.com/macros/s/.../exec   (preencha FORM_ENDPOINT)
  //   "generico"     → qualquer endereço que aceite um POST com JSON  (preencha FORM_ENDPOINT)
  // Se o serviço escolhido estiver sem endereço/chave, o formulário funciona em MODO DE TESTE (não envia nada).
  FORM_TIPO: "supabase",

  // Dados do Supabase. A chave "publishable" é PÚBLICA por desenho (pode ficar no site):
  // quem protege os contatos é o banco, que só deixa o público ENVIAR o formulário, nunca ler.
  // NUNCA cole aqui a chave "secret" nem a "service_role".
  SUPABASE_URL: "https://vvbvurgbeheedfuenawy.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_--mOgpWqCLK-jD2rJPMyNw_dnVTE6iN",
  SUPABASE_TABELA: "leads_portfolio",

  // Só para os outros serviços (formspree, googlescript, generico). Com "supabase" pode ficar vazio.
  FORM_ENDPOINT: "",

  /* ------------------------------------------------------------------
     4) LIGA / DESLIGA
     ------------------------------------------------------------------ */
  agendaAberta: {
    ativo: false,                         // true para mostrar na faixa em movimento
    texto: "Agenda aberta para 2027"      // troque o ano quando ligar
  },

  casamentos: {
    // Na página Sobre aparece: "mais de 20 casamentos filmados desde fevereiro de 2025".
    // Para esconder, use mostrar: false. Para tirar o "mais de", deixe prefixo: "".
    mostrar: true,
    prefixo: "mais de",
    total: 20,
    desde: "fevereiro de 2025"
  },

  /* ------------------------------------------------------------------
     5) FOTOS E VÍDEOS
        Cada linha é um "espaço" do site. Enquanto src estiver vazio, o site
        mostra um bloco reservado com a legenda do que entra ali.

        Foto:  "nome-do-espaco": { src: "assets/img/arquivo.jpg", alt: "descrição da foto" },
        Vídeo: "nome-do-espaco": { src: "assets/video/arquivo.mp4",
                                   srcMobile: "assets/video/arquivo-leve.mp4",   (opcional, mais leve)
                                   poster: "assets/posters/capa.jpg",            (imagem de capa)
                                   posterMobile: "assets/posters/capa-vertical.jpg",  (opcional, capa para celular)
                                   alt: "descrição do vídeo" },

        Para fotos mais rápidas, use também  srcset: "assets/img/a-800.webp 800w, assets/img/a-1600.webp 1600w"
        (o arquivo tools/otimizar-imagens.py gera isso para você).
     ------------------------------------------------------------------ */
  midia: {
    /* ---- HOME ---- */
    "hero-video":         { src: "assets/video/hero-video.mp4", poster: "assets/posters/hero-video.jpg", alt: "Cenas de casamentos filmados pela Nath Filmes" },
    // "Onde o amor vira filme": carrossel automático, um espaço para cada frase.
    // Vale foto (.jpg) ou vídeo (.mp4): é só escrever o caminho do arquivo em src.
    "amor-ouvir":         { src: "assets/img/amor-ouvir.jpg", alt: "Casal se beijando diante de uma pequena igreja azul e branca, com a noiva segurando girassóis" },
    "amor-rever":         { src: "assets/img/amor-rever.jpg", alt: "Casal vestido de branco em um parque: a mulher, de braços abertos, sorri enquanto o parceiro a levanta no colo" },
    "amor-sentir":        { src: "assets/img/amor-sentir.jpg", alt: "Noivos ajoelhados no altar, de mãos unidas em oração, com o noivo emocionado" },
    "amor-reviver":       { src: "assets/img/amor-foto-moldura-1.jpg", alt: "Alianças douradas sobre tulipas brancas" },
    // Seção "respiro" (fotos em moldura de polaroide, sem texto), antes do fechamento da Home
    "respiro-grande":     { src: "assets/img/amor-foto-grande.jpg", alt: "Noivos de costas na saída da cerimônia, entre convidados que aplaudem, com a noiva erguendo o buquê" },
    "respiro-polaroid-1": { src: "assets/img/amor-foto-moldura-1.jpg", alt: "Alianças douradas sobre tulipas brancas" },
    "respiro-polaroid-2": { src: "assets/img/amor-foto-moldura-2.jpg", alt: "Casal se beijando diante de uma pequena igreja azul e branca, com a noiva segurando girassóis" },
    "nath-oval":          { src: "assets/img/nath-oval.jpg", alt: "Nath sorrindo, sentada, segurando o celular" },
    "nath-lateral":       { src: "assets/video/nath-lateral.mp4", poster: "assets/posters/nath-lateral.jpg", alt: "Nath filmando um casal que dança em um jardim" },
    // As "Histórias recentes" (3 cartões de casais) são editadas em data/portfolio-aberto.json
    "empresas-video":     { src: "", srcMobile: "", poster: "", alt: "" },
    "depoimentos-foto":   { src: "assets/img/depoimentosfotonoiva.jpg", alt: "Noiva de vestido branco e óculos de coração escrito “CASEI” rindo ao assistir ao vídeo do casamento no celular, ao lado de uma convidada" },

    /* ---- SOBRE ---- */
    "sobre-hero":         { src: "assets/img/sobre-hero.jpg", alt: "Nath sorrindo de olhos fechados, vista na tela de uma câmera fotográfica" },
    "negativo-1":         { src: "assets/img/negativo-1.jpg", alt: "Nath de costas, em preto e branco, fotografando os noivos diante de uma igreja" },
    "negativo-2":         { src: "assets/img/negativo-2.jpg", alt: "Nath de perfil, filmando com o celular, com um rádio comunicador na cintura" },
    "negativo-3":         { src: "assets/img/negativo-3.jpg", alt: "Nath de costas filmando uma cerimônia com o celular, ao lado de um arranjo de flores secas" },
    "negativo-4":         { src: "assets/img/negativo-4.jpg", alt: "Nath sorrindo, segurando o celular com uma luz de vídeo acoplada" },
    // Sem foto por enquanto: enquanto src estiver vazio, este espaço NÃO aparece na página (o texto da equipe fica sozinho).
    // Quando a foto chegar, coloque o arquivo em assets/img/ e preencha src (e alt): ela aparece sozinha.
    "equipe-irmao":       { src: "", alt: "" }
  }
};
