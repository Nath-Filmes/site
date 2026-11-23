# Lista de fotos e vídeos para enviar

**Regra de ouro:** o arquivo tem o **mesmo nome do espaço** no site. Tudo em minúsculas, **sem acento e sem espaço** (use hífen).
Fotos vão em `assets/img/`, vídeos em `assets/video/` e capas dos vídeos em `assets/posters/`.
Depois de copiar os arquivos, escreva o caminho em `site.config.js` (espaços de mídia) ou em `data/portfolio-aberto.json` (cartões de vídeo).

**Cuidado com a extensão:** o Windows costuma esconder o “.jpg” e o “.mp4”. Se você digitar o nome completo com a extensão, o arquivo pode ficar `nome.jpg.jpg`. Digite só `nome` (sem extensão) ao renomear, e o nome certo fica `nome.jpg`.

Formatos: **foto** em JPG ou WebP, no máximo 1600 px no lado maior, de preferência abaixo de 300 KB. **Vídeo** em MP4 (H.264), sem áudio nos de fundo e nas prévias.

---

## PÁGINA INICIAL: o que ainda falta enviar

**Não falta nenhum arquivo obrigatório.** Opcional:
- Prévias que rodam dentro dos cartões de “Histórias recentes”: `exemplo1-previa.mp4` a `exemplo3-previa.mp4` (3 a 6 s, sem áudio) em `assets/video`.

**Já enviado e ligado no site:**
- `amor-foto-grande.jpg`, `amor-foto-moldura-1.jpg`, `amor-foto-moldura-2.jpg`: as fotos da seção de “respiro” (polaroides) antes do fechamento da Home. Para trocar, mude os caminhos `respiro-grande`, `respiro-polaroid-1` e `respiro-polaroid-2` no `site.config.js`.
- `amor-ouvir.jpg` (beijo na igrejinha azul), `amor-rever.jpg` (casal no parque), `amor-sentir.jpg` (casal rezando no altar): fotos do carrossel “Onde o amor vira filme”. O quadro “Reviver cada detalhe.” usa `amor-foto-moldura-1.jpg` (as alianças). As fotos que saíram (noiva ao microfone e convidada rindo) estão em `assets/img/guardadas/` (`amor-ouvir-microfone.jpg` e `amor-rever-risada.jpg`).
- `depoimentosfotonoiva.jpg`: foto da Nath com a noiva.
- `feedback1.webp` a `feedback5.webp`: os 5 depoimentos (prints de WhatsApp), **sem o fundo do chat**. Os originais estão em `assets/img/guardadas/feedbacks-originais/`.
- `exemplo1.mp4`, `exemplo2.mp4`, `exemplo3.mp4`: vídeos de “Histórias recentes”. Na Home, as capas são as **fotos que a Nath enviou** (`assets/posters/home-historia-1.jpg` a `home-historia-3.jpg`, proporção 4:5, sem nenhuma edição). A página Portfólio continua usando `exemplo1.jpg` a `exemplo3.jpg`, que eu gerei a partir dos vídeos. O `exemplo2.mp4` estava em um formato (HEVC 10 bits) que muitos navegadores não tocam, então converti para H.264 (de 13 MB para 3,3 MB, mesma imagem e mesmo áudio).
- `hero-video.mp4` e capa, `nath-oval.jpg`, `nath-lateral.mp4` e capa, logos, ícones e imagem de compartilhamento.

Não são mais usados: `hero-video-vertical.mp4` e as fotos de `assets/img/guardadas/`.

---

## A. Fotos fixas do site (13)

### Home
| ✔ | Arquivo | Onde aparece | Formato |
|---|---|---|---|
| ✅ | `amor-ouvir` | “Onde o amor vira filme”, carrossel automático: foto ou **vídeo** com a palavra **“Ouvir os votos.”** em cima (hoje o beijo na igrejinha azul) | Vertical 4:5. Vídeo: `.mp4` curto, sem áudio |
| ✅ | `amor-rever` | Carrossel: foto ou vídeo com a palavra **“Rever reações.”** (hoje o casal no parque) | Vertical 4:5 |
| ✅ | `amor-sentir` | Carrossel: foto ou vídeo com a palavra **“Sentir a emoção.”** (hoje o casal rezando no altar) | Vertical 4:5 |
| ✅ | `amor-reviver` (hoje usa `amor-foto-moldura-1.jpg`, as alianças) | Carrossel: foto ou vídeo com a palavra **“Reviver cada detalhe.”** | Vertical 4:5 |
| ✅ | `nath-oval.jpg` | Apresentação, retrato em oval | **Retrato da Nath**, vertical 3:4 |
| ✅ | `nath-lateral.mp4` (em `assets/video/`) | Apresentação, **vídeo curto** ao lado (só no computador) | Vertical, 3,9 s, Nath filmando. Capa `nath-lateral.jpg` gerada por mim |
| — | `exp-story-1/2.jpg`, `exp-film-1/2.jpg` | **Não são mais usadas** (a seção das modalidades na Home ficou só com texto) | Guardadas em `assets/img/guardadas/` |
| ☐ | `depoimentos-foto.jpg` | Seção de depoimentos, **foto da Nath com a noiva vendo o vídeo e sorrindo** (foto grande, ao lado dos cartões, sem escurecer) | Quadrada ou 4:5 (cantos arredondados) |

### Sobre
| ✔ | Arquivo | Onde aparece | Formato |
|---|---|---|---|
| ✅ | `sobre-hero.jpg` | Abertura da página, metade direita. **Só no computador**: no celular ela não aparece (nem é baixada) | Já enviada (você sorrindo, vista na tela de uma câmera) |
| ✅ | `negativo-1.jpg` | Tira de negativo, quadro 1 | Já enviada (a foto em preto e branco na igreja) |
| ✅ | `negativo-2.jpg` | Tira de negativo, quadro 2 | Já enviada (de perfil filmando) |
| ✅ | `negativo-3.jpg` | Tira de negativo, quadro 3 | Já enviada (filmando a cerimônia) |
| ✅ | `negativo-4.jpg` | Tira de negativo, quadro 4 | Já enviada (sorrindo com a luz de vídeo) |
| ☐ | `equipe-irmao.jpg` | Equipe, **foto do seu irmão** (vai ser enviada depois; o nome dele não aparece no site). **Enquanto não houver foto, o espaço some da página** e o texto da equipe fica sozinho | Vertical 4:5 (colorida) |

### Experiência
Sem fotos fixas. A abertura da página é só o fundo preto com o texto (a foto grande foi retirada a pedido da Nath).

---

## B. Vídeos fixos do site

| ✔ | Arquivo | Pasta | Onde aparece | Formato |
|---|---|---|---|---|
| ✅ | `hero-video.mp4` | `assets/video/` | Primeira tela da Home (computador) | 16 s, 1280×720, 2,9 MB, sem áudio |
| — | `hero-video-vertical.mp4` | `assets/video/` | **Não é mais usado.** O vídeo horizontal vale também para o celular (o site corta as laterais). Pode apagar este arquivo. | 9,6 s, 720×1280 |
| ✅ | `hero-video.jpg` | `assets/posters/` | Capa da primeira tela | **Já gerei a partir do seu vídeo**, não precisa enviar |
| ☐ | `empresas-video.mp4` | `assets/video/` | Página “Empresas” (`empresas.html`, **virá depois**) | Curto, sem áudio, horizontal |
| ☐ | `empresas-video.jpg` | `assets/posters/` | Capa do vídeo de empresas | Imagem |

Onde escrever: `site.config.js`, espaços `"hero-video"` (`src`, `poster`) e `"empresas-video"`.

---

## C. Vídeos do portfólio (cartões)

Use **número no nome** (nunca o nome do casal). O nome do casal, só com autorização, vai no campo `titulo` do JSON.

### Exemplos disponíveis (página Portfólio, em abas)
Para cada vídeo: o `.mp4` em `assets/video/`, a capa `.jpg` com o **mesmo nome** em `assets/posters/` e, se quiser, uma prévia `-previa.mp4` (3 a 6 s, sem áudio). Depois de enviar, me avise que eu ligo no `data/portfolio-aberto.json`.

| Aba | Vídeo | Situação |
|---|---|---|
| Casamentos | Pré wedding (o primeiro e único) | ✅ `pre-wedding.mp4` |
| Casamentos | Making of da noiva | ✅ `exemplo3.mp4` |
| Casamentos | Cerimônia | ✅ `cerimonia.mp4` (81 s, 17 MB: só carrega quando a pessoa clica) |
| Casamentos | Festa | ✅ `festa.mp4` (o certo, que veio de `festa certo.mp4`; 52 s, 8,8 MB) |
| Trends | 3 vídeos | ✅ `trend-1.mp4`, `trend-2.mp4`, `trend-3.mp4` |
| Empresas | 3 vídeos | ☐ 3 espaços reservados |

### “Histórias recentes” da Página inicial
Lista própria, independente do Portfólio: `data/historias-home.json`. Hoje usa `exemplo1.mp4` (pré wedding), `exemplo2.mp4` (save the date) e `exemplo3.mp4` (making of), como estava antes, com as capas enviadas pela Nath: `home-historia-1.jpg` (pré wedding), `home-historia-2.jpg` (save the date) e `home-historia-3.jpg` (making of da noiva).

### Portfólio completo (liberado pelo formulário)
Mínimo de 6 vídeos: `casal-04` a `casal-09`, com a mesma ideia (`casal-04.mp4`, `casal-04-previa.mp4`, `casal-04.jpg`).
**Dica de proteção:** em vez de arquivos `.mp4`, publique como **“Não listado”** no YouTube ou Vimeo e coloque só o código no JSON (campos `youtube` ou `vimeo`). Aí só precisa da capa `casal-04.jpg`.

Onde escrever: `data/portfolio-aberto.json` (exemplos abertos e Home) e `data/portfolio-completo.json`.

---

## D. Depoimentos (prints de WhatsApp ou texto, **com autorização**)

| ✔ | Arquivo | Pasta | Observação |
|---|---|---|---|
| ☐ | `depoimento-01.jpg` | `assets/img/` | Print, de **StoryMaker** |
| ☐ | `depoimento-02.jpg` | `assets/img/` | Print, de **FilmMaker mobile** |
| ☐ | `depoimento-03.jpg` | `assets/img/` | Print de **empresa** (depois) |
| ☐ | `depoimento-04.jpg` … | `assets/img/` | Quantos mais, melhor |

Onde escrever: `data/depoimentos.json` (cada item com `"tipo": "print"` e `"imagem": "assets/img/depoimento-01.jpg"`). Se preferir só texto, não precisa de arquivo.

---

## Resumo da contagem
- **Fotos fixas:** 12 (6 na Home, contando as 4 do carrossel, e 6 em Sobre). Do Sobre falta só `equipe-irmao` (foto do seu irmão).
- **Vídeos fixos:** 2 versões do vídeo da primeira tela + 1 vídeo de empresas (depois), com 2 capas
- **Vídeos de casais:** 3 para a Home e exemplos abertos, mais pelo menos 6 para o portfólio completo
- **Prints de depoimento:** 3 ou mais
- **Já está pronto (não precisa enviar):** logos, ícones, imagem de compartilhamento e texturas

Dica: se mandar fotos grandes, coloque em `assets/img/originais/` e rode `python tools/otimizar-imagens.py`. Ele cria as versões leves e mostra a linha pronta para colar no `site.config.js`.
