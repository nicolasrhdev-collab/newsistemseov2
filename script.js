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

// Initial render
renderProducts();
