#!/usr/bin/env python3
"""
Reduz um vídeo (.mov/.mp4) para ficar leve no site: MP4 vertical ou horizontal,
H.264 + AAC, com "faststart" (começa a tocar antes de baixar tudo).

Uso (precisa do pacote "av", o PyAV: pip install av):
  python tools/reduzir-video.py ENTRADA.mov SAIDA.mp4
  python tools/reduzir-video.py ENTRADA.mov SAIDA.mp4 --largura 540 --crf 29

Opções:
  --largura N   largura máxima em pixels do lado menor (padrão 540; o vídeo nunca é ampliado)
  --crf N       qualidade do x264: menor = mais nítido e mais pesado (padrão 29)
  --audio-kbps  taxa do áudio (padrão 64)
  --sem-audio   remove o áudio

Nada é cortado nem filtrado: só muda o tamanho e a compressão.
"""
import argparse
import fractions
import os
import sys

import av


def reduzir(entrada, saida, lado_menor=540, crf=29, preset="medium", audio_kbps=64, com_audio=True):
    ent = av.open(entrada)
    vin = ent.streams.video[0]
    ain = ent.streams.audio[0] if (com_audio and ent.streams.audio) else None

    # tamanho de saída: lado menor limitado a `lado_menor`, sem ampliar, par (exigência do H.264)
    w0, h0 = vin.codec_context.width, vin.codec_context.height
    menor = min(w0, h0)
    esc = min(1.0, lado_menor / float(menor))
    w = max(2, int(round(w0 * esc / 2.0)) * 2)
    h = max(2, int(round(h0 * esc / 2.0)) * 2)

    fps = vin.average_rate or fractions.Fraction(30, 1)
    if float(fps) > 30.5:
        fps = fractions.Fraction(30, 1)
    fps = fractions.Fraction(fps).limit_denominator(1001)

    saida_tmp = saida + ".parcial.mp4"
    out = av.open(saida_tmp, "w", format="mp4", options={"movflags": "+faststart"})
    vout = out.add_stream("libx264", rate=fps)
    vout.width, vout.height = w, h
    vout.pix_fmt = "yuv420p"
    # Relógio do vídeo = 1/fps. Guardamos numa variável própria: depois que o MP4 grava o cabeçalho,
    # `vout.time_base` muda sozinho (ex.: 1/15360) e usar esse valor embaralharia o tempo dos quadros.
    tb = fractions.Fraction(1, 1) / fps
    vout.codec_context.time_base = tb
    vout.time_base = tb
    vout.options = {"crf": str(crf), "preset": preset, "profile": "high"}
    vout.codec_context.gop_size = int(round(float(fps) * 2))

    aout = None
    resamp = None
    if ain is not None:
        taxa = 44100
        aout = out.add_stream("aac", rate=taxa)
        aout.layout = "stereo"
        aout.bit_rate = audio_kbps * 1000
        resamp = av.AudioResampler(format="fltp", layout="stereo", rate=taxa)

    ultimo_pts = -1
    streams = [vin] + ([ain] if ain is not None else [])
    for pacote in ent.demux(*streams):
        if pacote.dts is None and pacote.size == 0:
            pass  # pacote vazio de "descarga" do decodificador
        for quadro in pacote.decode():
            if pacote.stream.type == "video":
                if quadro.pts is None:
                    continue
                segundos = float(quadro.pts * quadro.time_base)
                pts = int(round(segundos * float(fps)))
                if pts <= ultimo_pts:  # quadros repetidos (vídeo de taxa variável): descarta
                    continue
                ultimo_pts = pts
                novo = quadro.reformat(width=w, height=h, format="yuv420p")
                novo.pts = pts
                novo.time_base = tb
                for p in vout.encode(novo):
                    out.mux(p)
            elif aout is not None:
                for q in resamp.resample(quadro):
                    for p in aout.encode(q):
                        out.mux(p)

    for p in vout.encode(None):
        out.mux(p)
    if aout is not None:
        for q in resamp.resample(None):
            for p in aout.encode(q):
                out.mux(p)
        for p in aout.encode(None):
            out.mux(p)
    out.close()
    ent.close()
    os.replace(saida_tmp, saida)
    return w, h, os.path.getsize(saida)


def main():
    ap = argparse.ArgumentParser(description="Reduz um vídeo para o site (H.264 + AAC, faststart).")
    ap.add_argument("entrada")
    ap.add_argument("saida")
    ap.add_argument("--largura", type=int, default=540)
    ap.add_argument("--crf", type=int, default=29)
    ap.add_argument("--preset", default="medium")
    ap.add_argument("--audio-kbps", type=int, default=64)
    ap.add_argument("--sem-audio", action="store_true")
    a = ap.parse_args()
    w, h, b = reduzir(a.entrada, a.saida, a.largura, a.crf, a.preset, a.audio_kbps, not a.sem_audio)
    print("%s -> %dx%d, %.2f MB" % (os.path.basename(a.saida), w, h, b / 1e6))


if __name__ == "__main__":
    sys.exit(main())
