// ===== USEFUL LINKS =====
let usefulLinks = JSON.parse(localStorage.getItem('usefulLinks')) || [];
const linkCategories = ['Pronto', 'Inspiração', 'Padrões'];

// Initialize products with examples
let products = JSON.parse(localStorage.getItem('products')) || [
    {
        id: 1,
        type: 'simples',
        name: 'Mesa de Escritório',
        sku: 'MESA-001',
        category: 'Móveis',
        weight: 15.5,
        price: 450.00
    },
    {
        id: 2,
        type: 'simples',
        name: 'Cadeira Ergonômica',
        sku: 'CAD-002',
        category: 'Móveis',
        weight: 12.0,
        price: 650.00
    },
    {
        id: 3,
        type: 'composto',
        name: 'Kit Home Office Completo',
        sku: 'KIT-003',
        category: 'Kits',
        weight: 27.5,
        price: 1100.00,
        components: [
            { productId: 1, quantity: 1 },
            { productId: 2, quantity: 1 }
        ],
        specs: {
            brand: 'Office Pro',
            material: 'MDF e Aço',
            width: '120',
            height: '75',
            depth: '60',
            expMetalon: '20x20mm',
            expMdf: '15mm',
            tipoMetalon: 'Pintado',
            capacity: '50kg',
            assembly: 'Montagem simples com chave allen inclusa'
        },
        packages: [
            { width: 130, height: 80, depth: 15, quantity: 1 },
            { width: 70, height: 70, depth: 40, quantity: 1 }
        ]
    }
];

// Save initial products to localStorage if not exists
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Initialize categories
let categories = JSON.parse(localStorage.getItem('categories')) || ['Móveis', 'Kits', 'Acessórios', 'Ferramentas'];
if (!localStorage.getItem('categories')) {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Initialize materials
let materials = JSON.parse(localStorage.getItem('materials')) || ['MDF', 'Aço', 'Madeira', 'Plástico', 'Vidro', 'Metal'];
if (!localStorage.getItem('materials')) {
    localStorage.setItem('materials', JSON.stringify(materials));
}

// Initialize metalon types
let metalonTypes = JSON.parse(localStorage.getItem('metalonTypes')) || ['20x20mm', '25x25mm', '30x30mm', '40x40mm', 'Retangular 20x40mm', 'Pintado', 'Galvanizado'];
if (!localStorage.getItem('metalonTypes')) {
    localStorage.setItem('metalonTypes', JSON.stringify(metalonTypes));
}

// Initialize assembly types
let assemblyTypes = JSON.parse(localStorage.getItem('assemblyTypes')) || ['Tradicional', 'Manual', 'Não precisa'];
if (!localStorage.getItem('assemblyTypes')) {
    localStorage.setItem('assemblyTypes', JSON.stringify(assemblyTypes));
}

let componentCounter = 0;
let packageCounter = 0;
let currentEditId = null;
let currentView = 'todos'; // todos, simples, composto
let currentPage = 'produtos'; // produtos, seo
let currentSeoStep = 1;
let secondaryKeywords = [];
let longTailKeywords = [];
let seoData = JSON.parse(localStorage.getItem('seoData')) || [];

// Render products
function renderProducts(filteredProducts = null) {
    const grid = document.getElementById('productsGrid');
    const emptyState = document.getElementById('emptyState');
    const noResults = document.getElementById('noResults');
    const productsToRender = filteredProducts || products;
    
    // Hide both states initially
    emptyState.classList.add('hidden');
    noResults.classList.add('hidden');
    
    if (products.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
    } else if (productsToRender.length === 0) {
        grid.innerHTML = '';
        noResults.classList.remove('hidden');
    } else {
        grid.innerHTML = productsToRender.map(product => `
            <div class="product-card bg-white border border-neutral-200 rounded-lg p-5 hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer" onclick="editProduct(${product.id})" data-type="${product.type}">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h3 class="text-base font-semibold text-neutral-900 mb-1.5">${product.name}</h3>
                        <p class="text-xs text-neutral-500">${product.sku}</p>
                    </div>
                    <div class="relative ml-2">
                        <button onclick="event.stopPropagation(); toggleProductMenu(${product.id})" class="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                            </svg>
                        </button>
                        <div id="menu-${product.id}" class="product-menu hidden absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-neutral-200 z-20">
                            <button onclick="event.stopPropagation(); editProduct(${product.id}); closeAllMenus();" class="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 rounded-t-lg transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                                Editar
                            </button>
                            <button onclick="event.stopPropagation(); deleteProduct(${product.id}); closeAllMenus();" class="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg transition-colors border-t border-neutral-100">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Deletar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Toggle product menu (three dots)
function toggleProductMenu(productId) {
    const menu = document.getElementById(`menu-${productId}`);
    const isHidden = menu.classList.contains('hidden');
    
    // Close all menus first
    closeAllMenus();
    
    // Open this menu if it was closed
    if (isHidden) {
        menu.classList.remove('hidden');
    }
}

// Close all product menus
function closeAllMenus() {
    document.querySelectorAll('.product-menu').forEach(menu => {
        menu.classList.add('hidden');
    });
}

// Toggle filter menu
function toggleFilterMenu() {
    const menu = document.getElementById('filterMenu');
    menu.classList.toggle('hidden');
}

// Close filter menu and product menus when clicking outside
document.addEventListener('click', function(e) {
    const filterMenu = document.getElementById('filterMenu');
    const filterBtn = event.target.closest('button');
    
    // Close filter menu
    if (filterMenu && !filterMenu.contains(e.target) && (!filterBtn || filterBtn.textContent.trim() !== 'Filtrar')) {
        filterMenu.classList.add('hidden');
    }
    
    // Close product menus if clicking outside any menu
    if (!e.target.closest('.product-menu') && !e.target.closest('button')) {
        closeAllMenus();
    }
});

// Switch view between todos, simples, composto
function switchView(view) {
    currentView = view;
    
    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`btn${view.charAt(0).toUpperCase() + view.slice(1)}`).classList.add('active');
    
    // Apply filters
    filterProducts();
}

// Filter products
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const checkboxes = document.querySelectorAll('.filter-checkbox');
    const selectedTypes = [];
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedTypes.push(checkbox.value);
        }
    });
    
    let filtered = products;
    
    // Apply view filter first
    if (currentView !== 'todos') {
        filtered = filtered.filter(product => product.type === currentView);
    }
    
    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply checkbox type filter (only if view is 'todos')
    if (currentView === 'todos' && !selectedTypes.includes('todos')) {
        filtered = filtered.filter(product => 
            selectedTypes.includes(product.type)
        );
    }
    
    renderProducts(filtered);
}

// Open type selection modal
function openTypeModal() {
    const modal = document.getElementById('typeModal');
    modal.classList.add('active');
}

// Close type selection modal
function closeTypeModal() {
    const modal = document.getElementById('typeModal');
    modal.classList.remove('active');
}

// ============= PRODUTO SIMPLES =============

function openProductModal(type, productId = null) {
    closeTypeModal();
    
    if (type === 'simples') {
        openSimpleProductModal(productId);
    } else {
        openCompositeProductModal(productId);
    }
}

function openSimpleProductModal(productId = null) {
    const modal = document.getElementById('simpleProductModal');
    const form = document.getElementById('simpleProductForm');
    
    if (productId) {
        const product = products.find(p => p.id === productId);
        currentEditId = productId;
        document.getElementById('simpleProductId').value = product.id;
        document.getElementById('simpleName').value = product.name;
        document.getElementById('simpleSku').value = product.sku;
        document.getElementById('simpleCategory').value = product.category;
        document.getElementById('simpleWeight').value = product.weight;
        document.getElementById('simplePrice').value = product.price;
    } else {
        currentEditId = null;
        form.reset();
    }
    
    modal.classList.add('active');
}

function closeSimpleProductModal() {
    const modal = document.getElementById('simpleProductModal');
    modal.classList.remove('active');
    document.getElementById('simpleProductForm').reset();
    currentEditId = null;
}

document.getElementById('simpleProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const productData = {
        type: 'simples',
        name: document.getElementById('simpleName').value,
        sku: document.getElementById('simpleSku').value,
        category: document.getElementById('simpleCategory').value,
        weight: parseFloat(document.getElementById('simpleWeight').value),
        price: parseFloat(document.getElementById('simplePrice').value)
    };
    
    if (currentEditId) {
        const index = products.findIndex(p => p.id === currentEditId);
        products[index] = { ...productData, id: currentEditId };
    } else {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ ...productData, id: newId });
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
    closeSimpleProductModal();
});

// ============= PRODUTO COMPOSTO =============

function openCompositeProductModal(productId = null) {
    const modal = document.getElementById('compositeProductModal');
    
    // Reset form
    document.getElementById('compositeProductForm').reset();
    document.getElementById('currentStep').value = '1';
    goToStep(1);
    
    // Clear containers
    componentCounter = 0;
    packageCounter = 0;
    document.getElementById('componentsContainer').innerHTML = '';
    document.getElementById('packagesContainer').innerHTML = '';
    
    if (productId) {
        const product = products.find(p => p.id === productId);
        currentEditId = productId;
        loadCompositeProduct(product);
    } else {
        currentEditId = null;
    }
    
    modal.classList.add('active');
}

function loadCompositeProduct(product) {
    document.getElementById('compositeProductId').value = product.id;
    document.getElementById('compositeName').value = product.name;
    document.getElementById('compositeSku').value = product.sku;
    document.getElementById('compositeCategory').value = product.category;
    
    // Load components
    if (product.components && product.components.length > 0) {
        product.components.forEach(comp => addComponent(comp));
    }
    
    // Load specs
    if (product.specs) {
        document.getElementById('specBrand').value = product.specs.brand || '';
        document.getElementById('specMaterial').value = product.specs.material || '';
        document.getElementById('specWidth').value = product.specs.width || '';
        document.getElementById('specHeight').value = product.specs.height || '';
        document.getElementById('specDepth').value = product.specs.depth || '';
        document.getElementById('specExpMetalon').value = product.specs.expMetalon || '';
        document.getElementById('specExpMdf').value = product.specs.expMdf || '';
        document.getElementById('specTipoMetalon').value = product.specs.tipoMetalon || '';
        document.getElementById('specCapacity').value = product.specs.capacity || '';
        document.getElementById('specAssembly').value = product.specs.assembly || '';
    }
    
    // Load packages
    if (product.packages && product.packages.length > 0) {
        product.packages.forEach(pkg => addPackage(pkg));
    }
}

function closeCompositeProductModal() {
    const modal = document.getElementById('compositeProductModal');
    modal.classList.remove('active');
    document.getElementById('compositeProductForm').reset();
    currentEditId = null;
}

// Step Navigation
function nextStep() {
    const currentStep = parseInt(document.getElementById('currentStep').value);
    if (currentStep < 4) {
        goToStep(currentStep + 1);
    }
}

function previousStep() {
    const currentStep = parseInt(document.getElementById('currentStep').value);
    if (currentStep > 1) {
        goToStep(currentStep - 1);
    }
}

function goToStep(stepNumber) {
    // Update current step value
    document.getElementById('currentStep').value = stepNumber;
    
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    document.getElementById('step' + stepNumber).classList.add('active');
    
    // Update step indicators
    document.querySelectorAll('.step-indicator').forEach(indicator => {
        const step = parseInt(indicator.getAttribute('data-step'));
        indicator.classList.remove('active', 'completed');
        if (step === stepNumber) {
            indicator.classList.add('active');
        } else if (step < stepNumber) {
            indicator.classList.add('completed');
        }
    });
    
    // Update buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (stepNumber === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }
    
    if (stepNumber === 4) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

// Add Component
function addComponent(data = null) {
    const container = document.getElementById('componentsContainer');
    const id = componentCounter++;
    
    // Get list of simple products for select
    const simpleProducts = products.filter(p => p.type === 'simples');
    
    const componentDiv = document.createElement('div');
    componentDiv.className = 'component-card';
    componentDiv.id = `component-${id}`;
    componentDiv.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="flex-1 relative">
                <input 
                    type="text" 
                    id="componentSearch-${id}"
                    class="form-input text-sm pr-8 component-search-input" 
                    placeholder="Buscar produto..."
                    autocomplete="off"
                    value="${data ? getProductName(data.productId) : ''}"
                    onfocus="showComponentDropdown(${id})"
                    oninput="filterComponentProducts(${id})"
                    required>
                <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input type="hidden" class="component-product" value="${data ? data.productId : ''}" required>
                <div id="componentDropdown-${id}" class="category-dropdown hidden bg-white border border-neutral-200 rounded-lg shadow-lg overflow-y-auto">
                    <div id="componentList-${id}" class="py-1">
                        <!-- Products will be inserted here -->
                    </div>
                </div>
            </div>
            <div class="w-24">
                <input type="number" 
                       placeholder="Qtd" 
                       class="form-input text-sm component-quantity w-full" 
                       value="${data ? data.quantity : 1}"
                       min="1"
                       onchange="calculateTotals()"
                       required>
            </div>
            <button type="button" 
                    onclick="removeComponent(${id})" 
                    class="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
    `;
    
    container.appendChild(componentDiv);
    calculateTotals();
}

// Get product name by ID
function getProductName(productId) {
    const product = products.find(p => p.id === productId);
    return product ? `${product.name} (${product.sku})` : '';
}

// Show component dropdown
function showComponentDropdown(componentId) {
    const dropdown = document.getElementById(`componentDropdown-${componentId}`);
    const input = document.getElementById(`componentSearch-${componentId}`);
    
    // Get input position
    const rect = input.getBoundingClientRect();
    
    // Position dropdown using fixed positioning
    dropdown.style.position = 'fixed';
    dropdown.style.top = `${rect.bottom + 4}px`;
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.width = `${rect.width}px`;
    
    dropdown.classList.remove('hidden');
    renderComponentList(componentId);
}

// Render component product list
function renderComponentList(componentId, filter = '') {
    const listContainer = document.getElementById(`componentList-${componentId}`);
    const simpleProducts = products.filter(p => p.type === 'simples');
    const filteredProducts = simpleProducts.filter(p => 
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        p.sku.toLowerCase().includes(filter.toLowerCase())
    );
    
    if (filteredProducts.length === 0) {
        listContainer.innerHTML = '<div class="px-3 py-2 text-sm text-neutral-500">Nenhum produto encontrado</div>';
    } else {
        listContainer.innerHTML = filteredProducts.map(product => `
            <button type="button" onclick="selectComponentProduct(${componentId}, ${product.id}, '${product.name}', '${product.sku}')" class="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                <div class="font-medium">${product.name}</div>
                <div class="text-xs text-neutral-500">${product.sku}</div>
            </button>
        `).join('');
    }
}

// Filter component products
function filterComponentProducts(componentId) {
    const input = document.getElementById(`componentSearch-${componentId}`);
    renderComponentList(componentId, input.value);
}

// Select component product
function selectComponentProduct(componentId, productId, productName, productSku) {
    const searchInput = document.getElementById(`componentSearch-${componentId}`);
    const hiddenInput = document.getElementById(`component-${componentId}`).querySelector('.component-product');
    
    searchInput.value = `${productName} (${productSku})`;
    hiddenInput.value = productId;
    
    // Close dropdown
    document.getElementById(`componentDropdown-${componentId}`).classList.add('hidden');
    
    calculateTotals();
}

// Close component dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.component-card')) {
        document.querySelectorAll('[id^="componentDropdown-"]').forEach(dropdown => {
            dropdown.classList.add('hidden');
        });
    }
});

function removeComponent(id) {
    const component = document.getElementById(`component-${id}`);
    if (component) {
        component.remove();
        calculateTotals();
    }
}

function calculateTotals() {
    let totalWeight = 0;
    let totalPrice = 0;
    
    const componentCards = document.querySelectorAll('.component-card');
    componentCards.forEach(card => {
        const hiddenInput = card.querySelector('.component-product');
        const productId = hiddenInput ? parseInt(hiddenInput.value) : null;
        const quantityInput = card.querySelector('.component-quantity');
        const quantity = quantityInput ? parseInt(quantityInput.value) || 0 : 0;
        
        if (productId) {
            const product = products.find(p => p.id === productId);
            if (product) {
                totalWeight += product.weight * quantity;
                totalPrice += product.price * quantity;
            }
        }
    });
    
    document.getElementById('totalWeight').textContent = totalWeight.toFixed(2) + ' kg';
    document.getElementById('totalPrice').textContent = 'R$ ' + totalPrice.toFixed(2);
}

function getComponents() {
    const components = [];
    const componentCards = document.querySelectorAll('.component-card');
    
    componentCards.forEach(card => {
        const hiddenInput = card.querySelector('.component-product');
        const productId = hiddenInput ? parseInt(hiddenInput.value) : null;
        const quantityInput = card.querySelector('.component-quantity');
        const quantity = quantityInput ? parseInt(quantityInput.value) : null;
        
        if (productId && quantity) {
            components.push({ productId, quantity });
        }
    });
    
    return components;
}

// Add Package
function addPackage(data = null) {
    const container = document.getElementById('packagesContainer');
    const id = packageCounter++;
    
    const packageDiv = document.createElement('div');
    packageDiv.className = 'package-item mb-3';
    packageDiv.id = `package-${id}`;
    packageDiv.innerHTML = `
        <div class="flex items-center gap-3">
            <div class="flex-1">
                <input type="number" 
                       placeholder="Largura (cm)" 
                       class="form-input text-sm package-width" 
                       value="${data ? data.width : ''}"
                       step="0.01"
                       required>
            </div>
            <div class="flex-1">
                <input type="number" 
                       placeholder="Altura (cm)" 
                       class="form-input text-sm package-height" 
                       value="${data ? data.height : ''}"
                       step="0.01"
                       required>
            </div>
            <div class="flex-1">
                <input type="number" 
                       placeholder="Profund. (cm)" 
                       class="form-input text-sm package-depth" 
                       value="${data ? data.depth : ''}"
                       step="0.01"
                       required>
            </div>
            <div class="w-20">
                <input type="number" 
                       placeholder="Qtd" 
                       class="form-input text-sm package-quantity w-full" 
                       value="${data ? data.quantity : 1}"
                       min="1"
                       required>
            </div>
            <button type="button" 
                    onclick="removePackage(${id})" 
                    class="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
    `;
    
    container.appendChild(packageDiv);
}

function removePackage(id) {
    const pkg = document.getElementById(`package-${id}`);
    if (pkg) {
        pkg.remove();
    }
}

function getPackages() {
    const packages = [];
    const packageItems = document.querySelectorAll('#packagesContainer .package-item');
    
    packageItems.forEach(item => {
        const width = parseFloat(item.querySelector('.package-width').value);
        const height = parseFloat(item.querySelector('.package-height').value);
        const depth = parseFloat(item.querySelector('.package-depth').value);
        const quantity = parseInt(item.querySelector('.package-quantity').value);
        
        if (width && height && depth && quantity) {
            packages.push({ width, height, depth, quantity });
        }
    });
    
    return packages;
}

// Save Composite Product
document.getElementById('compositeProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const components = getComponents();
    
    // Calculate totals
    let totalWeight = 0;
    let totalPrice = 0;
    components.forEach(comp => {
        const product = products.find(p => p.id === comp.productId);
        if (product) {
            totalWeight += product.weight * comp.quantity;
            totalPrice += product.price * comp.quantity;
        }
    });
    
    const productData = {
        type: 'composto',
        name: document.getElementById('compositeName').value,
        sku: document.getElementById('compositeSku').value,
        category: document.getElementById('compositeCategory').value,
        weight: totalWeight,
        price: totalPrice,
        components: components,
        specs: {
            brand: document.getElementById('specBrand').value,
            material: document.getElementById('specMaterial').value,
            width: document.getElementById('specWidth').value,
            height: document.getElementById('specHeight').value,
            depth: document.getElementById('specDepth').value,
            expMetalon: document.getElementById('specExpMetalon').value,
            expMdf: document.getElementById('specExpMdf').value,
            tipoMetalon: document.getElementById('specTipoMetalon').value,
            capacity: document.getElementById('specCapacity').value,
            assembly: document.getElementById('specAssembly').value
        },
        packages: getPackages()
    };
    
    if (currentEditId) {
        const index = products.findIndex(p => p.id === currentEditId);
        products[index] = { ...productData, id: currentEditId };
    } else {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ ...productData, id: newId });
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
    closeCompositeProductModal();
});

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        openProductModal(product.type, id);
    }
}

// Delete product
function deleteProduct(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
    }
}

// Close modals on outside click
document.getElementById('typeModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeTypeModal();
    }
});

document.getElementById('simpleProductModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeSimpleProductModal();
    }
});

document.getElementById('compositeProductModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeCompositeProductModal();
    }
});

// Close modals on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeTypeModal();
        closeSimpleProductModal();
        closeCompositeProductModal();
        closeCategoryDropdowns();
        closeSpecDropdowns();
    }
});

// ============= CATEGORY MANAGEMENT =============

// Show category dropdown
function showCategoryDropdown(type) {
    const dropdown = document.getElementById(`${type}CategoryDropdown`);
    const input = document.getElementById(`${type}Category`);
    
    // Get input position
    const rect = input.getBoundingClientRect();
    
    // Position dropdown using fixed positioning
    dropdown.style.position = 'fixed';
    dropdown.style.top = `${rect.bottom + 4}px`;
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.width = `${rect.width}px`;
    
    dropdown.classList.remove('hidden');
    renderCategoryList(type);
}

// Close all category dropdowns
function closeCategoryDropdowns() {
    document.querySelectorAll('.category-dropdown').forEach(dropdown => {
        dropdown.classList.add('hidden');
    });
}

// Render category list
function renderCategoryList(type, filter = '') {
    const listContainer = document.getElementById(`${type}CategoryList`);
    const filteredCategories = categories.filter(cat => 
        cat.toLowerCase().includes(filter.toLowerCase())
    );
    
    if (filteredCategories.length === 0) {
        listContainer.innerHTML = '<div class="px-3 py-2 text-sm text-neutral-500">Nenhuma categoria encontrada</div>';
    } else {
        listContainer.innerHTML = filteredCategories.map(category => `
            <button type="button" onclick="selectCategory('${type}', '${category}')" class="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                ${category}
            </button>
        `).join('');
    }
}

// Filter categories
function filterCategories(type) {
    const input = document.getElementById(`${type}Category`);
    renderCategoryList(type, input.value);
}

// Select category
function selectCategory(type, category) {
    const input = document.getElementById(`${type}Category`);
    input.value = category;
    closeCategoryDropdowns();
}

// Create new category
function createNewCategory(type) {
    const input = document.getElementById(`${type}Category`);
    const newCategory = prompt('Digite o nome da nova categoria:');
    
    if (newCategory && newCategory.trim()) {
        const trimmedCategory = newCategory.trim();
        
        // Check if category already exists
        if (categories.includes(trimmedCategory)) {
            alert('Esta categoria já existe!');
            return;
        }
        
        // Add new category
        categories.push(trimmedCategory);
        categories.sort(); // Sort alphabetically
        localStorage.setItem('categories', JSON.stringify(categories));
        
        // Select the new category
        input.value = trimmedCategory;
        closeCategoryDropdowns();
    }
}

// Show spec dropdown (material, metalon, assembly)
function showSpecDropdown(type) {
    const dropdown = document.getElementById(`${type}Dropdown`);
    let input;
    
    if (type === 'material') {
        input = document.getElementById('specMaterial');
    } else if (type === 'metalon') {
        input = document.getElementById('specTipoMetalon');
    } else if (type === 'assembly') {
        input = document.getElementById('specAssembly');
    }
    
    // Get input position
    const rect = input.getBoundingClientRect();
    
    // Position dropdown using fixed positioning
    dropdown.style.position = 'fixed';
    dropdown.style.top = `${rect.bottom + 4}px`;
    dropdown.style.left = `${rect.left}px`;
    dropdown.style.width = `${rect.width}px`;
    
    dropdown.classList.remove('hidden');
    renderSpecList(type);
}

// Render spec list
function renderSpecList(type, filter = '') {
    const listContainer = document.getElementById(`${type}List`);
    let options;
    
    if (type === 'material') {
        options = materials;
    } else if (type === 'metalon') {
        options = metalonTypes;
    } else if (type === 'assembly') {
        options = assemblyTypes;
    }
    
    const filteredOptions = options.filter(opt => 
        opt.toLowerCase().includes(filter.toLowerCase())
    );
    
    if (filteredOptions.length === 0) {
        listContainer.innerHTML = '<div class="px-3 py-2 text-sm text-neutral-500">Nenhuma opção encontrada</div>';
    } else {
        listContainer.innerHTML = filteredOptions.map(option => `
            <button type="button" onclick="selectSpecOption('${type}', '${option}')" class="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                ${option}
            </button>
        `).join('');
    }
}

// Filter spec options
function filterSpecOptions(type) {
    let input;
    
    if (type === 'material') {
        input = document.getElementById('specMaterial');
    } else if (type === 'metalon') {
        input = document.getElementById('specTipoMetalon');
    } else if (type === 'assembly') {
        input = document.getElementById('specAssembly');
    }
    
    renderSpecList(type, input.value);
}

// Select spec option
function selectSpecOption(type, value) {
    let input;
    
    if (type === 'material') {
        input = document.getElementById('specMaterial');
    } else if (type === 'metalon') {
        input = document.getElementById('specTipoMetalon');
    } else if (type === 'assembly') {
        input = document.getElementById('specAssembly');
    }
    
    input.value = value;
    document.getElementById(`${type}Dropdown`).classList.add('hidden');
}

// Create new spec option
function createNewSpecOption(type) {
    let input, optionsList, storageKey, promptText;
    
    if (type === 'material') {
        input = document.getElementById('specMaterial');
        optionsList = materials;
        storageKey = 'materials';
        promptText = 'material';
    } else if (type === 'metalon') {
        input = document.getElementById('specTipoMetalon');
        optionsList = metalonTypes;
        storageKey = 'metalonTypes';
        promptText = 'tipo de metalon';
    } else if (type === 'assembly') {
        input = document.getElementById('specAssembly');
        optionsList = assemblyTypes;
        storageKey = 'assemblyTypes';
        promptText = 'tipo de montagem';
    }
    
    const newOption = prompt(`Digite o novo ${promptText}:`);
    
    if (newOption && newOption.trim()) {
        const trimmedOption = newOption.trim();
        
        // Check if option already exists
        if (optionsList.includes(trimmedOption)) {
            alert('Esta opção já existe!');
            return;
        }
        
        // Add new option
        optionsList.push(trimmedOption);
        optionsList.sort();
        localStorage.setItem(storageKey, JSON.stringify(optionsList));
        
        // Update global variable
        if (type === 'material') {
            materials = optionsList;
        } else if (type === 'metalon') {
            metalonTypes = optionsList;
        } else if (type === 'assembly') {
            assemblyTypes = optionsList;
        }
        
        // Select the new option
        input.value = trimmedOption;
        document.getElementById(`${type}Dropdown`).classList.add('hidden');
    }
}

// Close all spec dropdowns
function closeSpecDropdowns() {
    document.getElementById('materialDropdown')?.classList.add('hidden');
    document.getElementById('metalonDropdown')?.classList.add('hidden');
    document.getElementById('assemblyDropdown')?.classList.add('hidden');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    // Check if click is outside category dropdown
    const isInsideDropdown = e.target.closest('.category-dropdown');
    const isInputClick = e.target.id === 'simpleCategory' || e.target.id === 'compositeCategory' || 
                         e.target.id === 'specMaterial' || e.target.id === 'specTipoMetalon' || 
                         e.target.id === 'specAssembly';
    
    if (!isInsideDropdown && !isInputClick) {
        closeCategoryDropdowns();
        closeSpecDropdowns();
    }
});

// Reposition dropdowns on scroll
window.addEventListener('scroll', function() {
    const simpleDropdown = document.getElementById('simpleCategoryDropdown');
    const compositeDropdown = document.getElementById('compositeCategoryDropdown');
    
    if (!simpleDropdown.classList.contains('hidden')) {
        const input = document.getElementById('simpleCategory');
        const rect = input.getBoundingClientRect();
        simpleDropdown.style.top = `${rect.bottom + 4}px`;
        simpleDropdown.style.left = `${rect.left}px`;
        simpleDropdown.style.width = `${rect.width}px`;
    }
    
    if (!compositeDropdown.classList.contains('hidden')) {
        const input = document.getElementById('compositeCategory');
        const rect = input.getBoundingClientRect();
        compositeDropdown.style.top = `${rect.bottom + 4}px`;
        compositeDropdown.style.left = `${rect.left}px`;
        compositeDropdown.style.width = `${rect.width}px`;
    }
}, true);

// ============= PAGE NAVIGATION =============

function switchPage(page) {
    currentPage = page;
    
    // Update menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('bg-neutral-900', 'text-white');
        item.classList.add('text-neutral-700', 'hover:bg-neutral-100');
    });
    
    // Hide all pages
    document.getElementById('productsPage').classList.add('hidden');
    document.getElementById('seoPage').classList.add('hidden');
    document.getElementById('seoFormPage').classList.add('hidden');
    document.getElementById('utilitiesPage').classList.add('hidden');
    
    if (page === 'produtos') {
        document.getElementById('menuProdutos').classList.add('bg-neutral-900', 'text-white');
        document.getElementById('menuProdutos').classList.remove('text-neutral-700', 'hover:bg-neutral-100');
        document.getElementById('pageTitle').textContent = 'Produtos';
        document.getElementById('actionButton').innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Novo Produto
        `;
        document.getElementById('actionButton').onclick = openTypeModal;
        document.getElementById('productsPage').classList.remove('hidden');
        document.getElementById('seoPage').classList.add('hidden');
    } else if (page === 'seo') {
        document.getElementById('menuSeo').classList.add('bg-neutral-900', 'text-white');
        document.getElementById('menuSeo').classList.remove('text-neutral-700', 'hover:bg-neutral-100');
        document.getElementById('pageTitle').textContent = 'SEO';
        document.getElementById('actionButton').innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Criar SEO
        `;
        document.getElementById('actionButton').onclick = openSelectProductModal;
        document.getElementById('seoPage').classList.remove('hidden');
        renderSeoList();
    } else if (page === 'utilities') {
        document.getElementById('menuUtilities').classList.add('bg-neutral-900', 'text-white');
        document.getElementById('menuUtilities').classList.remove('text-neutral-700', 'hover:bg-neutral-100');
        document.getElementById('utilitiesPage').classList.remove('hidden');
        renderLinksList();
    }
}

// ============= SEO MANAGEMENT =============

// Render SEO list
function renderSeoList() {
    const grid = document.getElementById('seoGrid');
    const emptyState = document.getElementById('emptyStateSeo');
    
    if (seoData.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        grid.innerHTML = seoData.map(seo => {
            const product = products.find(p => p.id === seo.productId);
            return `
                <div class="bg-white border border-neutral-200 rounded-lg p-5 hover:shadow-md hover:border-neutral-300 transition-all">
                    <div class="mb-3">
                        <h3 class="text-base font-semibold text-neutral-900 mb-1">${product ? product.name : 'Produto não encontrado'}</h3>
                        <p class="text-xs text-neutral-500">${product ? product.sku : ''}</p>
                    </div>
                    
                    <div class="mb-3">
                        <p class="text-xs text-neutral-500 mb-2">Principal:</p>
                        <div class="mb-2">
                            <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">${seo.mainKeyword}</span>
                        </div>
                        ${seo.secondaryKeywords && seo.secondaryKeywords.length > 0 ? `
                        <p class="text-xs text-neutral-500 mb-1 mt-2">Secundárias:</p>
                        <div class="flex flex-wrap gap-1">
                            ${seo.secondaryKeywords.slice(0, 2).map(keyword => `
                                <span class="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded">${keyword}</span>
                            `).join('')}
                            ${seo.secondaryKeywords.length > 2 ? `<span class="px-2 py-1 text-neutral-500 text-xs">+${seo.secondaryKeywords.length - 2}</span>` : ''}
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="flex items-center justify-between pt-3 border-t border-neutral-100">
                        <span class="text-xs text-neutral-500">
                            ${(seo.secondaryKeywords?.length || 0) + (seo.longTailKeywords?.length || 0) + 1} palavras-chave
                        </span>
                        <div class="flex gap-1">
                            <button onclick="editSeo(${seo.id})" class="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </button>
                            <button onclick="deleteSeo(${seo.id})" class="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Open select product modal
function openSelectProductModal() {
    const modal = document.getElementById('selectProductModal');
    modal.classList.add('active');
    renderProductListForSeo();
}

// Close select product modal
function closeSelectProductModal() {
    const modal = document.getElementById('selectProductModal');
    modal.classList.remove('active');
}

// Render product list for SEO
function renderProductListForSeo(filter = '') {
    const container = document.getElementById('productListSeo');
    let filteredProducts = products;
    
    if (filter) {
        filteredProducts = products.filter(p => 
            p.name.toLowerCase().includes(filter.toLowerCase()) ||
            p.sku.toLowerCase().includes(filter.toLowerCase())
        );
    }
    
    container.innerHTML = filteredProducts.map(product => `
        <button onclick="selectProductForSeo(${product.id})" class="w-full text-left p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 hover:border-neutral-300 transition-all">
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-semibold text-neutral-900">${product.name}</p>
                    <p class="text-sm text-neutral-500">${product.sku} • ${product.type === 'simples' ? 'Simples' : 'Composto'}</p>
                </div>
                <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        </button>
    `).join('');
}

// Filter products for SEO
function filterProductsForSeo() {
    const filter = document.getElementById('searchProductSeo').value;
    renderProductListForSeo(filter);
}

// Select product for SEO
function selectProductForSeo(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('seoFormProductId').value = productId;
        document.getElementById('seoFormProductName').textContent = `Produto: ${product.name} (${product.sku})`;
        
        // Preencher valor do produto
        const productPrice = product.price || product.totalPrice || 0;
        document.getElementById('productValueInput').value = `R$ ${productPrice.toFixed(2).replace('.', ',')}`;
        
        closeSelectProductModal();
        openSeoForm();
    }
}

// Open SEO Form Page
function openSeoForm() {
    document.getElementById('productsPage').classList.add('hidden');
    document.getElementById('seoPage').classList.add('hidden');
    document.getElementById('seoFormPage').classList.remove('hidden');
    currentSeoStep = 1;
    secondaryKeywords = [];
    longTailKeywords = [];
    renderSecondaryKeywordsForm();
    renderLongTailKeywordsForm();
    
    // Initialize gender dropdown
    const genderOptions = ['Masculino', 'Feminino', 'Unissex'];
    document.getElementById('genderSelectContainer').innerHTML = createCustomDropdown('genderDropdown', genderOptions, '', 'Selecione');
    
    goToFormStep(1);
    updateFormPreview();
}

// Close SEO Form Page
function closeSeoForm() {
    document.getElementById('seoFormPage').classList.add('hidden');
    if (currentPage === 'seo') {
        document.getElementById('seoPage').classList.remove('hidden');
    } else {
        document.getElementById('productsPage').classList.remove('hidden');
    }
    document.getElementById('seoFormMain').reset();
    secondaryKeywords = [];
    longTailKeywords = [];
    benefits = [];
    uses = [];
    faqs = [];
    extraSchemaFields = [];
    renderSecondaryKeywordsForm();
    renderLongTailKeywordsForm();
    currentSeoStep = 1;
}

// Arrays para gerenciar conteúdo dinâmico
let benefits = [];
let uses = [];
let faqs = [];
let extraSchemaFields = [];
let benefitCounter = 0;
let useCounter = 0;
let faqCounter = 0;
let schemaFieldCounter = 0;

// Tipos de Schema disponíveis
const schemaTypes = [
    'name',
    'description',
    'brand',
    'sku',
    'price',
    'priceCurrency',
    'availability',
    'category',
    'image',
    'url',
    'weight',
    'width',
    'height',
    'depth',
    'material',
    'color',
    'model',
    'gtin',
    'mpn',
    'offers',
    'review',
    'aggregateRating',
    'manufacturer'
];

// Form Step Navigation
function goToFormStep(step) {
    currentSeoStep = step;
    
    // Hide all steps
    document.querySelectorAll('.seo-form-step').forEach(s => s.classList.remove('active'));
    
    // Show current step
    document.getElementById(`seoFormStep${step}`).classList.add('active');
    
    // Update step indicators
    for (let i = 1; i <= 3; i++) {
        const btn = document.getElementById(`stepFormBtn${i}`);
        if (btn) {
            if (i === step) {
                btn.classList.remove('bg-neutral-200', 'text-neutral-600');
                btn.classList.add('bg-neutral-900', 'text-white');
            } else {
                btn.classList.remove('bg-neutral-900', 'text-white');
                btn.classList.add('bg-neutral-200', 'text-neutral-600');
            }
        }
    }
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevFormStepBtn');
    const nextBtn = document.getElementById('nextFormStepBtn');
    const submitBtn = document.getElementById('submitFormBtn');
    
    if (step === 1) {
        prevBtn.classList.add('hidden');
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    } else if (step === 2) {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
        // Load product specs when entering step 2
        loadProductFormSpecsAsInputs();
    } else if (step === 3) {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    }
}

function nextFormStep() {
    if (currentSeoStep < 3) {
        goToFormStep(currentSeoStep + 1);
    }
}

function prevFormStep() {
    if (currentSeoStep > 1) {
        goToFormStep(currentSeoStep - 1);
    }
}

// Update Form Preview
function updateFormPreview() {
    const title = document.getElementById('titleTagFormInput').value || 'Título do Produto | Sua Loja';
    const description = document.getElementById('metaDescriptionFormInput').value || 'A meta description aparecerá aqui. Escreva uma descrição atraente e informativa para aumentar o CTR nos resultados de busca.';
    const slug = document.getElementById('slugFormInput').value || 'slug-do-produto';
    
    document.getElementById('previewFormTitle').textContent = title;
    document.getElementById('previewFormDescription').textContent = description;
    document.getElementById('previewFormUrl').textContent = `seusite.com.br/produto/${slug}`;
    
    // Update character counts
    document.getElementById('titleFormCount').textContent = document.getElementById('titleTagFormInput').value.length;
    document.getElementById('descFormCount').textContent = document.getElementById('metaDescriptionFormInput').value.length;
}

// Generate schema type options for dropdown menu
function generateSchemaTypeOptions(selectedType = '') {
    return schemaTypes.map(type => 
        `<div class="schema-dropdown-item ${type === selectedType ? 'selected' : ''}" onclick="selectSchemaType(this, '${type}')">${type}</div>`
    ).join('');
}

// Create custom dropdown button
function createSchemaDropdown(id, selectedValue = '') {
    const displayValue = selectedValue || 'Selecione';
    return `
        <div class="schema-dropdown-wrapper">
            <button type="button" class="schema-dropdown-trigger" onclick="toggleSchemaDropdown(event, '${id}')">
                <span>${displayValue}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            <div id="${id}" class="schema-dropdown-menu" style="display: none;">
                <div class="schema-dropdown-item ${!selectedValue ? 'selected' : ''}" onclick="selectSchemaType(this, '', '${id}')">Selecione</div>
                ${schemaTypes.map(type => 
                    `<div class="schema-dropdown-item ${type === selectedValue ? 'selected' : ''}" onclick="selectSchemaType(this, '${type}', '${id}')">${type}</div>`
                ).join('')}
            </div>
        </div>
    `;
}

// Toggle schema dropdown
function toggleSchemaDropdown(event, dropdownId) {
    event.stopPropagation();
    const dropdown = document.getElementById(dropdownId);
    const trigger = event.currentTarget;
    const isOpen = dropdown.style.display === 'block';
    
    // Close all dropdowns
    document.querySelectorAll('.schema-dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
    });
    document.querySelectorAll('.schema-dropdown-trigger').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Toggle current dropdown
    if (!isOpen) {
        dropdown.style.display = 'block';
        trigger.classList.add('active');
    }
}

// Select schema type from dropdown
function selectSchemaType(element, value, dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const trigger = dropdown.previousElementSibling;
    const displayText = value || 'Selecione';
    
    // Update trigger text
    trigger.querySelector('span').textContent = displayText;
    
    // Update selected state
    dropdown.querySelectorAll('.schema-dropdown-item').forEach(item => {
        item.classList.remove('selected');
    });
    element.classList.add('selected');
    
    // If this is an extra schema field dropdown, update the field type
    if (dropdownId.startsWith('extraSchemaDropdown_')) {
        const fieldId = parseInt(dropdownId.replace('extraSchemaDropdown_', ''));
        updateSchemaField(fieldId, 'type', value);
    }
    
    // Close dropdown
    dropdown.style.display = 'none';
    trigger.classList.remove('active');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.custom-dropdown-wrapper') && !event.target.closest('.schema-dropdown-wrapper')) {
        document.querySelectorAll('.custom-dropdown-menu, .schema-dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
        document.querySelectorAll('.custom-dropdown-trigger, .schema-dropdown-trigger').forEach(btn => {
            btn.classList.remove('active');
        });
    }
});

// ===== GENERIC CUSTOM DROPDOWN =====
// Create generic custom dropdown
function createCustomDropdown(id, options, selectedValue = '', placeholder = 'Selecione') {
    const displayValue = selectedValue || placeholder;
    const optionsHTML = options.map(opt => {
        const value = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        return `<div class="custom-dropdown-item ${value === selectedValue ? 'selected' : ''}" onclick="selectCustomDropdownItem(this, '${value}', '${id}')">${label}</div>`;
    }).join('');
    
    return `
        <div class="custom-dropdown-wrapper">
            <button type="button" class="custom-dropdown-trigger" onclick="toggleCustomDropdown(event, '${id}')">
                <span>${displayValue}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            <div id="${id}" class="custom-dropdown-menu" style="display: none;">
                <div class="custom-dropdown-item ${!selectedValue ? 'selected' : ''}" onclick="selectCustomDropdownItem(this, '', '${id}')">${placeholder}</div>
                ${optionsHTML}
            </div>
        </div>
    `;
}

// Toggle custom dropdown
function toggleCustomDropdown(event, dropdownId) {
    event.stopPropagation();
    const dropdown = document.getElementById(dropdownId);
    const trigger = event.currentTarget;
    const isOpen = dropdown.style.display === 'block';
    
    // Close all dropdowns
    document.querySelectorAll('.custom-dropdown-menu, .schema-dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
    });
    document.querySelectorAll('.custom-dropdown-trigger, .schema-dropdown-trigger').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Toggle current dropdown
    if (!isOpen) {
        dropdown.style.display = 'block';
        trigger.classList.add('active');
    }
}

// Select custom dropdown item
function selectCustomDropdownItem(element, value, dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const trigger = dropdown.previousElementSibling;
    const displayText = element.textContent;
    
    // Update trigger text
    trigger.querySelector('span').textContent = displayText;
    
    // Update selected state
    dropdown.querySelectorAll('.custom-dropdown-item').forEach(item => {
        item.classList.remove('selected');
    });
    element.classList.add('selected');
    
    // Store value in data attribute
    trigger.setAttribute('data-value', value);
    
    // Close dropdown
    dropdown.style.display = 'none';
    trigger.classList.remove('active');
    
    // Trigger change event for form handling
    const changeEvent = new CustomEvent('dropdownChange', { detail: { id: dropdownId, value: value } });
    document.dispatchEvent(changeEvent);
}

// Get selected value from custom dropdown
function getCustomDropdownValue(triggerId) {
    const menu = document.getElementById(triggerId);
    if (!menu) return '';
    const trigger = menu.previousElementSibling;
    return trigger.getAttribute('data-value') || '';
}

// Load Product Specs as Schema Fields
function loadProductFormSpecsAsInputs() {
    const productId = parseInt(document.getElementById('seoFormProductId').value);
    const product = products.find(p => p.id === productId);
    const container = document.getElementById('productSchemaFields');
    
    if (!product) {
        container.innerHTML = '<p class="text-sm text-neutral-500">Produto não encontrado</p>';
        return;
    }
    
    let fieldsHTML = '';
    let fieldCounter = 0;
    
    // Nome
    fieldsHTML += `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 items-end">
            <div class="lg:col-span-2">
                <label class="form-label text-sm">Nome</label>
                <input type="text" value="${product.name}" class="form-input" readonly>
            </div>
            <div>
                <label class="form-label text-sm">Tipo Schema</label>
                ${createSchemaDropdown('schemaDropdown_' + fieldCounter++, 'name')}
            </div>
        </div>
    `;
    
    // SKU
    fieldsHTML += `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 items-end">
            <div class="lg:col-span-2">
                <label class="form-label text-sm">SKU</label>
                <input type="text" value="${product.sku}" class="form-input" readonly>
            </div>
            <div>
                <label class="form-label text-sm">Tipo Schema</label>
                ${createSchemaDropdown('schemaDropdown_' + fieldCounter++, 'sku')}
            </div>
        </div>
    `;
    
    // Categoria
    fieldsHTML += `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 items-end">
            <div class="lg:col-span-2">
                <label class="form-label text-sm">Categoria</label>
                <input type="text" value="${product.category}" class="form-input" readonly>
            </div>
            <div>
                <label class="form-label text-sm">Tipo Schema</label>
                ${createSchemaDropdown('schemaDropdown_' + fieldCounter++, 'category')}
            </div>
        </div>
    `;
    
    // Peso
    if (product.weight) {
        fieldsHTML += `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 items-end">
                <div class="lg:col-span-2">
                    <label class="form-label text-sm">Peso</label>
                    <input type="text" value="${product.weight} kg" class="form-input" readonly>
                </div>
                <div>
                    <label class="form-label text-sm">Tipo Schema</label>
                    ${createSchemaDropdown('schemaDropdown_' + fieldCounter++, 'weight')}
                </div>
            </div>
        `;
    }
    
    // Valor
    if (product.price) {
        fieldsHTML += `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 items-end">
                <div class="lg:col-span-2">
                    <label class="form-label text-sm">Valor</label>
                    <input type="text" value="R$ ${product.price.toFixed(2)}" class="form-input" readonly>
                </div>
                <div>
                    <label class="form-label text-sm">Tipo Schema</label>
                    ${createSchemaDropdown('schemaDropdown_' + fieldCounter++, 'price')}
                </div>
            </div>
        `;
    }
    
    // Specs do produto composto
    if (product.specs) {
        if (product.specs.brand) {
            fieldsHTML += `
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 items-end">
                    <div class="lg:col-span-2">
                        <label class="form-label text-sm">Marca</label>
                        <input type="text" value="${product.specs.brand}" class="form-input" readonly>
                    </div>
                    <div>
                        <label class="form-label text-sm">Tipo Schema</label>
                        ${createSchemaDropdown('schemaDropdown_' + fieldCounter++, 'brand')}
                    </div>
                </div>
            `;
        }
        if (product.specs.material) {
            fieldsHTML += `
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 items-end">
                    <div class="lg:col-span-2">
                        <label class="form-label text-sm">Material</label>
                        <input type="text" value="${product.specs.material}" class="form-input" readonly>
                    </div>
                    <div>
                        <label class="form-label text-sm">Tipo Schema</label>
                        ${createSchemaDropdown('schemaDropdown_' + fieldCounter++, 'material')}
                    </div>
                </div>
            `;
        }
        if (product.specs.width) {
            fieldsHTML += `
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 items-end">
                    <div class="lg:col-span-2">
                        <label class="form-label text-sm">Largura</label>
                        <input type="text" value="${product.specs.width} cm" class="form-input" readonly>
                    </div>
                    <div>
                        <label class="form-label text-sm">Tipo Schema</label>
                        ${createSchemaDropdown('schemaDropdown_' + fieldCounter++, 'width')}
                    </div>
                </div>
            `;
        }
        if (product.specs.height) {
            fieldsHTML += `
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 items-end">
                    <div class="lg:col-span-2">
                        <label class="form-label text-sm">Altura</label>
                        <input type="text" value="${product.specs.height} cm" class="form-input" readonly>
                    </div>
                    <div>
                        <label class="form-label text-sm">Tipo Schema</label>
                        ${createSchemaDropdown('schemaDropdown_' + fieldCounter++, 'height')}
                    </div>
                </div>
            `;
        }
        if (product.specs.depth) {
            fieldsHTML += `
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 items-end">
                    <div class="lg:col-span-2">
                        <label class="form-label text-sm">Profundidade</label>
                        <input type="text" value="${product.specs.depth} cm" class="form-input" readonly>
                    </div>
                    <div>
                        <label class="form-label text-sm">Tipo Schema</label>
                        ${createSchemaDropdown('schemaDropdown_' + fieldCounter++, 'depth')}
                    </div>
                </div>
            `;
        }
    }
    
    container.innerHTML = fieldsHTML;
}

// Load Product Specs for Form
function loadProductFormSpecs() {
    const productId = parseInt(document.getElementById('seoFormProductId').value);
    const product = products.find(p => p.id === productId);
    const container = document.getElementById('productFormSpecs');
    
    if (!product) {
        container.innerHTML = '<p class="text-sm text-neutral-500">Produto não encontrado</p>';
        return;
    }
    
    let specsHTML = `
        <div class="spec-item">
            <span class="text-xs font-medium text-neutral-700">Nome:</span>
            <span class="text-sm text-neutral-900">${product.name}</span>
        </div>
        <div class="spec-item">
            <span class="text-xs font-medium text-neutral-700">SKU:</span>
            <span class="text-sm text-neutral-900">${product.sku}</span>
        </div>
        <div class="spec-item">
            <span class="text-xs font-medium text-neutral-700">Tipo:</span>
            <span class="text-sm text-neutral-900">${product.type === 'simples' ? 'Produto Simples' : 'Produto Composto'}</span>
        </div>
        <div class="spec-item">
            <span class="text-xs font-medium text-neutral-700">Categoria:</span>
            <span class="text-sm text-neutral-900">${product.category}</span>
        </div>
    `;
    
    if (product.type === 'simples') {
        specsHTML += `
            <div class="spec-item">
                <span class="text-xs font-medium text-neutral-700">Peso:</span>
                <span class="text-sm text-neutral-900">${product.weight} kg</span>
            </div>
            <div class="spec-item">
                <span class="text-xs font-medium text-neutral-700">Valor:</span>
                <span class="text-sm text-neutral-900">R$ ${product.price}</span>
            </div>
        `;
    } else {
        specsHTML += `
            <div class="spec-item">
                <span class="text-xs font-medium text-neutral-700">Peso Total:</span>
                <span class="text-sm text-neutral-900">${product.totalWeight} kg</span>
            </div>
            <div class="spec-item">
                <span class="text-xs font-medium text-neutral-700">Valor Total:</span>
                <span class="text-sm text-neutral-900">R$ ${product.totalPrice}</span>
            </div>
        `;
        
        if (product.specs) {
            if (product.specs.brand) specsHTML += `<div class="spec-item"><span class="text-xs font-medium text-neutral-700">Marca:</span><span class="text-sm text-neutral-900">${product.specs.brand}</span></div>`;
            if (product.specs.material) specsHTML += `<div class="spec-item"><span class="text-xs font-medium text-neutral-700">Material:</span><span class="text-sm text-neutral-900">${product.specs.material}</span></div>`;
            if (product.specs.width) specsHTML += `<div class="spec-item"><span class="text-xs font-medium text-neutral-700">Largura:</span><span class="text-sm text-neutral-900">${product.specs.width} cm</span></div>`;
            if (product.specs.height) specsHTML += `<div class="spec-item"><span class="text-xs font-medium text-neutral-700">Altura:</span><span class="text-sm text-neutral-900">${product.specs.height} cm</span></div>`;
            if (product.specs.depth) specsHTML += `<div class="spec-item"><span class="text-xs font-medium text-neutral-700">Profundidade:</span><span class="text-sm text-neutral-900">${product.specs.depth} cm</span></div>`;
            if (product.specs.metalonType) specsHTML += `<div class="spec-item"><span class="text-xs font-medium text-neutral-700">Tipo Metalon:</span><span class="text-sm text-neutral-900">${product.specs.metalonType}</span></div>`;
            if (product.specs.capacity) specsHTML += `<div class="spec-item"><span class="text-xs font-medium text-neutral-700">Capacidade:</span><span class="text-sm text-neutral-900">${product.specs.capacity}</span></div>`;
            if (product.specs.assembly) specsHTML += `<div class="spec-item"><span class="text-xs font-medium text-neutral-700">Montagem:</span><span class="text-sm text-neutral-900">${product.specs.assembly}</span></div>`;
        }
    }
    
    container.innerHTML = specsHTML;
    updateFormSchemaPreview();
}

// Update Form Schema Preview
function updateFormSchemaPreview() {
    const schemaType = document.getElementById('schemaTypeFormSelect').value;
    const productId = parseInt(document.getElementById('seoFormProductId').value);
    const product = products.find(p => p.id === productId);
    const previewElement = document.getElementById('schemaFormPreview');
    
    if (!schemaType) {
        previewElement.textContent = 'Selecione um tipo de schema para visualizar';
        return;
    }
    
    if (!product) {
        previewElement.textContent = 'Produto não encontrado';
        return;
    }
    
    const titleTag = document.getElementById('titleTagFormInput').value || product.name;
    const metaDesc = document.getElementById('metaDescriptionFormInput').value || '';
    const slug = document.getElementById('slugFormInput').value || product.sku.toLowerCase();
    
    let schema = {};
    
    switch(schemaType) {
        case 'Product':
            schema = {
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": product.name,
                "sku": product.sku,
                "description": metaDesc,
                "category": product.category,
                "offers": {
                    "@type": "Offer",
                    "price": product.price || product.totalPrice,
                    "priceCurrency": "BRL",
                    "availability": "https://schema.org/InStock",
                    "url": `https://seusite.com.br/produto/${slug}`
                }
            };
            break;
        case 'Offer':
            schema = {
                "@context": "https://schema.org/",
                "@type": "Offer",
                "name": product.name,
                "price": product.price || product.totalPrice,
                "priceCurrency": "BRL",
                "availability": "https://schema.org/InStock",
                "url": `https://seusite.com.br/produto/${slug}`
            };
            break;
        case 'Review':
            schema = {
                "@context": "https://schema.org/",
                "@type": "Review",
                "itemReviewed": {
                    "@type": "Product",
                    "name": product.name,
                    "sku": product.sku
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                },
                "author": {
                    "@type": "Person",
                    "name": "Cliente"
                }
            };
            break;
        case 'AggregateRating':
            schema = {
                "@context": "https://schema.org/",
                "@type": "AggregateRating",
                "itemReviewed": {
                    "@type": "Product",
                    "name": product.name,
                    "sku": product.sku
                },
                "ratingValue": "4.5",
                "reviewCount": "89"
            };
            break;
        case 'FAQPage':
            schema = {
                "@context": "https://schema.org/",
                "@type": "FAQPage",
                "mainEntity": [{
                    "@type": "Question",
                    "name": `Como usar ${product.name}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Instruções de uso do produto..."
                    }
                }]
            };
            break;
        case 'BreadcrumbList':
            schema = {
                "@context": "https://schema.org/",
                "@type": "BreadcrumbList",
                "itemListElement": [{
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://seusite.com.br"
                }, {
                    "@type": "ListItem",
                    "position": 2,
                    "name": product.category,
                    "item": `https://seusite.com.br/${product.category.toLowerCase()}`
                }, {
                    "@type": "ListItem",
                    "position": 3,
                    "name": product.name,
                    "item": `https://seusite.com.br/produto/${slug}`
                }]
            };
            break;
    }
    
    previewElement.textContent = JSON.stringify(schema, null, 2);
}

// Form Keywords Functions
function addSecondaryKeywordForm() {
    const input = document.getElementById('secondaryKeywordFormInput');
    const keyword = input.value.trim();
    
    if (keyword && !secondaryKeywords.includes(keyword)) {
        secondaryKeywords.push(keyword);
        input.value = '';
        renderSecondaryKeywordsForm();
    }
}

function handleSecondaryKeywordFormEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addSecondaryKeywordForm();
    }
}

function removeSecondaryKeywordForm(keyword) {
    secondaryKeywords = secondaryKeywords.filter(k => k !== keyword);
    renderSecondaryKeywordsForm();
}

function renderSecondaryKeywordsForm() {
    const container = document.getElementById('secondaryKeywordsFormContainer');
    
    if (secondaryKeywords.length === 0) {
        container.innerHTML = '';
    } else {
        container.innerHTML = secondaryKeywords.map(keyword => `
            <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 text-sm rounded-lg">
                ${keyword}
                <button type="button" onclick="removeSecondaryKeywordForm('${keyword}')" class="hover:text-red-600 transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </span>
        `).join('');
    }
}

function addLongTailKeywordForm() {
    const input = document.getElementById('longTailKeywordFormInput');
    const keyword = input.value.trim();
    
    if (keyword && !longTailKeywords.includes(keyword)) {
        longTailKeywords.push(keyword);
        input.value = '';
        renderLongTailKeywordsForm();
    }
}

function handleLongTailKeywordFormEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addLongTailKeywordForm();
    }
}

function removeLongTailKeywordForm(keyword) {
    longTailKeywords = longTailKeywords.filter(k => k !== keyword);
    renderLongTailKeywordsForm();
}

function renderLongTailKeywordsForm() {
    const container = document.getElementById('longTailKeywordsFormContainer');
    
    if (longTailKeywords.length === 0) {
        container.innerHTML = '';
    } else {
        container.innerHTML = longTailKeywords.map(keyword => `
            <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-800 text-sm rounded-lg">
                ${keyword}
                <button type="button" onclick="removeLongTailKeywordForm('${keyword}')" class="hover:text-red-600 transition-colors">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </span>
        `).join('');
    }
}

// Save SEO from Form
document.getElementById('seoFormMain').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const productId = parseInt(document.getElementById('seoFormProductId').value);
    const mainKeyword = document.getElementById('mainKeywordFormInput').value.trim();
    const titleTag = document.getElementById('titleTagFormInput').value.trim();
    const metaDescription = document.getElementById('metaDescriptionFormInput').value.trim();
    const slug = document.getElementById('slugFormInput').value.trim();
    
    // Etapa 1: Público e Segmentação
    const targetAudience = document.getElementById('targetAudienceInput').value.trim();
    const secondaryAudience = document.getElementById('secondaryAudienceInput').value.trim();
    const storeType = document.getElementById('storeTypeInput').value.trim();
    const gender = getCustomDropdownValue('genderDropdown');
    const productValue = document.getElementById('productValueInput').value.trim();
    
    // Etapa 3: Conteúdo
    const h1 = document.getElementById('h1Input').value.trim();
    const h2 = document.getElementById('h2Input').value.trim();
    const warnings = document.getElementById('warningsInput').value.trim();
    
    // Validações
    if (!mainKeyword) {
        alert('Adicione a palavra-chave principal!');
        return;
    }
    
    if (!targetAudience) {
        alert('Preencha o campo Público Alvo!');
        return;
    }
    
    if (!titleTag || !metaDescription || !slug) {
        alert('Preencha todos os campos obrigatórios (Title Tag, Meta Description e Slug)!');
        return;
    }
    
    if (!h1) {
        alert('Preencha o H1 na etapa 3!');
        return;
    }
    
    const newId = seoData.length > 0 ? Math.max(...seoData.map(s => s.id)) + 1 : 1;
    
    seoData.push({
        id: newId,
        productId: productId,
        mainKeyword: mainKeyword,
        secondaryKeywords: [...secondaryKeywords],
        longTailKeywords: [...longTailKeywords],
        targetAudience: targetAudience,
        secondaryAudience: secondaryAudience,
        storeType: storeType,
        gender: gender,
        productValue: productValue,
        titleTag: titleTag,
        metaDescription: metaDescription,
        slug: slug,
        h1: h1,
        h2: h2,
        benefits: [...benefits],
        uses: [...uses],
        warnings: warnings,
        faqs: [...faqs]
    });
    
    localStorage.setItem('seoData', JSON.stringify(seoData));
    renderSeoList();
    closeSeoForm();
});


// Edit SEO
function editSeo(id) {
    // To be implemented later
    alert('Função de editar em desenvolvimento');
}

// Delete SEO
function deleteSeo(id) {
    if (confirm('Tem certeza que deseja excluir este SEO?')) {
        seoData = seoData.filter(s => s.id !== id);
        localStorage.setItem('seoData', JSON.stringify(seoData));
        renderSeoList();
    }
}

// Close modals on outside click
document.getElementById('selectProductModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeSelectProductModal();
    }
});

// === SCHEMA EXTRA FIELDS ===
function addSchemaField() {
    const input = document.getElementById('newSchemaFieldName');
    const fieldName = input.value.trim();
    
    if (fieldName) {
        schemaFieldCounter++;
        const id = schemaFieldCounter;
        extraSchemaFields.push({ id, name: fieldName, value: '', type: '' });
        input.value = '';
        renderExtraSchemaFields();
    }
}

function removeSchemaField(id) {
    extraSchemaFields = extraSchemaFields.filter(f => f.id !== id);
    renderExtraSchemaFields();
}

function updateSchemaField(id, field, value) {
    const schemaField = extraSchemaFields.find(f => f.id === id);
    if (schemaField) {
        schemaField[field] = value;
    }
}

function renderExtraSchemaFields() {
    const container = document.getElementById('extraSchemaFields');
    if (extraSchemaFields.length === 0) {
        container.innerHTML = '<p class="text-sm text-neutral-500">Nenhum campo extra adicionado</p>';
        return;
    }
    
    container.innerHTML = extraSchemaFields.map(field => `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 items-end">
            <div>
                <label class="form-label text-sm">${field.name}</label>
                <input type="text" placeholder="Valor" value="${field.value}" 
                    onchange="updateSchemaField(${field.id}, 'value', this.value)" class="form-input">
            </div>
            <div>
                <label class="form-label text-sm">Tipo Schema</label>
                ${createSchemaDropdown('extraSchemaDropdown_' + field.id, field.type)}
            </div>
            <div>
                <button type="button" onclick="removeSchemaField(${field.id})" class="w-full px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-all">
                    <svg class="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

// === BENEFÍCIOS ===
function addBenefitFromInput() {
    const input = document.getElementById('newBenefitInput');
    const title = input.value.trim();
    
    if (title) {
        benefitCounter++;
        const id = benefitCounter;
        benefits.push({ id, title: title, description: '' });
        input.value = '';
        renderBenefits();
    }
}

function addBenefit() {
    benefitCounter++;
    const id = benefitCounter;
    benefits.push({ id, title: '', description: '' });
    renderBenefits();
}

function removeBenefit(id) {
    benefits = benefits.filter(b => b.id !== id);
    renderBenefits();
}

function renderBenefits() {
    const container = document.getElementById('benefitsContainer');
    if (benefits.length === 0) {
        container.innerHTML = '<p class="text-sm text-neutral-500">Nenhum benefício adicionado</p>';
        return;
    }
    
    container.innerHTML = benefits.map(benefit => `
        <div class="flex gap-3 items-center border border-neutral-200 rounded-lg p-3 bg-neutral-100">
            <input type="text" placeholder="Título do benefício" value="${benefit.title}" 
                onchange="updateBenefit(${benefit.id}, 'title', this.value)" class="form-input flex-1">
            <input type="text" placeholder="Descrição rápida" value="${benefit.description}" 
                onchange="updateBenefit(${benefit.id}, 'description', this.value)" class="form-input flex-1">
            <button type="button" onclick="removeBenefit(${benefit.id})" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

function updateBenefit(id, field, value) {
    const benefit = benefits.find(b => b.id === id);
    if (benefit) {
        benefit[field] = value;
    }
}

// === USOS ===
function addUseFromInput() {
    const input = document.getElementById('newUseInput');
    const title = input.value.trim();
    
    if (title) {
        useCounter++;
        const id = useCounter;
        uses.push({ id, title: title, description: '' });
        input.value = '';
        renderUses();
    }
}

function addUse() {
    useCounter++;
    const id = useCounter;
    uses.push({ id, description: '' });
    renderUses();
}

function removeUse(id) {
    uses = uses.filter(u => u.id !== id);
    renderUses();
}

function renderUses() {
    const container = document.getElementById('usesContainer');
    if (uses.length === 0) {
        container.innerHTML = '<p class="text-sm text-neutral-500">Nenhum uso adicionado</p>';
        return;
    }
    
    container.innerHTML = uses.map(use => `
        <div class="flex gap-3 items-center border border-neutral-200 rounded-lg p-3 bg-neutral-100">
            <input type="text" placeholder="Título do uso" value="${use.title}" 
                onchange="updateUse(${use.id}, 'title', this.value)" class="form-input flex-1">
            <input type="text" placeholder="Descrição do uso" value="${use.description}" 
                onchange="updateUse(${use.id}, 'description', this.value)" class="form-input flex-1">
            <button type="button" onclick="removeUse(${use.id})" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

function updateUse(id, field, value) {
    const use = uses.find(u => u.id === id);
    if (use) {
        use[field] = value;
    }
}

// === FAQ ===
function addFAQFromInput() {
    const input = document.getElementById('newFAQInput');
    const question = input.value.trim();
    
    if (question) {
        faqCounter++;
        const id = faqCounter;
        faqs.push({ id, question: question, answer: '' });
        input.value = '';
        renderFAQs();
    }
}

function addFAQ() {
    faqCounter++;
    const id = faqCounter;
    faqs.push({ id, question: '', answer: '' });
    renderFAQs();
}

function removeFAQ(id) {
    faqs = faqs.filter(f => f.id !== id);
    renderFAQs();
}

function renderFAQs() {
    const container = document.getElementById('faqContainer');
    if (faqs.length === 0) {
        container.innerHTML = '<p class="text-sm text-neutral-500">Nenhuma pergunta adicionada</p>';
        return;
    }
    
    container.innerHTML = faqs.map(faq => `
        <div class="flex gap-3 items-center border border-neutral-200 rounded-lg p-3 bg-neutral-100">
            <input type="text" placeholder="Pergunta" value="${faq.question}" 
                onchange="updateFAQ(${faq.id}, 'question', this.value)" class="form-input flex-1">
            <input type="text" placeholder="Resposta" value="${faq.answer}" 
                onchange="updateFAQ(${faq.id}, 'answer', this.value)" class="form-input flex-1">
            <button type="button" onclick="removeFAQ(${faq.id})" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

function updateFAQ(id, field, value) {
    const faq = faqs.find(f => f.id === id);
    if (faq) {
        faq[field] = value;
    }
}

// ============= USEFUL LINKS MANAGEMENT =============

// Render links list
function renderLinksList() {
    const container = document.getElementById('linksList');
    const emptyState = document.getElementById('emptyStateLinks');
    
    if (usefulLinks.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    // Group by category
    const groupedLinks = {};
    linkCategories.forEach(cat => {
        groupedLinks[cat] = usefulLinks.filter(link => link.category === cat);
    });
    
    let html = '';
    
    linkCategories.forEach(category => {
        const links = groupedLinks[category];
        if (links.length > 0) {
            html += `
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-neutral-900 mb-3">${category}</h3>
                    <div class="space-y-2">
                        ${links.map(link => `
                            <div class="flex items-center gap-3 p-4 bg-white border border-neutral-200 rounded-lg hover:shadow-sm transition-all">
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-medium text-neutral-900 truncate">${link.name}</h4>
                                    <a href="${link.url}" target="_blank" class="text-sm text-neutral-500 hover:text-neutral-700 truncate block">${link.url}</a>
                                </div>
                                <div class="flex gap-2 flex-shrink-0">
                                    <a href="${link.url}" target="_blank" class="px-3 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-all">
                                        Acessar
                                    </a>
                                    <button onclick="editLink(${link.id})" class="px-3 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-all">
                                        Editar
                                    </button>
                                    <button onclick="deleteLink(${link.id})" class="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-all">
                                        Deletar
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    });
    
    container.innerHTML = html;
}

// Open add link modal
function openAddLinkModal() {
    document.getElementById('linkModalTitle').textContent = 'Adicionar Link';
    document.getElementById('linkForm').reset();
    document.getElementById('linkId').value = '';
    
    // Initialize category dropdown
    document.getElementById('linkCategoryContainer').innerHTML = createCustomDropdown('linkCategoryDropdown', linkCategories, '', 'Selecione uma categoria');
    
    document.getElementById('linkModal').classList.add('active');
}

// Close link modal
function closeLinkModal() {
    document.getElementById('linkModal').classList.remove('active');
    document.getElementById('linkForm').reset();
}

// Edit link
function editLink(id) {
    const link = usefulLinks.find(l => l.id === id);
    if (!link) return;
    
    document.getElementById('linkModalTitle').textContent = 'Editar Link';
    document.getElementById('linkId').value = link.id;
    document.getElementById('linkName').value = link.name;
    document.getElementById('linkUrl').value = link.url;
    
    // Initialize category dropdown with selected value
    document.getElementById('linkCategoryContainer').innerHTML = createCustomDropdown('linkCategoryDropdown', linkCategories, link.category, 'Selecione uma categoria');
    
    document.getElementById('linkModal').classList.add('active');
}

// Delete link
function deleteLink(id) {
    if (!confirm('Deseja realmente deletar este link?')) return;
    
    usefulLinks = usefulLinks.filter(l => l.id !== id);
    localStorage.setItem('usefulLinks', JSON.stringify(usefulLinks));
    renderLinksList();
}

// Save link
document.getElementById('linkForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('linkId').value;
    const name = document.getElementById('linkName').value.trim();
    const url = document.getElementById('linkUrl').value.trim();
    const category = getCustomDropdownValue('linkCategoryDropdown');
    
    if (!name || !url || !category) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }
    
    if (id) {
        // Edit existing link
        const link = usefulLinks.find(l => l.id === parseInt(id));
        if (link) {
            link.name = name;
            link.url = url;
            link.category = category;
        }
    } else {
        // Add new link
        const newId = usefulLinks.length > 0 ? Math.max(...usefulLinks.map(l => l.id)) + 1 : 1;
        usefulLinks.push({
            id: newId,
            name: name,
            url: url,
            category: category
        });
    }
    
    localStorage.setItem('usefulLinks', JSON.stringify(usefulLinks));
    closeLinkModal();
    renderLinksList();
});

// Initial render
renderProducts();
