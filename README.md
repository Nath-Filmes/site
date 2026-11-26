# Site da Nath Filmes

Site institucional da Nath Filmes (videomaker de casamentos e de conteúdo para empresas e eventos, em Pouso Alegre e região).
Feito só com HTML, CSS e JavaScript, **sem instalar nada e sem “build”**: dá para editar com o Bloco de Notas ou o VS Code e publicar arrastando a pasta.

> **Leia primeiro:** `CONTEUDO-PENDENTE.md` lista tudo que ainda falta (fotos, vídeos, número de WhatsApp real etc.) e onde colocar cada coisa.

---

## 1. O que tem em cada pasta

| Arquivo ou pasta | Para que serve |
|---|---|
| `index.html` | Home (primeira tela, amor vira filme, diferenciais, depoimentos, histórias, apresentação, modalidades, fechamento) |
| `empresas.html` | Empresas e eventos (aberta pelo botão “Empresas” do menu) |
| `sobre.html` | Sobre a Nath e a equipe |
| `experiencia.html` | Modalidades e pacotes (sem valores) e pedido de orçamento |
| `portfolio.html` | Exemplos disponíveis (abas Casamentos e Trends) e portfólio completo (liberado pelo formulário, dividido em FilmMaker mobile e StoryMaker) |
| `privacidade.html` | Política de privacidade em linguagem simples |
| `404.html` | Página de “não encontrado” |
| **`site.config.js`** | **Número do WhatsApp, links, mensagens, formulário, fotos e vídeos** |
| `data/` | Listas editáveis: `portfolio-aberto.json`, `portfolio-completo.json`, `depoimentos.json` |
| `assets/logo/` | Logos (PNG e WebP, fundo transparente, em preto, branco, vinho e creme) |
| `assets/img/`, `assets/video/`, `assets/posters/` | Onde entram suas fotos, vídeos e capas |
| `css/style.css` | Visual (cores, fontes, espaçamentos). As cores estão no topo, em `:root` |
| `js/` | Comportamentos (`layout.js` monta o topo e o rodapé de todas as páginas). `js/vendor/supabase.js` é a biblioteca do Supabase (seção 7) |
| `tools/supabase/` | SQL da tabela do formulário (registro do que foi criado no Supabase) |
| `package.json`, `.env` | Bibliotecas do Supabase e variáveis de ambiente (seção 7). Não fazem parte do site publicado |
| `tools/otimizar-imagens.py` | (Opcional) deixa as fotos leves, em vários tamanhos |
| `abrir-site-local.bat` | Abre o site no seu computador para você conferir |
| `sitemap.xml`, `robots.txt` | Para o Google (veja a seção 9) |

---

## 2. Ver o site no seu computador

O site precisa de um “servidorzinho” local (abrir o `index.html` com duplo clique mostra a página, mas o portfólio e os depoimentos só carregam via servidor).

- **Windows, jeito fácil:** dê dois cliques em **`abrir-site-local.bat`**. Ele abre o navegador em `http://localhost:8080`. Feche a janela preta para parar. (Precisa do Python ou do Node instalados.)
- **VS Code:** instale a extensão **Live Server**, clique com o botão direito em `index.html` → *Open with Live Server*.

Depois de editar um arquivo, salve e atualize a página com **Ctrl + F5**.

---

## 3. Como editar textos

Os textos estão nos próprios arquivos `.html`. Abra o arquivo, use **Ctrl + F** para achar a frase e troque o texto **sem mexer no que está entre `< >`**.

- Cada parte da Home é um **bloco independente**, marcado por um comentário `<!-- ================= COMPONENTE: ... -->` e por `data-bloco="..."`. Mais tarde, para criar as landing pages de casamento e de empresas, basta copiar o bloco desejado para um HTML novo.
- Palavra em destaque dos títulos: fica entre `<em> ... </em>` (aparece em itálico).
- **Menu e rodapé** (iguais em todas as páginas): edite `js/layout.js` (lista `MENU` e a função `htmlRodape`).
- Os textos que aparecem **tracejados em vinho** são espaços reservados que você precisa preencher (ex.: “escreva aqui um amor seu” na página Sobre). Troque o trecho `<span class="reservado-texto">…</span>` pelo seu texto normal.

> Regra do projeto: **nenhum valor em reais aparece no site.** Mantenha assim ao editar. Os valores só vão pelo WhatsApp.

---

## 4. Como trocar fotos e vídeos

Todas as fotos e vídeos são “espaços” com nome, listados em **`site.config.js`**, na parte `midia`. Enquanto um espaço está vazio (`src: ""`), o site mostra um bloco tracejado com ícone, a legenda do que entra ali e o nome do espaço.

### Foto
1. Copie a foto para `assets/img/` (ex.: `assets/img/nath-retrato.jpg`).
2. Em `site.config.js`, preencha o espaço:
   ```js
   "nath-oval": { src: "assets/img/nath-retrato.jpg", alt: "Nath sorrindo, de camisa branca" },
   ```
   O `alt` descreve a foto para quem usa leitor de tela. Se ficar vazio, o site usa a legenda do espaço.

**Dica de desempenho:** use fotos com no máximo 1600 px no lado maior, em JPG ou WebP, de preferência abaixo de 300 KB. Para automatizar, coloque as originais em `assets/img/originais/` e rode `python tools/otimizar-imagens.py` (precisa do Python e do Pillow: `pip install pillow`). O script cria versões em WebP de vários tamanhos e **mostra a linha pronta para colar** no `site.config.js`, já com `srcset`.

### Vídeo
1. Copie o vídeo para `assets/video/` e a imagem de capa para `assets/posters/`.
2. Preencha o espaço:
   ```js
   "hero-video": {
     src: "assets/video/hero.mp4",
     srcMobile: "assets/video/hero-vertical.mp4",   // opcional: versão mais leve para celular
     poster: "assets/posters/hero.jpg",
     alt: "Casal se abraçando ao pôr do sol"
   },
   ```
3. Recomendações para a primeira tela: **MP4 (H.264), sem áudio, de 8 a 15 segundos em loop**. Para o computador, 1280×720 com até uns 4 MB. Para o celular (`srcMobile`), 720×1280 com até uns 2,5 MB. Dá para comprimir de graça no **HandBrake** ou no **Clipchamp**.
4. O site já cuida do resto: o vídeo é mudo, em loop, só carrega quando chega perto da tela, pausa ao sair dela, e quem pede “menos movimento” no celular ou no computador vê só a imagem de capa. Na primeira tela há um botão para pausar o vídeo.

### Nomes dos espaços de foto e vídeo
Veja a tabela completa, com a página e a sugestão de formato de cada um, em `CONTEUDO-PENDENTE.md`.

---

## 5. Portfólio e depoimentos

### Exemplos disponíveis (Portfólio) e “Histórias recentes” (Home): `data/portfolio-aberto.json`
Cada bloco `{ ... }` é um cartão de vídeo. O arquivo tem instruções no início. Resumindo:
- `categoria`: `"casamento"`, `"trend"` ou `"empresa"`. Define em qual aba do Portfólio o cartão aparece (Casamentos ou Trends; a aba Empresas foi retirada por enquanto).
- `tipo`: o rótulo do cartão (ex.: “Pré wedding”, “Making of da noiva”, “Cerimônia”, “Festa”). Vazio mostra o nome da categoria.
- `titulo`: nome do casal ou da empresa (**só com autorização**). Vazio = não aparece nome.
- `arquivo`, `youtube` ou `vimeo`: o vídeo que abre ao clicar (use só um). Sem nenhum deles, o cartão mostra o espaço reservado.
- `previa`: vídeo bem curto (3 a 6 s, sem som) que fica rodando dentro do cartão. `poster`: imagem de capa (mesmo nome do vídeo, na pasta `assets/posters`).
- Para ter mais vídeos em uma aba, copie um cartão inteiro e cole logo depois dele.

### “Histórias recentes” da Home: `data/historias-home.json`
Os 3 vídeos da seção da página inicial têm lista própria (mexer no Portfólio não muda a Home). Cada item tem `poster`, `arquivo` (ou `youtube`/`vimeo`) e `formato`. Só os 3 primeiros aparecem.

### Portfólio completo: `data/portfolio-completo.json`
Esta lista **só é baixada depois que a pessoa preenche o formulário**. Ela é dividida em **três seções**: “FilmMaker mobile”, “StoryMaker” e “Pré wedding” (hoje 9 cartões no FilmMaker, um deles na vertical, 7 no StoryMaker, com os rótulos que a Nath definiu, como “Cerimônia e festa” ou “Pré wedding, making of, cerimônia e festa”, e 4 no Pré wedding). Cada seção tem `titulo`, `destaque` (palavra em itálico), `rotulo` e a lista de `itens`; cada item usa os mesmos campos dos cartões acima (`tipo`, `poster`, `arquivo`/`youtube`/`vimeo`...). Enquanto um cartão não tiver vídeo, ele aparece como espaço reservado.

**StoryMaker em estilo stories do Instagram:** a seção StoryMaker tem `"estilo": "stories"`. Em vez de uma grade, aparecem bolinhas com anel (como os destaques do Instagram). Tocar em uma abre o visualizador em tela cheia: as barrinhas no topo mostram o progresso, o toque à direita avança, à esquerda volta, segurar pausa, e o story seguinte entra sozinho quando o vídeo termina. O anel fica cinza depois de assistir. Para voltar a uma grade comum, apague a linha `"estilo": "stories"`.
- **Cada story (cada bolinha) tem vários pedaços**, na ordem: clipes de vídeo e fotos. No JSON isso é a lista `segmentos` do item: `{ "arquivo": "assets/stories/1/02.mp4" }` para vídeo e `{ "foto": "assets/stories/1/01.jpg" }` para foto (a foto dura 5 s; para mudar, `"duracao": 3`). Cada pedaço ganha uma barrinha no topo; ao terminar o último, abre o próximo story. `poster` é a foto da bolinha (aqui, `assets/stories/N/capa.jpg`: as capas de destaque que a Nath enviou, cortadas pelo centro dentro do círculo). Item sem `segmentos` continua funcionando como antes (um vídeo só).

**Pré wedding:** terceira seção (`"id": "prewedding"`, eyebrow “Ensaio”), uma grade de cartões verticais com 4 vídeos de 1 a 1,5 min (reels de 4 casais). Os arquivos ficam em `assets/prewedding/1.mp4` a `4.mp4` (reduzidos com `tools/reduzir-video.py` para 540×960, CRF 31: 28 MB no total, contra 79 MB dos originais) e as capas em `assets/posters/capa-prewedding-1.jpg` a `4.jpg` (por enquanto um quadro de cada vídeo; para usar uma foto, troque o arquivo mantendo o nome). `"colunas": 4` na seção coloca os 4 cartões lado a lado no computador; sem esse campo a grade tem 3 colunas. O vídeo toca no mesmo player dos outros cartões. Para acrescentar mais um: copie um item `{ ... }` e aponte para o novo `.mp4` e a nova capa.
- Os arquivos dos stories ficam em `assets/stories/1` a `7` (mesma ordem das bolinhas). Os vídeos vêm dos clipes originais da Nath (pasta do Drive “Videos story maker”), reduzidos com `python tools/reduzir-video.py ENTRADA.mov SAIDA.mp4` (vertical 540×960, H.264 + AAC, com “faststart”; cerca de 1 a 4 MB por clipe). As fotos estão idênticas às originais. Só o pedaço que está passando (e o seguinte) é baixado.
- Vídeos de story novos: curtos, na vertical (9:16), em H.264 com som AAC. Rode a ferramenta acima neles antes de colocar no site.
- Vídeos longos (como os do FilmMaker, de 7 a 20 minutos) **não** devem ir como `.mp4` dentro do site: publique como “Não listado” no YouTube ou no Vimeo e use os campos `youtube` ou `vimeo`.

### Depoimentos: `data/depoimentos.json`
Aceita print de WhatsApp (`"tipo": "print"` + `"imagem"`) ou texto (`"tipo": "texto"`). **Só publique com autorização de cada cliente.** Os itens `"tipo": "reservado"` são os espaços reservados.

> Cuidado ao editar `.json`: não apague aspas nem vírgulas. Na dúvida, copie um bloco inteiro e edite a cópia.

---

## 6. WhatsApp

Em `site.config.js`:
- **`whatsapp`**: o número, só com dígitos, com 55 + DDD (ex.: `"5535991234567"`). Já está com o número real da Nath.
- **`mensagens`**: os textos pré-preenchidos de cada situação (reservar data, orçamento com pacote, empresas, depois de ver o portfólio, geral). Em `orcamento`, `{modalidade}` e `{pacote}` são trocados pela escolha da pessoa na página Experiência.

O botão flutuante e todos os botões “Reservar minha data” e “Pedir orçamento” usam esses textos.

---

## 7. Formulário do portfólio completo

O formulário (nome, e-mail e celular com consentimento) **grava no Supabase** (banco de dados), no projeto “nath filmes site Project”. A configuração fica em `site.config.js`:

```js
FORM_TIPO: "supabase",
SUPABASE_URL: "https://vvbvurgbeheedfuenawy.supabase.co",
SUPABASE_PUBLISHABLE_KEY: "sb_publishable_...",   // chave PÚBLICA: pode ficar no site
SUPABASE_TABELA: "leads_portfolio",
```

### Onde ver os contatos
Entre em **supabase.com/dashboard** → projeto *nath filmes site Project* → **Table Editor** → tabela **leads_portfolio**. Lá você vê nome, e-mail, celular, data e a página de origem, e o botão *Export* baixa tudo em CSV. Não precisa de login no site: o acesso é só o seu, pelo painel do Supabase.

### Como isso é protegido
- Qualquer visitante consegue **enviar** o formulário, mas **ninguém de fora consegue ler, alterar ou apagar** os contatos (RLS ligado, só permissão de inserir). Isso foi testado.
- A chave `publishable` aparece no código do site de propósito: ela só abre o que o banco permite. **Nunca** cole no site a chave `secret` / `service_role`.
- O banco recusa lixo: nome de 2 a 120 caracteres, e-mail e celular válidos e consentimento obrigatório. O SQL completo está em `tools/supabase/leads-portfolio.sql`.
- Limite conhecido: não há limite de envios por pessoa. O site tem uma armadilha invisível contra robôs, mas alguém que chame a API direto pode enviar lixo em volume. Se acontecer, dá para acrescentar proteção (por exemplo, Cloudflare Turnstile).

### Arquivos do Supabase no projeto
- `js/vendor/supabase.js`: cópia da biblioteca `@supabase/supabase-js` (versão 2.119.0) que o navegador carrega só na página Portfólio. Fica no próprio site, sem depender de terceiros.
- `package.json` e `package-lock.json`: guardam as versões exatas instaladas (`@supabase/supabase-js` 2.119.0 e `@supabase/ssr` 0.12.7). O `@supabase/ssr` é para Next.js e **este site não usa**; ele só está lá porque foi pedido.
- `.env`: guarda `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, mas **o site estático não lê esse arquivo** (ele lê o `site.config.js`). O `.env` não vai para o GitHub nem para a Vercel.
- Para atualizar a biblioteca (só quem mexe no código): `npm install --save-exact --ignore-scripts --min-release-age=7 @supabase/supabase-js` e depois copie `node_modules/@supabase/supabase-js/dist/umd/supabase.js` por cima de `js/vendor/supabase.js`.

Se `SUPABASE_URL` ou a chave ficarem vazias, o formulário volta ao **modo de teste**: libera o portfólio, mas **não envia nada** (aparece o aviso “Modo de teste” na tela e no console do navegador).

### Outras opções (só se um dia quiser trocar o Supabase por outro serviço)
Troque `FORM_TIPO` e preencha `FORM_ENDPOINT` (endereço do serviço). Na Vercel, as opções que funcionam são a A (Formspree) e a C (Google Apps Script).

### Opção A: Formspree (a mais simples)
1. Crie uma conta em formspree.io e clique em *New form*.
2. Copie o endereço do formulário (parece com `https://formspree.io/f/abcdwxyz`).
3. Cole em `FORM_ENDPOINT` e deixe `FORM_TIPO: "formspree"`.
4. Os contatos chegam no seu e-mail e ficam no painel do Formspree.

### Opção B: Netlify Forms (⚠️ só funciona se o site estiver na Netlify; **não funciona na Vercel**)
1. Deixe `FORM_ENDPOINT: ""` e troque para `FORM_TIPO: "netlify"`.
2. Publique o site na Netlify (seção 10). O formulário já está pronto no `portfolio.html` (`data-netlify="true"`).
3. No painel da Netlify, abra *Forms* para ver os contatos e ative o aviso por e-mail em *Form notifications*.

### Opção C: Google Apps Script (grava em uma planilha do Google)
1. Crie uma planilha no Google Sheets. Vá em **Extensões → Apps Script**.
2. Apague o conteúdo e cole:
   ```js
   function limpar(v) { v = String(v || ''); return /^[=+\-@]/.test(v) ? "'" + v : v; }
   function doPost(e) {
     var d = JSON.parse(e.postData.contents);
     var ss = SpreadsheetApp.getActiveSpreadsheet();
     var aba = ss.getSheetByName('Contatos') || ss.insertSheet('Contatos');
     if (aba.getLastRow() === 0) aba.appendRow(['Data', 'Nome', 'E-mail', 'Celular', 'Consentimento', 'Página']);
     aba.appendRow([new Date(), limpar(d.nome), limpar(d.email), limpar(d.celular), limpar(d.consentimento), limpar(d.pagina)]);
     return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
   }
   ```
3. Clique em **Implantar → Nova implantação → App da Web**. Em *Executar como* escolha **Eu** e em *Quem pode acessar* escolha **Qualquer pessoa**. Autorize e copie o endereço que termina em `/exec`.
4. Cole em `FORM_ENDPOINT` e use `FORM_TIPO: "googlescript"`.

### Como testar
Abra `portfolio.html`, preencha com dados de teste e confira se o contato chegou (no Supabase: *Table Editor → leads_portfolio*; **apague a linha de teste depois**, para não misturar com contatos de verdade). Depois, para testar de novo, apague o sinal do navegador: nas ferramentas do navegador (F12) → *Application* → *Local Storage* → apague `nf_portfolio_liberado`. Ou use uma janela anônima.

### ⚠️ Sobre a proteção do portfólio
O bloqueio é **“suave”**: a lista de vídeos só é baixada depois do envio do formulário e a pessoa fica liberada nas próximas visitas (o navegador guarda um sinal). Quem entende de tecnologia consegue abrir `data/portfolio-completo.json` direto no navegador. Para proteger **de verdade**, publique os vídeos como **“Não listados”** no YouTube ou no Vimeo e use os campos `youtube` ou `vimeo` do JSON (assim só quem recebe o código vê o vídeo).

### Privacidade (LGPD)
O formulário só envia com a caixa de consentimento marcada e leva para a `privacidade.html`. Preencha o e-mail de contato em `site.config.js` (`email`) e releia a política: ela diz, em linguagem simples, quais dados são coletados e como pedir exclusão.

---

## 8. Ligar e desligar partes do site

Em `site.config.js`:
- **`agendaAberta`**: troque `ativo: false` por `true` (e ajuste o ano em `texto`) para aparecer “Agenda aberta para 2027” na faixa em movimento da Home.
- **`casamentos`**: mostra “mais de 20 casamentos filmados desde fevereiro de 2025” na página Sobre (`prefixo`, `total` e `desde`). Atualize o número quando quiser. Para esconder, use `mostrar: false`; para tirar o “mais de”, deixe `prefixo: ""`.

---

## 9. Domínio e Google (SEO)

O endereço oficial do site é **`https://www.nathfilmes.com`** (desde 23/11/2026). A Vercel também responde em `site-eight-sigma-99.vercel.app`, e `nathfilmes.com` (sem o www) redireciona para o `www`. Esse endereço está nas páginas (`canonical`, prévias de compartilhamento), no `sitemap.xml` e no `robots.txt`.

Se um dia o endereço mudar, troque em todos os arquivos de uma vez, no terminal, dentro da pasta do site:

```
python tools/trocar-dominio.py novo-endereco.com.br
```

O programa descobre sozinho qual endereço estava valendo, então pode rodar quantas vezes precisar. Depois é só publicar de novo (commit e envio ao GitHub).

Isso atualiza os endereços das páginas (`canonical`), as prévias de compartilhamento (WhatsApp, Instagram), os dados estruturados do Google (LocalBusiness), o `sitemap.xml` e o `robots.txt`.

Depois de publicar, cadastre o site no **Google Search Console** e envie o `sitemap.xml`. Cadastre também o **Perfil da Empresa no Google** (Google Meu Negócio), que ajuda muito a aparecer em buscas como “videomaker de casamento em Pouso Alegre”.

---

## 10. Como publicar (passo a passo)

Escolha **uma** opção.

### Vercel (a que a Nath vai usar, ligada ao GitHub)
O site já vem com o `vercel.json` (cabeçalhos de segurança, cache das fotos e vídeos e bloqueio dos arquivos de uso interno) e o `.vercelignore`. Não precisa instalar nada nem montar o site.
1. Entre em **vercel.com** e vá em *Add New → Project*.
2. Em *Import Git Repository*, escolha **Nath-Filmes/site**. Se o repositório não aparecer, clique em *Adjust GitHub App Permissions* e libere a organização `Nath-Filmes` (quem é dono da organização precisa aprovar).
3. Em *Framework Preset* deixe **Other**. Deixe **vazios** *Build Command*, *Output Directory* e *Install Command*. Clique em **Deploy**.
4. Depois disso, **todo envio ao GitHub na ramificação `main` publica o site sozinho** (leva cerca de 1 minuto). Envios em outras ramificações geram um endereço de teste.
5. Domínio próprio: no projeto, *Settings → Domains → Add* e siga as instruções de DNS.
6. Troque o endereço de exemplo pelo real (seção 9). O formulário já está ligado ao Supabase (seção 7); depois de publicar, faça um envio de teste e apague a linha no painel.

O `package.json` só guarda as bibliotecas do Supabase. O site usa a cópia em `js/vendor/supabase.js`, então a Vercel não precisa montar nada. O `.vercelignore` e o `vercel.json` também escondem `package.json`, `package-lock.json` e `.env`.

Confira depois de publicar:
- Abra `seu-endereco.vercel.app/README.md` e `/tools/trocar-dominio.py`: o esperado é voltar para a página inicial. Se aparecer o texto do arquivo, avise para ajustarmos.
- Atenção ao plano: os termos de uso da Vercel dizem que o plano **Hobby (gratuito) é só para uso pessoal ou não comercial**. O site de um negócio pode precisar do plano pago (Pro). Confirme com a Vercel antes de divulgar.

### Netlify (a mais fácil)
1. Entre em **app.netlify.com/drop** (crie uma conta grátis).
2. **Arraste a pasta inteira do site** para a área indicada. Em segundos o site está no ar, com um endereço do tipo `nome.netlify.app`.
3. Para usar seu domínio: *Domain management → Add a domain* e siga as instruções.
4. Para atualizar depois: entre no site → *Deploys* → arraste a pasta de novo.

### Cloudflare Pages
1. Crie conta em **dash.cloudflare.com** → *Workers & Pages* → *Create* → *Pages* → **Upload assets**.
2. Dê um nome ao projeto e arraste a pasta do site. Clique em *Deploy*.
3. Para o domínio próprio: *Custom domains → Set up a domain*.

### GitHub Pages
1. Crie um repositório no GitHub e envie os arquivos do site (*Add file → Upload files*).
2. Vá em *Settings → Pages*, escolha *Deploy from a branch*, a branch `main` e a pasta `/ (root)`.
3. O site fica em `https://seu-usuario.github.io/nome-do-repositorio/`.
4. ⚠️ Nesse endereço (com subpasta), apague a linha `<base href="/">` do arquivo `404.html`.

---

## 11. Cuidados e dúvidas comuns

- **O portfólio ou os depoimentos aparecem vazios no meu computador.** Abra o site pelo `abrir-site-local.bat` (ou Live Server), não com duplo clique no HTML.
- **Mudei o `site.config.js` e nada mudou.** Atualize com **Ctrl + F5**.
- **O vídeo da primeira tela não aparece.** Confira o caminho em `src` (maiúsculas e minúsculas importam, sem acentos nem espaços no nome do arquivo) e se o arquivo é MP4 (H.264).
- **Texto “em inglês” ou valor em reais.** O site foi feito sem isso; se aparecer algum, é só trocar no HTML.
- **Logo:** os PNGs da pasta `assets/logo/` têm fundo transparente. O ideal seria ter também o logo em **SVG** (vetor), que fica perfeito em qualquer tamanho. Peça ao designer, se tiver.
- **Acessibilidade:** o site tem “pular para o conteúdo”, foco visível no teclado, botões com pelo menos 44 px e respeita a opção “reduzir movimento” do aparelho. Mantenha o texto `alt` das fotos preenchido.
- **Fontes:** Cormorant Garamond, Pinyon Script e Poppins, carregadas do Google Fonts. Se quiser trocar, mude o `<link>` no `<head>` de cada página e as variáveis `--f-serif`, `--f-script` e `--f-sans` no começo do `css/style.css`.
