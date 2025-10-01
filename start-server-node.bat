@echo off
chcp 65001 >nul
cls
echo ============================================================
echo 🚀 SEO SYSTEM - Servidor de Desenvolvimento (Node.js)
echo ============================================================
echo.

REM Verifica se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo.
    echo Por favor, instale o Node.js de:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado!
echo.
echo Iniciando servidor...
echo.

node server.js

pause

