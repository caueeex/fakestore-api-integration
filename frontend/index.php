<?php include 'config.php'; ?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $config['project_name']; ?> - E-commerce</title>
    <link rel="stylesheet" href="./css/style.css">
    <!-- Icon Libraries -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
</head>
<body>
    <div class="main-header">
        <div class="header-container">
            <div class="logo-section">
                <a href="index.php" class="logo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6a2 2 0 0 0-2 2v2h16a2 2 0 0 0 2-2V2H6"/><path d="M16 10H8"/><path d="M16 14H8"/><path d="M10 6H6"/><path d="M10 10H6"/><path d="M10 14H6"/></svg>
                    <?php echo $config['project_name']; ?>
                </a>
            </div>
            <div class="search-section">
                <div class="search-container">
                    <input type="text" class="search-input" placeholder="Pesquisar produtos..." onkeyup="searchProducts(this.value)">
                    <i class="fas fa-search search-icon"></i>
                </div>
            </div>
            <div class="header-actions">
                <button class="cart-button" id="cartBtn">
                    <i class="fas fa-shopping-cart icon-lg"></i>
                    <span class="cart-text">Carrinho</span>
                    <span class="cart-counter" id="cartCounter" style="display: none;">0</span>
                </button>
                <button class="user-button">
                    <i class="fas fa-user icon-lg"></i>
                </button>
            </div>
        </div>
    </div>

    <div class="header">
        <h1>
            <i class="fas fa-shopping-bag icon-xl"></i>
            <?php echo $config['project_name']; ?>
        </h1>
        <p>Explore produtos e adicione ao carrinho com integração completa da FakeStore API</p>
    </div>

    <div class="container">
        <div class="controls">
            <button class="btn" id="loadProductsBtn" onclick="loadProducts()">
                <i class="fas fa-box icon-md"></i>
                Carregar Produtos
            </button>
            <button class="btn btn-secondary" id="addToCartBtn" onclick="addToCart()" disabled>
                <i class="fas fa-cart-plus icon-md"></i>
                Adicionar ao Carrinho
            </button>
            <?php if (!checkBackendStatus()): ?>
                <div style="background: #fef3c7; color: #92400e; padding: 12px; border-radius: 8px; margin-top: 1rem;">
                    <i class="fas fa-exclamation-triangle icon-md"></i>
                    <strong>Atenção:</strong> O backend não está rodando. Execute o script start.bat primeiro.
                </div>
            <?php endif; ?>
        </div>

        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p>Carregando produtos...</p>
        </div>

        <div class="stats" id="stats" style="display: none;">
            <div class="stat-card">
                <div class="stat-number" id="totalProducts">0</div>
                <div class="stat-label">Total de Produtos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="totalCategories">0</div>
                <div class="stat-label">Categorias</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="avgPrice">R$ 0</div>
                <div class="stat-label">Preço Médio</div>
            </div>
        </div>

        <div class="products-grid" id="productsGrid"></div>

        <div class="result" id="result"></div>
    </div>

    <!-- Overlay do Carrinho -->
    <div class="cart-overlay" id="cartOverlay" onclick="closeCartSidebar()"></div>

    <!-- Sidebar do Carrinho -->
    <div class="cart-sidebar" id="cartSidebar">
        <div class="cart-sidebar-header">
            <div class="cart-sidebar-title">
                <i class="fas fa-shopping-cart icon-md"></i>
                Carrinho
                <span class="cart-counter" id="sidebarCartCounter" style="display: none;">0</span>
            </div>
            <button class="cart-sidebar-close" onclick="closeCartSidebar()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div class="cart-sidebar-content" id="cartSidebarContent">
            <!-- Conteúdo do carrinho será inserido aqui -->
        </div>
        
        <div class="cart-sidebar-footer" id="cartSidebarFooter" style="display: none;">
            <div class="cart-total">
                <span class="cart-total-label">Total:</span>
                <span class="cart-total-value" id="cartTotalValue">R$ 0,00</span>
            </div>
            <div class="cart-sidebar-actions">
                <button class="cart-sidebar-btn cart-sidebar-btn-primary" onclick="addToCart()" id="sidebarCheckoutBtn">
                    <i class="fas fa-check icon-md"></i>
                    Finalizar Compra
                </button>
                <button class="cart-sidebar-btn cart-sidebar-btn-secondary" onclick="clearCart()">
                    <i class="fas fa-trash icon-md"></i>
                    Limpar
                </button>
            </div>
        </div>
    </div>

    <!-- Modal de Sucesso -->
    <div class="success-modal" id="successModal">
        <div class="success-modal-content">
            <div style="text-align:center; margin-bottom: 0.5rem;">
                <i class="fas fa-check-circle" style="font-size: 4rem; color: #22c55e;"></i>
            </div>
            <div class="success-title">Compra Efetuada com Sucesso!</div>
            <div class="success-message">
                Sua compra foi processada e adicionada ao carrinho. 
                Obrigado por escolher nossos produtos!
            </div>
            
            <div class="success-details" id="successDetails">
                <!-- Detalhes da compra serão inseridos aqui -->
            </div>
            
            <div class="success-modal-actions">
                <button class="success-modal-btn success-modal-btn-primary" onclick="closeSuccessModal()">
                    <i class="fas fa-shopping-cart icon-md"></i>
                    Continuar Comprando
                </button>
                <button class="success-modal-btn success-modal-btn-secondary" onclick="closeSuccessModal()">
                    <i class="fas fa-times icon-md"></i>
                    Fechar
                </button>
            </div>
        </div>
    </div>

    <script>
        let products = [];
        let selectedProducts = [];
        let filteredProducts = [];

        async function loadProducts() {
            const btn = document.getElementById('loadProductsBtn');
            const loading = document.getElementById('loading');
            const productsGrid = document.getElementById('productsGrid');
            const stats = document.getElementById('stats');

            btn.disabled = true;
            loading.style.display = 'block';
            productsGrid.innerHTML = '';

            try {
                const response = await fetch('<?php echo getBackendUrl("/api/products"); ?>');
                const data = await response.json();

                if (data.success) {
                    products = data.products;
                    filteredProducts = [...products]; // Inicializar produtos filtrados
                    selectedProducts = []; // Reset seleção
                    displayProducts(filteredProducts);
                    displayStats(filteredProducts);
                    updateCartCounter(); // Inicializar contador
                } else {
                    showError(data);
                }
            } catch (error) {
                showError({
                    message: 'Erro de conexão com o servidor',
                    errorType: 'CONNECTION_ERROR',
                    details: error.message
                });
            } finally {
                btn.disabled = false;
                loading.style.display = 'none';
            }
        }

        function searchProducts(query) {
            if (!query.trim()) {
                filteredProducts = [...products];
            } else {
                const searchTerm = query.toLowerCase();
                filteredProducts = products.filter(product => 
                    product.title.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm)
                );
            }
            displayProducts(filteredProducts);
            displayStats(filteredProducts);
        }

        function displayProducts(productsToShow) {
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
                const card = document.createElement('div');
                card.className = 'product-card';
                
                const stars = '★'.repeat(Math.floor(product.rating?.rate || 0)) + '☆'.repeat(5 - Math.floor(product.rating?.rate || 0));
                const isInCart = selectedProducts.find(p => p.id === product.id);
                
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.title}" class="product-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjFGNUY5Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NDc0OEEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW0gbsOjbyBkaXNwb27DrXZlbDwvdGV4dD4KPC9zdmc+'">
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
                                `<button class="btn-remove-from-cart" onclick="removeFromCart(${product.id})">
                                    <i class="fas fa-trash icon-sm"></i>
                                    Remover
                                </button>` :
                                `<button class="btn-add-to-cart" onclick="addToCartIndividual(${product.id})" ${selectedProducts.length >= 3 ? 'disabled' : ''}>
                                    <i class="fas fa-cart-plus icon-sm"></i>
                                    Adicionar
                                </button>`
                            }
                        </div>
                    </div>
                `;
                
                grid.appendChild(card);
            });
        }

        function displayStats(products) {
            const categories = [...new Set(products.map(p => p.category))];
            const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
            
            document.getElementById('totalProducts').textContent = products.length;
            document.getElementById('totalCategories').textContent = categories.length;
            document.getElementById('avgPrice').textContent = `R$ ${avgPrice.toFixed(2)}`;
            document.getElementById('stats').style.display = 'grid';
        }

        function addToCartIndividual(productId) {
            if (selectedProducts.length >= 3) {
                alert('Máximo de 3 produtos permitidos!');
                return;
            }

            const product = products.find(p => p.id === productId);
            if (product && !selectedProducts.find(p => p.id === productId)) {
                selectedProducts.push(product);
                updateCartCounter();
                displayProducts(filteredProducts); // Re-render para atualizar botões
                
                // Se o sidebar estiver aberto, atualizar o conteúdo
                const sidebar = document.getElementById('cartSidebar');
                if (sidebar.classList.contains('open')) {
                    openCartSidebar();
                }
            }
        }

        function removeFromCart(productId) {
            const index = selectedProducts.findIndex(p => p.id === productId);
            if (index > -1) {
                selectedProducts.splice(index, 1);
                updateCartCounter();
                displayProducts(filteredProducts); // Re-render para atualizar botões
                
                // Se o sidebar estiver aberto, atualizar o conteúdo
                const sidebar = document.getElementById('cartSidebar');
                if (sidebar.classList.contains('open')) {
                    openCartSidebar();
                }
            }
        }

        function clearCart() {
            selectedProducts = [];
            updateCartCounter();
            displayProducts(filteredProducts);
            closeCartSidebar();
            document.getElementById('result').style.display = 'none';
        }

        async function addToCart() {
                            if (selectedProducts.length === 0) {
                    // Mostrar mensagem mais amigável
                    const result = document.getElementById('result');
                    result.innerHTML = `
                        <div class="error">
                            <h3>
                                <i class="fas fa-shopping-cart icon-lg"></i>
                                Carrinho Vazio
                            </h3>
                            <p><strong>Nenhum produto selecionado!</strong></p>
                            <p>Selecione pelo menos um produto para adicionar ao carrinho.</p>
                        </div>
                    `;
                    result.style.display = 'block';
                    return;
                }

                const btn = document.getElementById('addToCartBtn');
            const cartBtn = document.getElementById('cartBtn');
            const sidebarCheckoutBtn = document.getElementById('sidebarCheckoutBtn');
                const loading = document.getElementById('loading');
                const result = document.getElementById('result');

                btn.disabled = true;
            cartBtn.disabled = true;
            sidebarCheckoutBtn.disabled = true;
                loading.style.display = 'block';
                result.style.display = 'none';

                try {
                    const backendUrl = '<?php echo getBackendUrl("/api/add-to-cart"); ?>';
                    const response = await fetch(backendUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        products: selectedProducts.map(p => ({ id: p.id, quantity: 1 }))
                    })
                });

                const data = await response.json();

                if (data.success) {
                    showSuccess(data);
                    // Limpar seleção após sucesso
                    selectedProducts = [];
                    updateCartCounter();
                    displayProducts(filteredProducts); // Re-render para atualizar botões
                    closeCartSidebar(); // Fechar sidebar após sucesso
                } else {
                    showError(data);
                }
            } catch (error) {
                showError({
                    message: 'Erro de conexão com o servidor',
                    errorType: 'CONNECTION_ERROR',
                    details: error.message
                });
            } finally {
                btn.disabled = false;
                cartBtn.disabled = false;
                sidebarCheckoutBtn.disabled = false;
                loading.style.display = 'none';
            }
        }

        function showSuccess(data) {
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
                    <span class="success-total-label">Total da Compra:</span>
                    <span class="success-total-value">R$ ${totalPrice.toFixed(2)}</span>
                </div>
                ${cartInfoHtml}
            `;

            // Criar confetti
            createConfetti();

            // Mostrar modal
            successModal.classList.add('open');

            // Esconder resultado anterior
            document.getElementById('result').style.display = 'none';
        }

        function createConfetti() {
            const colors = ['#ef7a2a', '#fce1ce', '#bcd5ff', '#2866c8', '#ff9f5a', '#5a9cff'];
            
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + 'vw';
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.animationDelay = Math.random() * 3 + 's';
                    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
                    
                    document.body.appendChild(confetti);
                    
                    // Remover confetti após animação
                    setTimeout(() => {
                        if (confetti.parentNode) {
                            confetti.parentNode.removeChild(confetti);
                        }
                    }, 5000);
                }, i * 100);
            }
        }

        function closeSuccessModal() {
            const successModal = document.getElementById('successModal');
            successModal.classList.remove('open');
        }

        function showError(data) {
            const result = document.getElementById('result');
            
            let detailsHtml = '';
            if (data.details) {
                detailsHtml = `<div class="error-details">${data.details}</div>`;
            }

            result.innerHTML = `
                <div class="error">
                    <h3>
                        <i class="fas fa-exclamation-circle icon-lg"></i>
                        Erro
                    </h3>
                    <p><strong>${data.message}</strong></p>
                    <span class="status-badge status-error">${data.errorType || 'DESCONHECIDO'}</span>
                    ${detailsHtml}
                </div>
            `;
            result.style.display = 'block';
        }

        function showCartSummary() {
            openCartSidebar();
        }

        function openCartSidebar() {
            const sidebar = document.getElementById('cartSidebar');
            const overlay = document.getElementById('cartOverlay');
            const content = document.getElementById('cartSidebarContent');
            const footer = document.getElementById('cartSidebarFooter');
            
            if (selectedProducts.length === 0) {
                content.innerHTML = `
                    <div class="cart-sidebar-empty">
                        <div class="cart-sidebar-empty-icon">
                            <i class="fas fa-shopping-cart icon-3xl"></i>
                        </div>
                        <h3>Carrinho Vazio</h3>
                        <p>Nenhum produto selecionado!</p>
                        <p>Selecione pelo menos um produto para adicionar ao carrinho.</p>
                    </div>
                `;
                footer.style.display = 'none';
            } else {
                let itemsHtml = '';
                selectedProducts.forEach(product => {
                    itemsHtml += `
                        <div class="cart-item">
                            <div class="cart-item-header">
                                <div class="cart-item-title">${product.title}</div>
                                <button class="cart-item-remove" onclick="removeFromCart(${product.id})">
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
                
                const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
                document.getElementById('cartTotalValue').textContent = `R$ ${totalPrice.toFixed(2)}`;
            }
            
            sidebar.classList.add('open');
            overlay.classList.add('open');
        }

        function closeCartSidebar() {
            const sidebar = document.getElementById('cartSidebar');
            const overlay = document.getElementById('cartOverlay');
            
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
        }

        function updateCartCounter() {
            const cartCounter = document.getElementById('cartCounter');
            const sidebarCartCounter = document.getElementById('sidebarCartCounter');
            const addToCartBtn = document.getElementById('addToCartBtn');
            const cartBtn = document.getElementById('cartBtn');
            
            if (selectedProducts.length > 0) {
                cartCounter.style.display = 'inline-block';
                sidebarCartCounter.style.display = 'inline-block';
                cartCounter.textContent = selectedProducts.length;
                sidebarCartCounter.textContent = selectedProducts.length;
                addToCartBtn.disabled = false;
                cartBtn.disabled = false;
            } else {
                cartCounter.style.display = 'none';
                sidebarCartCounter.style.display = 'none';
                addToCartBtn.disabled = true;
                cartBtn.disabled = false;
            }
        }

        // Carregar produtos automaticamente se o backend estiver rodando
        if (<?php echo checkBackendStatus() ? 'true' : 'false'; ?>) {
            loadProducts();
        }

        // Adicionar evento de clique alternativo para o botão do carrinho
        document.addEventListener('DOMContentLoaded', function() {
            const cartBtn = document.getElementById('cartBtn');
            if (cartBtn) {
                cartBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showCartSummary();
                });
            }
        });

        // Fechar sidebar com tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeCartSidebar();
                closeSuccessModal();
            }
        });

        // Fechar modal ao clicar no overlay
        document.getElementById('successModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeSuccessModal();
            }
        });

        // Inicializar Lucide icons
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    </script>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-content">
                <!-- Sobre a Empresa -->
                <div class="footer-section">
                    <h3>
                        <i class="fas fa-shopping-bag"></i>
                        <?php echo $config['project_name']; ?>
                    </h3>
                    <p>
                        Sua loja online de confiança, oferecendo produtos de qualidade 
                        com integração completa da FakeStore API. Comprometidos em 
                        proporcionar a melhor experiência de compra.
                    </p>
                    <div class="footer-social">
                        <a href="#" class="social-link" title="Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" class="social-link" title="Instagram">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="#" class="social-link" title="Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" class="social-link" title="LinkedIn">
                            <i class="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                </div>

                <!-- Links Rápidos -->
                <div class="footer-section">
                    <h3>
                        <i class="fas fa-link"></i>
                        Links Rápidos
                    </h3>
                    <ul class="footer-links">
                        <li><a href="#"><i class="fas fa-home"></i>Início</a></li>
                        <li><a href="#"><i class="fas fa-box"></i>Produtos</a></li>
                        <li><a href="#"><i class="fas fa-tags"></i>Ofertas</a></li>
                        <li><a href="#"><i class="fas fa-star"></i>Destaques</a></li>
                        <li><a href="#"><i class="fas fa-shopping-cart"></i>Carrinho</a></li>
                        <li><a href="#"><i class="fas fa-heart"></i>Favoritos</a></li>
                    </ul>
                </div>

                <!-- Categorias -->
                <div class="footer-section">
                    <h3>
                        <i class="fas fa-th-large"></i>
                        Categorias
                    </h3>
                    <ul class="footer-links">
                        <li><a href="#"><i class="fas fa-tshirt"></i>Roupas</a></li>
                        <li><a href="#"><i class="fas fa-mobile-alt"></i>Eletrônicos</a></li>
                        <li><a href="#"><i class="fas fa-gem"></i>Joias</a></li>
                        <li><a href="#"><i class="fas fa-home"></i>Casa & Jardim</a></li>
                        <li><a href="#"><i class="fas fa-book"></i>Livros</a></li>
                        <li><a href="#"><i class="fas fa-gamepad"></i>Jogos</a></li>
                    </ul>
                </div>

                <!-- Contato -->
                <div class="footer-section">
                    <h3>
                        <i class="fas fa-envelope"></i>
                        Contato
                    </h3>
                    <div class="footer-contact">
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Rua das Flores, 123 - Centro, São Paulo - SP</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>(11) 9999-9999</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span>contato@<?php echo strtolower(str_replace(' ', '', $config['project_name'])); ?>.com.br</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-clock"></i>
                            <span>Seg-Sex: 8h às 18h</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <div class="footer-bottom-content">
                    <div class="footer-copyright">
                        © 2024 <?php echo $config['project_name']; ?>. Todos os direitos reservados.
                    </div>
                    <div class="footer-bottom-links">
                        <a href="#"><i class="fas fa-shield-alt"></i>Política de Privacidade</a>
                        <a href="#"><i class="fas fa-file-contract"></i>Termos de Uso</a>
                        <a href="#"><i class="fas fa-truck"></i>Política de Entrega</a>
                        <a href="#"><i class="fas fa-undo"></i>Trocas e Devoluções</a>
                        <a href="#"><i class="fas fa-question-circle"></i>Ajuda</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</body>
</html> 