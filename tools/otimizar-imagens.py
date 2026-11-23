#!/usr/bin/env python3
"""
Nath Filmes · otimizador de fotos (opcional)

O que faz: pega as fotos originais de  assets/img/originais/  e cria versões leves
em WebP, em vários tamanhos (480, 800, 1200 e 1600 px de largura), dentro de  assets/img/.
No final mostra a linha pronta para colar no  site.config.js  (já com srcset).

Como usar:
  1) Instale o Pillow uma vez:      pip install pillow
  2) Coloque as fotos em:           assets/img/originais/
  3) Rode (na pasta do site):       python tools/otimizar-imagens.py
  4) Copie as linhas que aparecerem para o site.config.js e escreva o "alt" de cada foto.
"""
import re
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Falta o Pillow. Instale com:  pip install pillow")

LARGURAS = [480, 800, 1200, 1600]
QUALIDADE = 80
RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "assets" / "img" / "originais"
DESTINO = RAIZ / "assets" / "img"
EXTENSOES = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".bmp"}


def nome_limpo(texto: str) -> str:
    """minúsculas, sem acento, sem espaços (bom para endereços de site)"""
    trocas = str.maketrans("áàâãäéèêëíìîïóòôõöúùûüçñ", "aaaaaeeeeiiiiooooouuuucn")
    texto = texto.lower().translate(trocas)
    return re.sub(r"[^a-z0-9]+", "-", texto).strip("-") or "foto"


def main() -> None:
    ORIGEM.mkdir(parents=True, exist_ok=True)
    fotos = sorted(p for p in ORIGEM.iterdir() if p.suffix.lower() in EXTENSOES)
    if not fotos:
        print(f"Nenhuma foto em {ORIGEM}\nColoque as fotos lá e rode de novo.")
        return

    linhas = []
    for foto in fotos:
        base = nome_limpo(foto.stem)
        with Image.open(foto) as im:
            im = ImageOps.exif_transpose(im)          # respeita a rotação do celular
            if im.mode not in ("RGB", "RGBA"):
                im = im.convert("RGB")
            larg_original = im.width
            geradas = []
            for larg in LARGURAS:
                if larg > larg_original and geradas:   # não amplia a foto
                    continue
                alvo = min(larg, larg_original)
                altura = round(im.height * alvo / im.width)
                redim = im.resize((alvo, altura), Image.LANCZOS)
                saida = DESTINO / f"{base}-{alvo}.webp"
                redim.save(saida, "WEBP", quality=QUALIDADE, method=6)
                geradas.append((alvo, saida))
                print(f"  criado {saida.relative_to(RAIZ)}  ({saida.stat().st_size // 1024} KB)")

        maior = geradas[-1]
        srcset = ", ".join(f"assets/img/{p.name} {w}w" for w, p in geradas)
        linhas.append(
            f'    "NOME-DO-ESPACO": {{ src: "assets/img/{maior[1].name}", '
            f'srcset: "{srcset}", alt: "DESCREVA A FOTO" }},   // de {foto.name}'
        )

    print("\nCole no site.config.js (troque NOME-DO-ESPACO pelo espaço certo e escreva o alt):\n")
    print("\n".join(linhas))


if __name__ == "__main__":
    main()
