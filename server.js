#!/usr/bin/env node
/**
 * Servidor HTTP simples para teste do SEO System (Node.js)
 * Porta padrão: 8000
 * Uso: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8000;
const HOST = 'localhost';

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
    console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
    
    // Parse URL
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }
    
    // Get file extension
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Read and serve file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Arquivo não encontrado</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Erro no servidor: ${error.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Expires': '0'
            });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log('='.repeat(60));
    console.log('🚀 SEO SYSTEM - Servidor de Desenvolvimento (Node.js)');
    console.log('='.repeat(60));
    console.log(`\n📁 Diretório: ${__dirname}`);
    console.log(`🌐 Servidor rodando em: http://${HOST}:${PORT}`);
    console.log(`🔗 URL alternativa: http://127.0.0.1:${PORT}`);
    console.log('\n⌨️  Pressione Ctrl+C para parar o servidor');
    console.log('='.repeat(60));
    console.log('');
    
    // Tenta abrir o navegador automaticamente
    const url = `http://${HOST}:${PORT}`;
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    
    exec(`${start} ${url}`, (err) => {
        if (!err) {
            console.log('✅ Navegador aberto automaticamente!');
        } else {
            console.log(`⚠️  Abra o navegador manualmente em: ${url}`);
        }
    });
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Erro: Porta ${PORT} já está em uso!`);
        console.error(`\nSoluções:`);
        console.error(`  1. Pare o processo que está usando a porta`);
        console.error(`  2. Ou edite server.js e mude a variável PORT\n`);
    } else {
        console.error(`\n❌ Erro no servidor:`, err);
    }
    process.exit(1);
});

