#!/usr/bin/env python3
"""
Servidor HTTP simples para teste do SEO System
Porta padrão: 8000
Uso: python server.py
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Configurações
PORT = 8000
DIRECTORY = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)
    
    def end_headers(self):
        # Adiciona headers para evitar cache durante desenvolvimento
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    print("=" * 60)
    print("🚀 SEO SYSTEM - Servidor de Desenvolvimento")
    print("=" * 60)
    print(f"\n📁 Diretório: {DIRECTORY}")
    print(f"🌐 Servidor rodando em: http://localhost:{PORT}")
    print(f"🔗 URL alternativa: http://127.0.0.1:{PORT}")
    print("\n⌨️  Pressione Ctrl+C para parar o servidor")
    print("=" * 60)
    
    # Tenta abrir o navegador automaticamente
    try:
        webbrowser.open(f'http://localhost:{PORT}')
        print("\n✅ Navegador aberto automaticamente!")
    except:
        print("\n⚠️  Abra o navegador manualmente em: http://localhost:{PORT}")
    
    # Inicia o servidor
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Servidor encerrado pelo usuário")
            print("=" * 60)

if __name__ == "__main__":
    main()

