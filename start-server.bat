@echo off
chcp 65001 >nul
cls
echo ============================================================
echo 🚀 SEO SYSTEM - Iniciando Servidor de Desenvolvimento
echo ============================================================
echo.

REM Verifica se Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python não encontrado!
    echo.
    echo Por favor, instale o Python 3.x de:
    echo https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo ✅ Python encontrado!
echo.
echo Iniciando servidor...
echo.

python server.py

pause

