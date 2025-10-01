# 📁 Estrutura do Projeto - SEO System

## 📂 Organização de Arquivos

```
seosistem/
├── index.html           # Página principal com toda a estrutura HTML
├── README.md            # Documentação do projeto
├── STRUCTURE.md         # Este arquivo - documentação da estrutura
├── .gitignore          # Arquivos ignorados pelo Git
│
├── css/
│   └── styles.css      # Todos os estilos CSS do projeto
│
└── js/
    └── script.js       # Todo o JavaScript do projeto
```

## 🎯 Descrição dos Arquivos

### `index.html` (910 linhas)
Estrutura completa da aplicação incluindo:
- **Sidebar**: Menu de navegação (Produtos, SEO)
- **Header**: Título da página, botão de ação e menu de exportação
- **Páginas**:
  - Produtos (listagem em cards)
  - SEO (listagem e formulário)
- **Modais**:
  - Produto Simples
  - Produto Composto (multi-etapas)
  - Seleção de Produto para SEO

### `css/styles.css` (655 linhas)
Estilos organizados por seções:
- **Reset e Base**: Estilos globais
- **Layout**: Sidebar, header, main content
- **Components**: Cards, botões, forms, modals
- **Custom Dropdowns**: Dropdowns personalizados
- **Product Cards**: Cards de produtos
- **Modals**: Estilos de modais
- **SEO Form**: Formulário de SEO
- **Responsive**: Media queries

### `js/script.js` (2451 linhas)
JavaScript organizado por funcionalidades:

#### 📦 **Data Storage** (linhas 1-90)
- Inicialização de dados (produtos, categorias, materiais, etc.)
- Funções de salvamento no localStorage

#### 🎨 **Product Management** (linhas 91-810)
- Renderização de lista de produtos
- Filtros e busca
- Menus de ação (editar/deletar)
- Modais de produtos simples e compostos
- Gerenciamento de componentes e especificações
- Embalagens

#### 🔍 **SEO Management** (linhas 1155-2270)
- Listagem de SEO
- Seleção de produto
- Formulário multi-etapas:
  - Etapa 1: Dados Gerais (palavras-chave, público, meta tags)
  - Etapa 2: Schema.org
  - Etapa 3: Conteúdo (H1, H2, benefícios, usos, FAQs)
- Preview do Google
- Preview do Schema JSON

#### 🎛️ **Custom Dropdowns** (linhas 811-1154)
- Dropdown de categorias (com busca e criação)
- Dropdown de materiais
- Dropdown de tipos de metalon
- Dropdown de montagem
- Dropdown genérico reutilizável
- Dropdown de schema types

#### 📤 **Export to CSV** (linhas 2358-2451)
- Menu de exportação
- Exportação de produtos
- Exportação de SEO
- Download de arquivos CSV

#### 🔧 **Utilities** (distribuídas)
- Navegação entre páginas
- Event listeners globais
- Funções auxiliares

## 🎨 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **JavaScript (Vanilla)**: Lógica e interatividade
- **LocalStorage**: Persistência de dados no cliente
- **Google Fonts**: Fonte Inter

## 🔄 Fluxo de Dados

```
LocalStorage ←→ JavaScript (script.js) ←→ DOM (index.html)
                      ↓
                 CSS Styles (styles.css)
```

## 📊 Principais Funcionalidades

### Produtos
- ✅ Criar/Editar/Deletar produtos
- ✅ Produtos Simples vs Compostos
- ✅ Busca e filtros
- ✅ Especificações técnicas completas
- ✅ Gerenciamento de componentes
- ✅ Embalagens múltiplas
- ✅ Exportar para CSV

### SEO
- ✅ Criar SEO para produtos
- ✅ Palavras-chave (principal, secundárias, cauda longa)
- ✅ Segmentação de público
- ✅ Meta Tags (Title, Description, Slug)
- ✅ Preview do Google em tempo real
- ✅ Schema.org com preview JSON
- ✅ Conteúdo estruturado (H1, H2, benefícios, usos, FAQs)
- ✅ Exportar para CSV

### UX/UI
- ✅ Design minimalista e profissional
- ✅ Dropdowns customizados com busca
- ✅ Navegação multi-etapas
- ✅ Validações em tempo real
- ✅ Previews dinâmicos
- ✅ Responsivo

## 🚀 Como Usar

1. Abra o `index.html` em um navegador moderno
2. Todos os dados são salvos localmente no navegador
3. Não requer servidor ou backend

## 🔮 Possíveis Melhorias Futuras

- [ ] Modularizar JavaScript em arquivos separados
- [ ] Adicionar TypeScript para type safety
- [ ] Implementar build process (Webpack/Vite)
- [ ] Backend para persistência em banco de dados
- [ ] Autenticação de usuários
- [ ] Importação de CSV
- [ ] Geração de relatórios
- [ ] Backup/Restore de dados

