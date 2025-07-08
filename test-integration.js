const axios = require('axios');

async function testIntegration() {
    console.log('🧪 Testando integração com FakeStore API...\n');

    try {
        // Teste 1: Verificar se a FakeStore API está funcionando
        console.log('📡 Teste 1: Verificando conectividade com FakeStore API...');
        const productsResponse = await axios.get('https://fakestoreapi.com/products');
        console.log(`✅ API funcionando! ${productsResponse.data.length} produtos disponíveis\n`);

        // Teste 2: Verificar se o backend está rodando
        console.log('🔧 Teste 2: Verificando se o backend está rodando...');
        try {
            const healthResponse = await axios.get('http://localhost:3000/api/health');
            console.log('✅ Backend está rodando!\n');
        } catch (error) {
            console.log('❌ Backend não está rodando. Execute: cd backend && npm start\n');
            return;
        }

        // Teste 3: Testar endpoint de produtos
        console.log('📦 Teste 3: Testando endpoint de produtos...');
        try {
            const backendProductsResponse = await axios.get('http://localhost:3000/api/products');
            if (backendProductsResponse.data.success) {
                console.log(`✅ Endpoint de produtos funcionando! ${backendProductsResponse.data.total} produtos retornados\n`);
            } else {
                console.log('❌ Falha no endpoint de produtos:', backendProductsResponse.data.message);
            }
        } catch (error) {
            console.log('❌ Erro no endpoint de produtos:', error.message);
        }

        // Teste 4: Testar a funcionalidade completa (3 primeiros produtos)
        console.log('🛒 Teste 4: Testando adição ao carrinho (3 primeiros produtos)...');
        const cartResponse = await axios.post('http://localhost:3000/api/add-to-cart');
        
        if (cartResponse.data.success) {
            console.log('✅ Teste completo realizado com sucesso!');
            console.log(`📦 Carrinho criado com ID: ${cartResponse.data.cartId}`);
            console.log(`🛍️ ${cartResponse.data.products.length} produtos adicionados`);
        } else {
            console.log('❌ Falha no teste:', cartResponse.data.message);
        }

        // Teste 5: Testar adição de produtos específicos
        console.log('\n🛒 Teste 5: Testando adição de produtos específicos...');
        const specificProductsResponse = await axios.post('http://localhost:3000/api/add-to-cart', {
            products: [
                { id: 1, quantity: 1 },
                { id: 2, quantity: 2 }
            ]
        });
        
        if (specificProductsResponse.data.success) {
            console.log('✅ Teste de produtos específicos realizado com sucesso!');
            console.log(`📦 Carrinho criado com ID: ${specificProductsResponse.data.cartId}`);
            console.log(`🛍️ ${specificProductsResponse.data.products.length} produtos adicionados`);
        } else {
            console.log('❌ Falha no teste de produtos específicos:', specificProductsResponse.data.message);
        }

    } catch (error) {
        console.error('❌ Erro durante o teste:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Dica: Certifique-se de que o backend está rodando em http://localhost:3000');
        }
    }
}

// Executar o teste
testIntegration(); 