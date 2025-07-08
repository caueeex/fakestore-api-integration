#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo -e "    Parando Serviços - E-commerce"
echo -e "========================================${NC}"
echo

echo -e "${YELLOW}[1/2] Parando servidor Node.js...${NC}"
pkill -f "node.*server.js" 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Servidor Node.js parado${NC}"
else
    echo -e "${YELLOW}- Nenhum servidor Node.js encontrado${NC}"
fi

echo
echo -e "${YELLOW}[2/2] Parando servidor PHP...${NC}"
pkill -f "php.*-S.*localhost:8000" 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Servidor PHP parado${NC}"
else
    echo -e "${YELLOW}- Nenhum servidor PHP encontrado${NC}"
fi

echo
echo -e "${GREEN}========================================"
echo -e "    Todos os serviços foram parados!"
echo -e "========================================${NC}"
echo 