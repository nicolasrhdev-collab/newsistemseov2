# 🚀 Servidor de Desenvolvimento - SEO System

Servidor HTTP simples para testar o sistema localmente.

## 📋 Pré-requisitos

Você precisa de **Python 3.x** OU **Node.js** instalado:

### Opção A: Python 3.x
- Windows: [Download Python](https://www.python.org/downloads/)
- Linux: `sudo apt-get install python3`
- MacOS: `brew install python3`

### Opção B: Node.js
- Qualquer SO: [Download Node.js](https://nodejs.org/)
- Recomendado: Versão LTS

## 🎯 Como Usar

### Com Python

**Windows:**
```bash
start-server.bat
```
Ou clique duas vezes no arquivo `start-server.bat`

**Linux/Mac:**
```bash
chmod +x start-server.sh
./start-server.sh
```

**Manual:**
```bash
# Windows/Linux/Mac
python server.py
# ou
python3 server.py
```

### Com Node.js

**Windows:**
```bash
start-server-node.bat
```
Ou clique duas vezes no arquivo `start-server-node.bat`

**Linux/Mac/Windows:**
```bash
node server.js
```

## 🌐 Acessando o Sistema

Após iniciar o servidor, o sistema estará disponível em:
- **URL Principal:** http://localhost:8000
- **URL Alternativa:** http://127.0.0.1:8000

O navegador deve abrir automaticamente. Se não abrir, copie e cole uma das URLs acima no navegador.

## 🛑 Parando o Servidor

Pressione `Ctrl + C` no terminal para parar o servidor.

## 📝 Notas

- **Porta Padrão:** 8000
- **Modo:** Desenvolvimento (sem cache)
- **Diretório:** Raiz do projeto
- **Auto-reload:** Não (reinicie o servidor após mudanças)

## ⚠️ Importante

Este servidor é **APENAS para desenvolvimento local**. 

**Não use em produção!**

Para produção, considere:
- Netlify (gratuito)
- Vercel (gratuito)
- GitHub Pages (gratuito)
- Nginx + servidor web profissional

## 🔧 Porta em Uso?

Se a porta 8000 estiver em uso, você pode:

1. Parar o processo que está usando a porta
2. Ou editar `server.py` e mudar a variável `PORT` para outro número (ex: 8080, 3000, etc.)

## 📱 Testando em Outros Dispositivos

Para testar em celular/tablet na mesma rede:

1. Descubra seu IP local:
   - Windows: `ipconfig` (procure IPv4)
   - Linux/Mac: `ifconfig` ou `ip addr`

2. Acesse no dispositivo:
   ```
   http://SEU_IP_LOCAL:8000
   ```
   Exemplo: `http://192.168.1.100:8000`

## 🐛 Problemas Comuns

### Python não encontrado
**Solução:** Instale o Python e adicione ao PATH do sistema

### Porta já em uso
**Solução:** Mude a porta em `server.py` ou pare o processo que está usando

### Navegador não abre automaticamente
**Solução:** Abra manualmente: http://localhost:8000

### Alterações não aparecem
**Solução:** Limpe o cache do navegador (Ctrl+Shift+R) ou use modo anônimo

