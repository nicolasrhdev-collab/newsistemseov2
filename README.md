# Sistema de Gerenciamento de Produtos - SEO Sistem

Dashboard moderno e profissional para controle de produtos com interface clean e minimalista.

## 🚀 Funcionalidades

### 📦 Tipos de Produtos
- **Produto Simples**: Cadastro rápido com informações básicas
- **Produto Composto**: Sistema completo em 4 etapas com componentes, especificações e embalagem

### ✨ Recursos Principais

#### 🔍 Busca e Filtros
- Pesquisa em tempo real por nome, SKU ou categoria
- Filtros por tipo: Todos, Simples ou Composto
- Toggle rápido entre visualizações

#### 📋 Gestão de Produtos
- Cards visuais com informações essenciais
- Menu dropdown com opções de editar/deletar
- Visualização limpa e organizada

#### 🎨 Categorização Inteligente
- Sistema de categorias com autocompletar
- Criar categorias personalizadas
- Busca em tempo real nas categorias
- Persistência no localStorage

#### 🛠️ Produto Simples
- Nome e SKU
- Categoria Principal
- Peso (kg)
- Valor (R$)

#### 🔧 Produto Composto (4 Etapas)

**Etapa 1: Informações Básicas**
- Nome, SKU e Categoria

**Etapa 2: Componentes**
- Seleção de produtos cadastrados
- Busca inteligente de produtos
- Cálculo automático de peso e valor total
- Adicionar múltiplos componentes

**Etapa 3: Especificações Técnicas**
- Material (com autocompletar)
- Dimensões: Largura, Altura, Profundidade
- Exp Metalon e Exp MDF
- Tipo Metalon (com autocompletar)
- Capacidade
- Montagem (com autocompletar)

**Etapa 4: Embalagem**
- Múltiplas caixas
- Dimensões de cada caixa
- Quantidade de cada tipo

### 💾 Persistência
- Todos os dados salvos no localStorage
- Categorias personalizadas
- Materiais personalizados
- Tipos de metalon personalizados
- Tipos de montagem personalizados

## 🎨 Design

- **Fonte**: Inter (Google Fonts)
- **Framework CSS**: Tailwind CSS via CDN
- **Cores**: Paleta neutra (cinza/preto/branco)
- **Layout**: Sidebar + Grid responsivo
- **Animações**: Transições suaves

## 📁 Estrutura do Projeto

```
seosistem/
├── index.html           # Estrutura HTML
├── css/
│   └── styles.css       # Estilos customizados
├── js/
│   └── script.js        # Lógica da aplicação
├── server.py            # Servidor de desenvolvimento
├── start-server.bat     # Script Windows
├── start-server.sh      # Script Linux/Mac
├── README.md            # Documentação principal
├── SERVER.md            # Documentação do servidor
└── STRUCTURE.md         # Estrutura detalhada do código
```

## 🚀 Como Usar

### Opção 1: Servidor de Desenvolvimento (Recomendado)

1. Clone o repositório:
```bash
git clone https://github.com/nicolasrhdev-collab/newsistemseov2.git
cd newsistemseov2
```

2. Inicie o servidor:

**Windows:**
```bash
start-server.bat
```
Ou simplesmente clique duas vezes no arquivo `start-server.bat`

**Linux/Mac:**
```bash
chmod +x start-server.sh
./start-server.sh
```

3. O navegador abrirá automaticamente em `http://localhost:8000`

📖 **[Documentação completa do servidor →](SERVER.md)**

### Opção 2: Abrir Diretamente

1. Clone o repositório
2. Abra o arquivo `index.html` no seu navegador
3. Comece a adicionar produtos!

## 💡 Recursos Técnicos

- **Dropdowns Inteligentes**: Position fixed com z-index alto para evitar cortes
- **Autocompletar**: Todos os campos principais têm busca em tempo real
- **Validação**: Formulários com validação HTML5
- **Responsivo**: Layout adaptável para diferentes tamanhos de tela
- **UX Moderna**: Hover effects, animações e feedback visual

## 🎯 Produtos de Exemplo

O sistema vem com 3 produtos de exemplo:
1. Mesa de Escritório (Simples)
2. Cadeira Ergonômica (Simples)
3. Kit Home Office Completo (Composto)

## 🔧 Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla)
- Tailwind CSS
- Google Fonts (Inter)

## 📝 Licença

MIT

## 👤 Autor

Nicolas RH - [GitHub](https://github.com/nicolasrhdev-collab)

---

**Desenvolvido com ❤️ para facilitar o gerenciamento de produtos**

