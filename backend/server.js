const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Função para obter a data atual no formato YYYY-MM-DD
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Função para montar o payload do carrinho
function buildCartPayload(products) {
    const cartProducts = products.map(product => ({
        productId: product.id,
        quantity: 1 // Quantidade padrão de 1 para cada produto
    }));

    return {
        userId: 1,
        date: getCurrentDate(),
        products: cartProducts
    };
}

// Rota principal para adicionar produtos ao carrinho
app.post('/api/add-to-cart', async (req, res) => {
    try {
        console.log('🚀 Iniciando processo de adição ao carrinho...');

        let productsToAdd = [];
        const { products } = req.body;

        if (products && Array.isArray(products) && products.length > 0) {
            // Se produtos foram enviados no body, usar eles
            console.log(`📦 ${products.length} produtos recebidos no body da requisição`);
            productsToAdd = products;
        } else {
            // Caso contrário, buscar produtos da API e pegar os 3 primeiros
            console.log('📡 Fazendo requisição GET para https://fakestoreapi.com/products...');
            const productsResponse = await axios.get('https://fakestoreapi.com/products');
            
            if (!productsResponse.data || !Array.isArray(productsResponse.data)) {
                throw new Error('Resposta inválida da API de produtos');
            }

            console.log(`✅ ${productsResponse.data.length} produtos obtidos com sucesso`);

            // Pegar os 3 primeiros produtos
            const firstThreeProducts = productsResponse.data.slice(0, 3);
            console.log('📦 Produtos selecionados:', firstThreeProducts.map(p => ({ id: p.id, title: p.title })));
            
            productsToAdd = firstThreeProducts.map(product => ({
                productId: product.id,
                quantity: 1
            }));
        }

        // Montar o payload do carrinho
        const cartPayload = {
            userId: 1,
            date: getCurrentDate(),
            products: productsToAdd
        };
        
        console.log('📋 Payload do carrinho:', JSON.stringify(cartPayload, null, 2));

        // Enviar payload para criar o carrinho
        console.log('🛒 Enviando requisição POST para https://fakestoreapi.com/carts...');
        const cartResponse = await axios.post('https://fakestoreapi.com/carts', cartPayload);

        console.log('✅ Carrinho criado com sucesso!');
        console.log('📄 Resposta da API:', JSON.stringify(cartResponse.data, null, 2));

        // Buscar informações completas dos produtos para retornar
        let productsInfo = [];
        if (products && Array.isArray(products) && products.length > 0) {
            // Se produtos foram enviados, buscar informações deles
            const productsResponse = await axios.get('https://fakestoreapi.com/products');
            const allProducts = productsResponse.data;
            
            productsInfo = products.map(p => {
                const productInfo = allProducts.find(ap => ap.id === p.id);
                return productInfo ? {
                    id: productInfo.id,
                    title: productInfo.title,
                    price: productInfo.price
                } : { id: p.id, title: 'Produto não encontrado', price: 0 };
            });
        } else {
            // Usar os 3 primeiros produtos
            const productsResponse = await axios.get('https://fakestoreapi.com/products');
            const firstThreeProducts = productsResponse.data.slice(0, 3);
            productsInfo = firstThreeProducts.map(p => ({
                id: p.id,
                title: p.title,
                price: p.price
            }));
        }

        // Retornar resposta de sucesso
        res.json({
            success: true,
            message: 'Produtos adicionados ao carrinho com sucesso!',
            cartId: cartResponse.data.id,
            products: productsInfo,
            cartData: cartResponse.data
        });

    } catch (error) {
        console.error('❌ Erro durante o processo:', error.message);
        
        let errorMessage = 'Erro interno do servidor';
        let errorType = 'INTERNAL_ERROR';

        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            errorMessage = 'Erro de conexão com a API externa';
            errorType = 'CONNECTION_ERROR';
        } else if (error.response) {
            // Erro de resposta da API
            errorMessage = `Erro na API: ${error.response.status} - ${error.response.statusText}`;
            errorType = 'API_ERROR';
            console.error('📡 Detalhes da resposta de erro:', error.response.data);
        } else if (error.request) {
            // Erro de requisição
            errorMessage = 'Erro na requisição para a API externa';
            errorType = 'REQUEST_ERROR';
        }

        res.status(500).json({
            success: false,
            message: errorMessage,
            errorType: errorType,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Rota para buscar produtos da FakeStore API
app.get('/api/products', async (req, res) => {
    try {
        console.log('📡 Buscando produtos da FakeStore API...');
        
        const productsResponse = await axios.get('https://fakestoreapi.com/products');
        
        if (!productsResponse.data || !Array.isArray(productsResponse.data)) {
            throw new Error('Resposta inválida da API de produtos');
        }

        console.log(`✅ ${productsResponse.data.length} produtos obtidos com sucesso`);

        // Retornar produtos formatados
        const formattedProducts = productsResponse.data.map(product => ({
            id: product.id,
            title: product.title,
            price: product.price,
            description: product.description,
            category: product.category,
            image: product.image,
            rating: product.rating
        }));

        res.json({
            success: true,
            message: 'Produtos obtidos com sucesso!',
            products: formattedProducts,
            total: formattedProducts.length
        });

    } catch (error) {
        console.error('❌ Erro ao buscar produtos:', error.message);
        
        let errorMessage = 'Erro interno do servidor';
        let errorType = 'INTERNAL_ERROR';

        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            errorMessage = 'Erro de conexão com a API externa';
            errorType = 'CONNECTION_ERROR';
        } else if (error.response) {
            errorMessage = `Erro na API: ${error.response.status} - ${error.response.statusText}`;
            errorType = 'API_ERROR';
        } else if (error.request) {
            errorMessage = 'Erro na requisição para a API externa';
            errorType = 'REQUEST_ERROR';
        }

        res.status(500).json({
            success: false,
            message: errorMessage,
            errorType: errorType,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Rota de teste para verificar se o servidor está funcionando
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Backend funcionando corretamente',
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 Endpoint principal: http://localhost:${PORT}/api/add-to-cart`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
}); 