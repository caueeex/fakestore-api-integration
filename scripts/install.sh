#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo -e "    Instalação - E-commerce FakeStore"
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
echo -e "${YELLOW}[2/4] Verificando NPM...${NC}"
if ! command_exists npm; then
    echo -e "${RED}ERRO: NPM não encontrado!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ NPM encontrado${NC}"

echo
echo -e "${YELLOW}[3/4] Verificando PHP...${NC}"
if ! command_exists php; then
    echo -e "${YELLOW}AVISO: PHP não encontrado${NC}"
    echo "O frontend pode não funcionar corretamente"
    echo "Considere instalar PHP ou usar XAMPP"
else
    echo -e "${GREEN}✓ PHP encontrado${NC}"
fi

echo
echo -e "${YELLOW}[4/4] Instalando dependências do backend...${NC}"
cd backend
if [ -d "node_modules" ]; then
    echo "Removendo node_modules existente..."
    rm -rf node_modules
fi

echo "Instalando dependências..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}ERRO: Falha ao instalar dependências!${NC}"
    exit 1
fi

echo
echo -e "${GREEN}========================================"
echo -e "    Instalação concluída com sucesso!"
echo -e "========================================${NC}"
echo
echo -e "Para iniciar a aplicação, execute:"
echo -e "${BLUE}./scripts/start.sh${NC}"
echo 