# 🚀 Servidor de Desenvolvimento - SEO System

Servidor HTTP simples para testar o sistema localmente.

## 📋 Pré-requisitos

- **Python 3.x** instalado no sistema
  - Windows: [Download Python](https://www.python.org/downloads/)
  - Linux: `sudo apt-get install python3`
  - MacOS: `brew install python3`

## 🎯 Como Usar

### Windows

**Opção 1 - Script Automático (Recomendado):**
```bash
start-server.bat
```
Apenas clique duas vezes no arquivo `start-server.bat`

**Opção 2 - Manual:**
```bash
python server.py
```

### Linux / MacOS

**Opção 1 - Script Automático:**
```bash
chmod +x start-server.sh
./start-server.sh
```

**Opção 2 - Manual:**
```bash
python3 server.py
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

