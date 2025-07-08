#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================"
echo -e "    Verificando XAMPP - E-commerce"
echo -e "========================================${NC}"
echo

echo -e "${YELLOW}[1/3] Verificando se o Apache está rodando...${NC}"
if curl -s http://localhost/ >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Apache está rodando${NC}"
else
    echo -e "${RED}ERRO: Apache não está rodando!${NC}"
    echo
    echo "Para iniciar o XAMPP:"
    echo "1. Abra o XAMPP Control Panel"
    echo "2. Clique em 'Start' no Apache"
    echo "3. Aguarde a mensagem 'Running'"
    echo
    exit 1
fi

echo
echo -e "${YELLOW}[2/3] Verificando se o projeto está acessível...${NC}"
if curl -s http://localhost/crpmango/frontend/ >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Projeto encontrado${NC}"
else
    echo -e "${YELLOW}AVISO: Projeto não encontrado em /crpmango/frontend/${NC}"
    echo "Verifique se os arquivos estão na pasta correta do XAMPP"
fi

echo
echo -e "${YELLOW}[3/3] Testando acesso ao frontend...${NC}"
echo -e "Tentando acessar: ${BLUE}http://localhost/crpmango/frontend/${NC}"
echo
echo -e "Se o navegador não abrir automaticamente, acesse manualmente."
echo

# Abrir navegador (se disponível)
if command_exists xdg-open; then
    xdg-open http://localhost/crpmango/frontend/ 2>/dev/null &
elif command_exists open; then
    open http://localhost/crpmango/frontend/ 2>/dev/null &
fi

echo
echo -e "${GREEN}========================================"
echo -e "    Verificação concluída!"
echo -e "========================================${NC}"
echo 