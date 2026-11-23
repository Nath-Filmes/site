#!/usr/bin/env python3
"""Troca o endereço do site em todos os lugares de uma vez.

Os arquivos do site (páginas, sitemap.xml e robots.txt) guardam o endereço completo
(https://...) em: canonical, prévia de compartilhamento (WhatsApp/Instagram), dados do
Google e sitemap. Este programa lê o endereço que está valendo hoje e troca pelo novo.

Como usar (abra o terminal na pasta do site):

    python tools/trocar-dominio.py nath-filmes.vercel.app
    python tools/trocar-dominio.py www.nathfilmes.com.br

Pode rodar de novo quando o domínio próprio ficar pronto: ele descobre sozinho qual era
o endereço anterior. Depois de trocar, publique de novo (commit e envio ao GitHub).
"""
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
EXTENSOES = {".html", ".xml", ".txt"}


def endereco_atual():
    """Lê o endereço valendo hoje na tag canonical da Home."""
    texto = (RAIZ / "index.html").read_text(encoding="utf-8")
    m = re.search(r'<link[^>]+rel="canonical"[^>]+href="https://([^/"]+)/', texto)
    if not m:
        sys.exit("Não achei a linha canonical em index.html. Nada foi alterado.")
    return m.group(1)


def endereco_novo(bruto):
    """Aceita 'nathfilmes.com.br', 'https://www.nathfilmes.com.br/' etc."""
    s = bruto.strip().lower()
    s = re.sub(r"^https?://", "", s).split("/")[0]
    if not re.fullmatch(r"[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+", s):
        sys.exit(f"'{bruto}' não parece um endereço de site. Exemplo: www.nathfilmes.com.br")
    return s


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    antigo = endereco_atual()
    novo = endereco_novo(sys.argv[1])
    if antigo == novo:
        print(f"O site já usa {novo}. Nada a trocar.")
        return

    total = 0
    for arq in sorted(RAIZ.glob("*")):
        if arq.suffix.lower() not in EXTENSOES or not arq.is_file():
            continue
        texto = arq.read_bytes().decode("utf-8")
        trocado = texto.replace(f"https://{antigo}", f"https://{novo}")
        n = texto.count(f"https://{antigo}")
        if n:
            arq.write_bytes(trocado.encode("utf-8"))
            print(f"  {arq.name}: {n} troca(s)")
            total += n

    print(f"\nPronto: {total} endereço(s) trocados de {antigo} para {novo}.")
    print("Agora publique de novo (commit e envio ao GitHub) para valer no site.")


if __name__ == "__main__":
    main()
