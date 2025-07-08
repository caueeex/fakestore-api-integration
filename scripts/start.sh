#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo -e "    E-commerce FakeStore API Integration"
echo -e "========================================${NC}"
echo

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "${YELLOW}[1/4] Verificando Node.js...${NC}"
if ! command_exists node; then
    echo -e "${RED}ERRO: Node.js não encontrado!${NC}"
    echo "Por favor, instale o Node.js em: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js encontrado${NC}"

echo
echo -e "${YELLOW}[2/4] Verificando PHP...${NC}"
if ! command_exists php; then
    echo -e "${YELLOW}AVISO: PHP não encontrado${NC}"
    echo "O frontend pode não funcionar corretamente"
    echo "Considere instalar PHP ou usar XAMPP"
else
    echo -e "${GREEN}✓ PHP encontrado${NC}"
fi

echo
echo -e "${YELLOW}[3/4] Instalando dependências do backend...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências..."
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}ERRO: Falha ao instalar dependências!${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Dependências já instaladas${NC}"
fi

echo
echo -e "${YELLOW}[4/4] Iniciando serviços...${NC}"
echo

# Função para limpar processos ao sair
cleanup() {
    echo -e "\n${YELLOW}Parando serviços...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

echo -e "${BLUE}Iniciando Backend (Node.js)...${NC}"
cd backend
npm start &
BACKEND_PID=$!

echo "Aguardando backend inicializar..."
sleep 3

echo
echo -e "${GREEN}========================================"
echo -e "    Serviços iniciados com sucesso!"
echo -e "========================================${NC}"
echo
echo -e "Frontend (XAMPP): ${BLUE}http://localhost/crpmango/frontend/${NC}"
echo -e "Frontend (PHP):   ${BLUE}http://localhost:8000${NC}"
echo -e "Backend:          ${BLUE}http://localhost:3000${NC}"
echo
echo -e "${YELLOW}IMPORTANTE: Certifique-se de que o XAMPP Apache está rodando!${NC}"
echo
echo -e "${YELLOW}Pressione Ctrl+C para parar os serviços${NC}"

# Abrir navegador (se disponível)
if command_exists xdg-open; then
    xdg-open http://localhost/crpmango/frontend/ 2>/dev/null &
elif command_exists open; then
    open http://localhost/crpmango/frontend/ 2>/dev/null &
fi

# Aguardar indefinidamente
wait 