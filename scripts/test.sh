#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo -e "    Testes - E-commerce FakeStore"
echo -e "========================================${NC}"
echo

echo -e "${YELLOW}[1/4] Verificando se o backend está rodando...${NC}"
if curl -s http://localhost:3000/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend está rodando${NC}"
else
    echo -e "${RED}ERRO: Backend não está rodando!${NC}"
    echo "Execute ./scripts/start.sh primeiro"
    exit 1
fi

echo
echo -e "${YELLOW}[2/4] Testando endpoint de produtos...${NC}"
if curl -s http://localhost:3000/api/products >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Endpoint de produtos funciona${NC}"
else
    echo -e "${RED}ERRO: Endpoint de produtos não responde!${NC}"
    exit 1
fi

echo
echo -e "${YELLOW}[3/4] Testando adição ao carrinho...${NC}"
if curl -s -X POST http://localhost:3000/api/add-to-cart -H "Content-Type: application/json" >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Endpoint de carrinho funciona${NC}"
else
    echo -e "${RED}ERRO: Endpoint de carrinho não responde!${NC}"
    exit 1
fi

echo
echo -e "${YELLOW}[4/4] Testando conectividade com API externa...${NC}"
if curl -s https://fakestoreapi.com/products >/dev/null 2>&1; then
    echo -e "${GREEN}✓ API externa acessível${NC}"
else
    echo -e "${YELLOW}AVISO: API externa não acessível${NC}"
    echo "Verifique sua conexão com a internet"
fi

echo
echo -e "${GREEN}========================================"
echo -e "    Todos os testes passaram!"
echo -e "========================================${NC}"
echo
echo -e "Para acessar a aplicação:"
echo -e "Frontend (XAMPP): ${BLUE}http://localhost/crpmango/frontend/${NC}"
echo -e "Frontend (PHP):   ${BLUE}http://localhost:8000${NC}"
echo -e "Backend:          ${BLUE}http://localhost:3000${NC}"
echo 