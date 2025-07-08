@echo off
echo ========================================
echo    Verificando XAMPP - E-commerce
echo ========================================
echo.

echo [1/3] Verificando se o Apache esta rodando...
curl -s http://localhost/ >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Apache nao esta rodando!
    echo.
    echo Para iniciar o XAMPP:
    echo 1. Abra o XAMPP Control Panel
    echo 2. Clique em "Start" no Apache
    echo 3. Aguarde a mensagem "Running"
    echo.
    pause
    exit /b 1
)
echo ✓ Apache esta rodando

echo.
echo [2/3] Verificando se o projeto esta acessivel...
curl -s http://localhost/crpmango/frontend/ >nul 2>&1
if %errorlevel% neq 0 (
    echo AVISO: Projeto nao encontrado em /crpmango/frontend/
    echo Verifique se os arquivos estao na pasta correta do XAMPP
) else (
    echo ✓ Projeto encontrado
)

echo.
echo [3/3] Testando acesso ao frontend...
echo Tentando acessar: http://localhost/crpmango/frontend/
echo.
echo Se o navegador nao abrir automaticamente, acesse manualmente.
echo.
pause

start http://localhost/crpmango/frontend/

echo.
echo ========================================
echo    Verificacao concluida!
echo ========================================
echo.
pause 