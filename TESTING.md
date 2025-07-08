# 🧪 Guia de Testes - E-commerce FakeStore API

Este documento descreve como testar a aplicação e-commerce de forma completa.

## 📋 Índice

- [Testes Manuais](#testes-manuais)
- [Testes de API](#testes-de-api)
- [Testes de Interface](#testes-de-interface)
- [Testes de Erro](#testes-de-erro)
- [Testes de Performance](#testes-de-performance)
- [Checklist de Testes](#checklist-de-testes)

## 🔧 Testes Manuais

### 1. Teste de Instalação

```bash
# Verificar Node.js
node --version  # Deve ser >= 18.0.0

# Verificar NPM
npm --version   # Deve ser >= 8.0.0

# Verificar PHP
php --version   # Deve ser >= 7.4.0

# Instalar dependências
cd backend
npm install
```

### 2. Teste de Inicialização

```bash
# Iniciar backend
cd backend
npm start

# Em outro terminal, iniciar frontend
cd frontend
php -S localhost:8000
```

**Resultado esperado:**
- Backend rodando em http://localhost:3000
- Frontend rodando em http://localhost:8000
- Sem erros no console

## 📡 Testes de API

### 1. Teste de Health Check

```bash
curl http://localhost:3000/api/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-08T10:30:00.000Z",
  "uptime": 3600
}
```

### 2. Teste de Listagem de Produtos

```bash
curl http://localhost:3000/api/products
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Produtos obtidos com sucesso!",
  "products": [
    {
      "id": 1,
      "title": "Fjallraven - Foldsack No. 1 Backpack",
      "price": 109.95,
      "description": "Your perfect pack for everyday use...",
      "category": "men's clothing",
      "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
      "rating": {
        "rate": 3.9,
        "count": 120
      }
    }
  ],
  "total": 20
}
```

### 3. Teste de Adição ao Carrinho (Sem Produtos)

```bash
curl -X POST http://localhost:3000/api/add-to-cart \
  -H "Content-Type: application/json"
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Produtos adicionados ao carrinho com sucesso!",
  "cartId": 1,
  "products": [
    {
      "id": 1,
      "title": "Fjallraven - Foldsack No. 1 Backpack",
      "price": 109.95
    },
    {
      "id": 2,
      "title": "Mens Casual Premium Slim Fit T-Shirts",
      "price": 22.3
    },
    {
      "id": 3,
      "title": "Mens Cotton Jacket",
      "price": 55.99
    }
  ]
}
```

### 4. Teste de Adição ao Carrinho (Com Produtos Específicos)

```bash
curl -X POST http://localhost:3000/api/add-to-cart \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      {"id": 1, "quantity": 1},
      {"id": 2, "quantity": 2}
    ]
  }'
```

## 🖥️ Testes de Interface

### 1. Teste de Carregamento da Página

1. Acesse http://localhost:8000
2. Verifique se a página carrega sem erros
3. Verifique se o header está visível
4. Verifique se o footer está visível

### 2. Teste de Carregamento de Produtos

1. Clique no botão "🔄 Carregar Produtos"
2. Verifique se os produtos aparecem em grid
3. Verifique se as imagens carregam
4. Verifique se os preços estão formatados
5. Verifique se as avaliações aparecem

### 3. Teste de Seleção de Produtos

1. Clique em "Adicionar ao Carrinho" em um produto
2. Verifique se o contador do carrinho aumenta
3. Verifique se o botão muda para "Remover do Carrinho"
4. Teste selecionar até 3 produtos
5. Verifique se não é possível selecionar mais de 3

### 4. Teste do Carrinho

1. Clique no ícone do carrinho no header
2. Verifique se o sidebar abre
3. Verifique se os produtos selecionados aparecem
4. Verifique se o total está correto
5. Teste remover produtos do carrinho
6. Teste limpar o carrinho

### 5. Teste de Finalização da Compra

1. Selecione produtos
2. Clique em "Finalizar Compra"
3. Verifique se o modal de sucesso aparece
4. Verifique se as informações estão corretas
5. Teste os botões do modal

### 6. Teste de Busca

1. Digite no campo de busca
2. Verifique se os produtos são filtrados
3. Teste busca por nome
4. Teste busca por categoria
5. Teste busca vazia

## ❌ Testes de Erro

### 1. Teste de Backend Offline

1. Pare o servidor backend
2. Tente carregar produtos
3. Verifique se a mensagem de erro aparece
4. Verifique se o usuário é informado do problema

### 2. Teste de API Externa Offline

1. Simule erro na FakeStore API
2. Tente adicionar ao carrinho
3. Verifique se o erro é tratado
4. Verifique se a mensagem é clara

### 3. Teste de Validação

1. Tente selecionar mais de 3 produtos
2. Verifique se a validação funciona
3. Teste campos vazios
4. Teste dados inválidos

## ⚡ Testes de Performance

### 1. Teste de Tempo de Carregamento

```bash
# Medir tempo de resposta da API
time curl http://localhost:3000/api/products

# Medir tempo de carregamento da página
# Use as ferramentas de desenvolvedor do navegador
```

**Métricas esperadas:**
- API: < 2 segundos
- Página: < 3 segundos
- Imagens: < 1 segundo cada

### 2. Teste de Responsividade

1. Teste em diferentes resoluções:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)

2. Verifique se o layout se adapta
3. Verifique se os botões são clicáveis
4. Verifique se o texto é legível

## ✅ Checklist de Testes

### Funcionalidades Básicas
- [ ] Página carrega sem erros
- [ ] Produtos são exibidos corretamente
- [ ] Seleção de produtos funciona
- [ ] Carrinho funciona
- [ ] Finalização de compra funciona
- [ ] Busca funciona

### Interface
- [ ] Design responsivo
- [ ] Animações suaves
- [ ] Feedback visual claro
- [ ] Estados de loading
- [ ] Mensagens de erro claras

### API
- [ ] Health check funciona
- [ ] Listagem de produtos funciona
- [ ] Adição ao carrinho funciona
- [ ] Tratamento de erros funciona
- [ ] CORS está configurado

### Performance
- [ ] Carregamento rápido
- [ ] Imagens otimizadas
- [ ] Sem vazamentos de memória
- [ ] Responsivo em mobile

### Segurança
- [ ] Validação de entrada
- [ ] Sanitização de dados
- [ ] Headers de segurança
- [ ] CORS configurado

## 🐛 Solução de Problemas

### Problema: Backend não inicia
**Solução:**
```bash
# Verificar se a porta está livre
netstat -an | findstr :3000

# Verificar dependências
cd backend
npm install

# Verificar logs
npm start
```

### Problema: Frontend não conecta
**Solução:**
```bash
# Verificar se o backend está rodando
curl http://localhost:3000/api/health

# Verificar CORS
# Verificar URL no JavaScript
```

### Problema: API externa não responde
**Solução:**
```bash
# Testar conectividade
curl https://fakestoreapi.com/products

# Verificar logs do backend
# Verificar timeout
```

## 📊 Relatório de Testes

Após executar todos os testes, preencha:

| Teste | Status | Observações |
|-------|--------|-------------|
| Instalação | ✅/❌ | |
| Inicialização | ✅/❌ | |
| API Health | ✅/❌ | |
| Listagem Produtos | ✅/❌ | |
| Adição Carrinho | ✅/❌ | |
| Interface | ✅/❌ | |
| Responsividade | ✅/❌ | |
| Performance | ✅/❌ | |
| Tratamento Erros | ✅/❌ | |

**Data do teste:** _______________
**Testado por:** _______________
**Versão:** _______________ 