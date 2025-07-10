// E-commerce App - JavaScript Principal
// Autor: Cauê Sotero
// Versão: 2.0.0

class EcommerceApp {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.selectedProducts = [];
        this.favorites = this.loadFavorites();
        this.cartHistory = this.loadCartHistory();
        this.isLoading = false;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProducts();
        this.setupIntersectionObserver();
        this.setupKeyboardShortcuts();
    }

    setupEventListeners() {
        // Carrinho
        document.getElementById('cartBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showCartSummary();
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCartSidebar();
                this.closeSuccessModal();
            }
        });

        // Modal overlay
        document.getElementById('successModal')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeSuccessModal();
            }
        });

        // Inicializar Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    setupIntersectionObserver() {
        // Lazy loading para imagens
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        // Observar todas as imagens lazy
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K para busca
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.querySelector('.search-input')?.focus();
            }
            
            // Ctrl/Cmd + B para carrinho
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                this.showCartSummary();
            }
        });
    }

    // Cache Management
    getCachedData(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    setCachedData(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    // Favorites Management
    loadFavorites() {
        try {
            return JSON.parse(localStorage.getItem('favorites') || '[]');
        } catch {
            return [];
        }
    }

    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    toggleFavorite(productId) {
        const index = this.favorites.indexOf(productId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showToast('Produto removido dos favoritos', 'info');
        } else {
            this.favorites.push(productId);
            this.showToast('Produto adicionado aos favoritos', 'success');
        }
        this.saveFavorites();
        this.displayProducts(this.filteredProducts);
    }

    isFavorite(productId) {
        return this.favorites.includes(productId);
    }

    // Cart History
    loadCartHistory() {
        try {
            return JSON.parse(localStorage.getItem('cartHistory') || '[]');
        } catch {
            return [];
        }
    }

    saveCartHistory() {
        localStorage.setItem('cartHistory', JSON.stringify(this.cartHistory));
    }

    addToCartHistory(cartData) {
        this.cartHistory.unshift({
            ...cartData,
            timestamp: new Date().toISOString()
        });
        
        // Manter apenas os últimos 10 carrinhos
        if (this.cartHistory.length > 10) {
            this.cartHistory = this.cartHistory.slice(0, 10);
        }
        
        this.saveCartHistory();
    }

    // Toast Notifications
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(toast);

        // Animar entrada
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Loading States
    showLoading() {
        this.isLoading = true;
        document.getElementById('loading').style.display = 'block';
        document.getElementById('productsGrid').style.opacity = '0.5';
    }

    hideLoading() {
        this.isLoading = false;
        document.getElementById('loading').style.display = 'none';
        document.getElementById('productsGrid').style.opacity = '1';
    }

    // Products Management
    async loadProducts() {
        const cached = this.getCachedData('products');
        if (cached) {
            this.products = cached;
            this.filteredProducts = cached;
            this.displayProducts(cached);
            this.displayStats(cached);
            this.populateCategories(cached);
            return;
        }

        this.showLoading();

        try {
            const backendUrl = getBackendUrl('/api/products');
            const response = await fetch(backendUrl);
            const data = await response.json();

            if (data.success) {
                this.products = data.products;
                this.filteredProducts = data.products;
                this.setCachedData('products', data.products);
                this.displayProducts(data.products);
                this.displayStats(data.products);
                this.populateCategories(data.products);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            this.showToast('Erro ao carregar produtos: ' + error.message, 'error');
            console.error('Erro ao carregar produtos:', error);
        } finally {
            this.hideLoading();
        }
    }

    populateCategories(products) {
        const categories = [...new Set(products.map(p => p.category))];
        const select = document.getElementById('categoryFilter');
        
        if (select) {
            select.innerHTML = '<option value="">Todas as categorias</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                select.appendChild(option);
            });
        }
    }

    displayProducts(productsToShow) {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = '';
        
        if (productsToShow.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #64748b;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">
                        <i class="fas fa-search icon-3xl"></i>
                    </div>
                    <h3>Nenhum produto encontrado</h3>
                    <p>Tente ajustar sua pesquisa ou carregar os produtos novamente.</p>
                </div>
            `;
            return;
        }
        
        productsToShow.forEach(product => {
            const card = this.createProductCard(product);
            grid.appendChild(card);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const stars = '★'.repeat(Math.floor(product.rating?.rate || 0)) + '☆'.repeat(5 - Math.floor(product.rating?.rate || 0));
        const isInCart = this.selectedProducts.find(p => p.id === product.id);
        const isFav = this.isFavorite(product.id);
        
        card.innerHTML = `
            <div class="product-image-container">
                <img data-src="${product.image}" alt="${product.title}" class="product-image lazy" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjFGNUY5Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NDc0OEEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW0gbsOjbyBkaXNwb27DrXZlbDwvdGV4dD4KPC9zdmc+'>
                <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="app.toggleFavorite(${product.id})" title="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-title">${product.title}</div>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-text">${product.rating?.rate || 0} (${product.rating?.count || 0} avaliações)</span>
                </div>
                <div class="product-description">${product.description}</div>
                <div class="product-actions">
                    ${isInCart ? 
                        `<button class="btn-remove-from-cart" onclick="app.removeFromCart(${product.id})">
                            <i class="fas fa-trash icon-sm"></i>
                            Remover
                        </button>` :
                        `<button class="btn-add-to-cart" onclick="app.addToCartIndividual(${product.id})" ${this.selectedProducts.length >= 3 ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus icon-sm"></i>
                            Adicionar
                        </button>`
                    }
                </div>
            </div>
        `;
        
        return card;
    }

    displayStats(products) {
        const categories = [...new Set(products.map(p => p.category))];
        const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
        
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('totalCategories').textContent = categories.length;
        document.getElementById('avgPrice').textContent = `R$ ${avgPrice.toFixed(2)}`;
        document.getElementById('stats').style.display = 'grid';
    }

    // Cart Management
    addToCartIndividual(productId) {
        if (this.selectedProducts.length >= 3) {
            this.showToast('Máximo de 3 produtos permitidos!', 'warning');
            return;
        }

        const product = this.products.find(p => p.id === productId);
        if (product && !this.selectedProducts.find(p => p.id === productId)) {
            this.selectedProducts.push(product);
            this.updateCartCounter();
            this.displayProducts(this.filteredProducts);
            this.showToast(`${product.title} adicionado ao carrinho`, 'success');
            
            // Se o sidebar estiver aberto, atualizar o conteúdo
            const sidebar = document.getElementById('cartSidebar');
            if (sidebar.classList.contains('open')) {
                this.showCartSummary();
            }
        }
    }

    removeFromCart(productId) {
        const index = this.selectedProducts.findIndex(p => p.id === productId);
        if (index > -1) {
            const product = this.selectedProducts[index];
            this.selectedProducts.splice(index, 1);
            this.updateCartCounter();
            this.displayProducts(this.filteredProducts);
            this.showToast(`${product.title} removido do carrinho`, 'info');
            
            // Se o sidebar estiver aberto, atualizar o conteúdo
            const sidebar = document.getElementById('cartSidebar');
            if (sidebar.classList.contains('open')) {
                this.showCartSummary();
            }
        }
    }

    clearCart() {
        this.selectedProducts = [];
        this.updateCartCounter();
        this.displayProducts(this.filteredProducts);
        this.closeCartSidebar();
        document.getElementById('result').style.display = 'none';
        this.showToast('Carrinho limpo', 'info');
    }

    async addToCart() {
        if (this.selectedProducts.length === 0) {
            this.showToast('Nenhum produto selecionado!', 'warning');
            return;
        }

        const cartBtn = document.getElementById('cartBtn');
        const sidebarCheckoutBtn = document.getElementById('sidebarCheckoutBtn');
        
        cartBtn.disabled = true;
        sidebarCheckoutBtn.disabled = true;
        this.showLoading();

        try {
            const backendUrl = getBackendUrl('/api/add-to-cart');
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    products: this.selectedProducts.map(p => ({ id: p.id, quantity: 1 }))
                })
            });

            const data = await response.json();

            if (data.success) {
                this.addToCartHistory(data);
                this.showSuccess(data);
                this.selectedProducts = [];
                this.updateCartCounter();
                this.displayProducts(this.filteredProducts);
                this.closeCartSidebar();
                this.showToast('Produtos adicionados ao carrinho com sucesso!', 'success');
            } else {
                this.showError(data);
            }
        } catch (error) {
            this.showError({
                message: 'Erro de conexão com o servidor',
                errorType: 'CONNECTION_ERROR',
                details: error.message
            });
        } finally {
            cartBtn.disabled = false;
            sidebarCheckoutBtn.disabled = false;
            this.hideLoading();
        }
    }

    updateCartCounter() {
        const cartCounter = document.getElementById('cartCounter');
        const sidebarCartCounter = document.getElementById('sidebarCartCounter');
        const cartBtn = document.getElementById('cartBtn');
        
        if (this.selectedProducts.length > 0) {
            cartCounter.style.display = 'inline-block';
            sidebarCartCounter.style.display = 'inline-block';
            cartCounter.textContent = this.selectedProducts.length;
            sidebarCartCounter.textContent = this.selectedProducts.length;
            cartBtn.disabled = false;
        } else {
            cartCounter.style.display = 'none';
            sidebarCartCounter.style.display = 'none';
            cartBtn.disabled = false;
        }
    }

    showCartSummary() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        const content = document.getElementById('cartSidebarContent');
        const footer = document.getElementById('cartSidebarFooter');
        
        if (this.selectedProducts.length === 0) {
            content.innerHTML = `
                <div class="cart-sidebar-empty">
                    <div class="cart-sidebar-empty-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3>Carrinho Vazio</h3>
                    <p>Adicione produtos para começar suas compras!</p>
                </div>
            `;
            footer.style.display = 'none';
        } else {
            let itemsHtml = '';
            this.selectedProducts.forEach(product => {
                itemsHtml += `
                    <div class="cart-item">
                        <div class="cart-item-header">
                            <div class="cart-item-title">${product.title}</div>
                            <button class="cart-item-remove" onclick="app.removeFromCart(${product.id})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="cart-item-category">${product.category}</div>
                        <div class="cart-item-price">R$ ${product.price.toFixed(2)}</div>
                    </div>
                `;
            });
            
            content.innerHTML = itemsHtml;
            footer.style.display = 'block';
            
            const totalPrice = this.selectedProducts.reduce((sum, p) => sum + p.price, 0);
            document.getElementById('cartTotalValue').textContent = `R$ ${totalPrice.toFixed(2)}`;
        }
        
        sidebar.classList.add('open');
        overlay.classList.add('open');
    }

    closeCartSidebar() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
    }

    // Search and Filters
    searchProducts(query) {
        if (!query.trim()) {
            this.filteredProducts = this.products;
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredProducts = this.products.filter(product => 
                product.title.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }
        this.displayProducts(this.filteredProducts);
    }

    applyFilters() {
        const categoryFilter = document.getElementById('categoryFilter').value;
        const sortOrder = document.getElementById('sortOrder').value;
        const priceRange = document.getElementById('priceRange').value;
        
        let filtered = this.products;
        
        // Filtro por categoria
        if (categoryFilter) {
            filtered = filtered.filter(p => p.category === categoryFilter);
        }
        
        // Filtro por preço
        filtered = filtered.filter(p => p.price <= parseFloat(priceRange));
        
        // Ordenação
        if (sortOrder === 'asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'desc') {
            filtered.sort((a, b) => b.price - a.price);
        }
        
        this.filteredProducts = filtered;
        this.displayProducts(filtered);
    }

    clearFilters() {
        document.getElementById('categoryFilter').value = '';
        document.getElementById('sortOrder').value = '';
        document.getElementById('priceRange').value = 1000;
        document.getElementById('priceValue').textContent = 'R$ 1000';
        document.querySelector('.search-input').value = '';
        
        this.filteredProducts = this.products;
        this.displayProducts(this.products);
        this.showToast('Filtros limpos', 'info');
    }

    updatePriceRange() {
        const range = document.getElementById('priceRange');
        const value = document.getElementById('priceValue');
        value.textContent = `R$ ${range.value}`;
        this.applyFilters();
    }

    // Sidebar Toggle
    toggleSidebar() {
        const sidebar = document.getElementById('filtersSidebar');
        const overlay = document.getElementById('filtersOverlay');
        
        if (sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
        } else {
            sidebar.classList.add('open');
            overlay.classList.add('open');
        }
    }

    // Success Modal
    showSuccess(data) {
        const successModal = document.getElementById('successModal');
        const successDetails = document.getElementById('successDetails');
        
        // Preparar detalhes da compra
        let productsHtml = '';
        if (data.products && data.products.length > 0) {
            productsHtml = '<h4><i class="fas fa-box icon-md"></i> Produtos Adicionados:</h4><div class="success-products">';
            data.products.forEach(product => {
                productsHtml += `
                    <div class="success-product-item">
                        <span class="success-product-name">${product.title}</span>
                        <span class="success-product-price">R$ ${product.price.toFixed(2)}</span>
                    </div>
                `;
            });
            productsHtml += '</div>';
        }

        const totalPrice = data.products ? data.products.reduce((sum, p) => sum + p.price, 0) : 0;

        let cartInfoHtml = '';
        if (data.cartId) {
            cartInfoHtml = `
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e0f2fe;">
                    <strong>ID do Carrinho:</strong> ${data.cartId}<br>
                    <span class="status-badge status-success">Criado com sucesso</span>
                </div>
            `;
        }

        successDetails.innerHTML = `
            ${productsHtml}
            <div class="success-total">
                <span class="success-total-label">Total:</span>
                <span class="success-total-value">R$ ${totalPrice.toFixed(2)}</span>
            </div>
            ${cartInfoHtml}
        `;

        successModal.classList.add('open');
        this.createConfetti();
    }

    closeSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.classList.remove('open');
    }

    createConfetti() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.animationDelay = Math.random() * 3 + 's';
                confetti.style.backgroundColor = ['#fbbf24', '#ef7a2a', '#2866c8', '#10b981'][Math.floor(Math.random() * 4)];
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 50);
        }
    }

    // Error Handling
    showError(data) {
        const result = document.getElementById('result');
        result.innerHTML = `
            <div class="error">
                <h3>
                    <i class="fas fa-exclamation-triangle icon-lg"></i>
                    Erro
                </h3>
                <p><strong>${data.message}</strong></p>
                ${data.details ? `<div class="error-details">${data.details}</div>` : ''}
            </div>
        `;
        result.style.display = 'block';
        this.showToast(data.message, 'error');
    }
}

// Inicializar a aplicação
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new EcommerceApp();
});

// Funções globais para compatibilidade
function searchProducts(query) {
    app.searchProducts(query);
}

function applyFilters() {
    app.applyFilters();
}

function clearFilters() {
    app.clearFilters();
}

function updatePriceRange() {
    app.updatePriceRange();
}

function toggleSidebar() {
    app.toggleSidebar();
}

function addToCartIndividual(productId) {
    app.addToCartIndividual(productId);
}

function removeFromCart(productId) {
    app.removeFromCart(productId);
}

function addToCart() {
    app.addToCart();
}

function clearCart() {
    app.clearCart();
}

function showCartSummary() {
    app.showCartSummary();
}

function closeCartSidebar() {
    app.closeCartSidebar();
}

function closeSuccessModal() {
    app.closeSuccessModal();
} 