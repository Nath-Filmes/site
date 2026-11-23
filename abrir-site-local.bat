@echo off
rem Abre o site da Nath Filmes no seu computador (http://localhost:8080).
rem Feche esta janela para parar. Precisa do Python ou do Node instalados.
cd /d "%~dp0"
title Site Nath Filmes (local)
echo.
echo  Abrindo o site em http://localhost:8080
echo  Para parar, feche esta janela.
echo.
start "" "http://localhost:8080/index.html"

where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server 8080
  goto :fim
)
where python >nul 2>nul
if %errorlevel%==0 (
  python -m http.server 8080
  goto :fim
)
where npx >nul 2>nul
if %errorlevel%==0 (
  npx --yes serve -l 8080 .
  goto :fim
)

echo  Nao encontrei Python nem Node neste computador.
echo  Instale o Python em https://www.python.org/downloads/ (marque "Add to PATH")
echo  ou use a extensao "Live Server" do VS Code.
pause
:fim
