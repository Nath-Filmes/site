# O que ainda falta (e onde colocar cada coisa)

O site já funciona e fica bonito com os espaços reservados. Enquanto algo estiver faltando, aparece um bloco **tracejado com ícone e legenda** (ou um texto tracejado em vinho). Quando você preencher, ele some sozinho.

Marque ✅ conforme for resolvendo.

---

## 1. Dados que precisam ser confirmados (arquivo `site.config.js`)

| ✔ | Item | Onde | Situação atual |
|---|---|---|---|
| ✅ | **Número de WhatsApp** | `whatsapp` | Número real ligado (35 99890-3361). |
| ✅ | **Instagram e TikTok** | `instagram` e `tiktok` | Confirmados por você: `@nath.filmes` nos dois. |
| ☐ | **E-mail de contato** | `email` | Vazio. Aparece na política de privacidade e no rodapé quando preenchido. |
| ✅ | **Serviço do formulário** | `FORM_TIPO`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` | Ligado ao **Supabase** e testado: os contatos caem na tabela `leads_portfolio` (painel do Supabase → Table Editor). Veja o README, seção 7. |
| ✅ | **Número de casamentos filmados** | `casamentos` | Agora diz **“mais de 20 casamentos filmados desde fevereiro de 2025”**, como você pediu. |
| ☐ | **“Agenda aberta para 20XX”** | `agendaAberta` | Desligada. Ligue (`ativo: true`) e ajuste o ano quando quiser. |
| ✅ | **Domínio** | em vários arquivos | Trocado para `www.nathfilmes.com` (27 endereços, com `tools/trocar-dominio.py`; README, seção 9). |

---

## 2. Vídeos

| ✔ | O que | Onde entra |
|---|---|---|
| ✅ | **Vídeo da primeira tela** (computador + vertical + capas): **já está no site** | `site.config.js` → `midia` → `"hero-video"`. Os vídeos já estão sem a faixa de áudio. O 1º quadro do vídeo do computador mostra o nome do casal e a data; você confirmou que não há problema. |
| ✅ | **3 vídeos curtos de casamento** (“Histórias recentes” da Home e exemplos abertos do Portfólio): **já estão no site** (`exemplo1.mp4` a `exemplo3.mp4`) | `data/historias-home.json` (Home) e `data/portfolio-aberto.json` (Portfólio). Falta, se quiser, o nome do casal (só com autorização) no campo `titulo` do Portfólio. As capas da Home agora são as suas fotos (`home-historia-1` a `3` em `assets/posters/`), e as de Casamentos no Portfólio também (`capa-pre-wedding`, `capa-making-of`, `capa-cerimonia`, `capa-festa`). As das Trends também (`capa-trend-1` a `3`). |
| ☐ | **Vídeo institucional para empresas** (página Empresas). Por enquanto o espaço do vídeo não aparece; a página fica só com o texto | `site.config.js` → `"empresas-video"` |
| ☐ | **Vídeos das abas do Portfólio:** faltam só os de Empresas (a aba Empresas foi retirada dos exemplos por enquanto; quando tiver vídeos, é só me mandar que eu volto com ela). Pré wedding, making of, cerimônia, festa e os 3 Trends já estão no site. | `data/portfolio-aberto.json` (`categoria` `"casamento"`, `"trend"` ou `"empresa"`) |
| ☐ | **Vídeos do portfólio completo** (liberados pelo formulário) | `data/portfolio-completo.json` (de preferência como “Não listado” no YouTube ou Vimeo) |

---

## 3. Fotos (todas em `site.config.js` → `midia`)

Use preferencialmente luz natural. O site **não altera as cores** das suas fotos: elas aparecem exatamente como você enviar (coloridas ou em preto e branco).

| ✔ | Nome do espaço | Aparece em | Sugestão |
|---|---|---|---|
| ✅ | `amor-ouvir`, `amor-rever`, `amor-sentir`, `amor-reviver` | Home, carrossel de “Onde o amor vira filme”: “Ouvir os votos.” (beijo na igrejinha azul), “Rever reações.” (casal no parque), “Sentir a emoção.” (casal rezando no altar), “Reviver cada detalhe.” (alianças, foto provisória: pode trocar por outra de detalhe) | Já enviadas e ligadas (vertical 4:5). Qualquer espaço aceita vídeo: basta escrever o `.mp4` no `src`. O beijo também aparece na polaroide 2 do “respiro” e as alianças na polaroide 1. |
| ✅ | `nath-oval` | Home, apresentação | **Retrato da Nath**, vertical 3:4 (será cortado em oval) |
| ✅ | `nath-lateral` | Home, apresentação (só no computador) | **Já é um vídeo curto** (`assets/video/nath-lateral.mp4`) |
| — | `exp-story-1/2`, `exp-film-1/2` | Não são mais usadas na Home | Fotos guardadas em `assets/img/guardadas/` |
| ✅ | `depoimentos-foto` (arquivo `depoimentosfotonoiva.jpg`) | Home, depoimentos: foto da Nath com a noiva vendo o vídeo e sorrindo | Quadrada ou 4:5 (cantos arredondados, sem escurecer) |
| ✅ | `sobre-hero` | Sobre, abertura (metade direita) | Já enviada (você sorrindo, vista na tela de uma câmera). **Só aparece no computador**; no celular fica só o texto e a tira de negativo. |
| ✅ | `negativo-1` a `negativo-4` | Sobre, tira de negativo | Já enviadas (do seu zip `fotos minhas.zip`; a 5ª foto, a da noiva com óculos “CASEI”, ficou de fora porque já está na Home) |
| ☐ | `equipe-irmao` | Sobre, equipe | **Foto do seu irmão**, vertical 4:5 (colorida). Você vai enviar depois. O nome dele não aparece no site. Enquanto não chegar, o espaço da foto some da página (o texto da equipe fica sozinho); quando chegar, é só me mandar que ela aparece. |

---

## 4. Depoimentos (`data/depoimentos.json`)

| ✔ | O que | Observação |
|---|---|---|
| ✅ | 5 depoimentos em print de WhatsApp (`feedback1.jpg` a `feedback5.jpeg`): **já estão na Home** | `data/depoimentos.json`. Você os enviou, então entendo que há autorização de cada cliente. Ainda faltam, se quiser, depoimentos separados por modalidade (StoryMaker e FilmMaker mobile). |
| ☐ | Depoimento de **empresa** | Depois, quando tiver |

Não coloquei nenhum depoimento, nome de casal, número, prêmio ou veiculação na imprensa que você não tenha enviado.

---

## 5. Textos que dependem de você

| ✔ | O que | Onde |
|---|---|---|
| ☐ | **Nomes ou iniciais dos casais** (só com autorização) | campo `titulo` em `data/portfolio-aberto.json` e `portfolio-completo.json` |
| ✅ | **Nome do seu irmão:** tirado do site a seu pedido (o bloco “A equipe” diz só “Meu irmão”) | `sobre.html`, bloco “A equipe” |
| ☐ | Link do **Instagram separado para os institucionais** (quando criar) | Pode virar um botão na página Empresas (`empresas.html`) |

---

## 6. Textos que eu escrevi além do seu rascunho (revise o tom)

Mantive suas frases e o roteiro. Estes trechos eu criei, sem inventar fatos, para o site não ficar vazio:

- **Home:** título e parágrafo da apresentação (“Sinto a emoção junto com você…”), frase de apoio da página Empresas (“Um vídeo bem feito ajuda a sua marca a ser lembrada e a atrair os clientes certos.”), chamada dos depoimentos.
- **Sobre:** título “Eu não filmo sozinha” e o fechamento. (As seções “Como eu trabalho”, “Meus valores” e “Meus amores / Isso ou aquilo” foram retiradas a pedido da Nath.)
- **Experiência:** textos dos itens de bônus. (A seção “Quatro passos, do primeiro oi ao seu filme” foi retirada por completo a pedido da Nath em 23/11/2026. O bloco “Sem letras miúdas: o FilmMaker é filmado com celular” foi retirado a pedido da Nath: o nome “mobile” já diz isso.)
- **Política de privacidade:** escrita em linguagem simples. **Vale uma revisão final** (idealmente com quem entende de LGPD) e o preenchimento do e-mail de contato.

---

## 7. Pontos para você decidir ou confirmar

- **Drone:** você comentou que adicionou drone. Não prometi isso em nenhuma página porque não sei se entra em cada pacote. Me diga e eu incluo.
- **Prazo por pacote:** o site diz “3 a 5 dias úteis” para o FilmMaker e para o reels do StoryMaker, como você escreveu. Se algum pacote tiver prazo diferente, é só avisar.
- **Deslocamento** (até 40 km sem taxa, transporte e hospedagem à parte): não coloquei no site, já que você não pediu. Pode ser um bom item para “Bônus e condições”.
- **After movie:** não incluí, porque ainda não está no contrato.
- **Logo:** usei os PNGs transparentes do `Logo.zip` (preto, branco, vinho e creme, com e sem os cantos de câmera). O arquivo solto `Logo.png` tem fundo creme (não é transparente), então não foi usado. O ideal seria ter também **SVG**.
