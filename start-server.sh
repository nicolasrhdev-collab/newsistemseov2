#!/bin/bash

# Script para iniciar servidor de desenvolvimento (Linux/Mac)

clear
echo "============================================================"
echo "🚀 SEO SYSTEM - Iniciando Servidor de Desenvolvimento"
echo "============================================================"
echo ""

# Verifica se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado!"
    echo ""
    echo "Por favor, instale o Python 3:"
    echo "  Ubuntu/Debian: sudo apt-get install python3"
    echo "  MacOS: brew install python3"
    echo ""
    exit 1
fi

echo "✅ Python encontrado!"
echo ""
echo "Iniciando servidor..."
echo ""

python3 server.py

