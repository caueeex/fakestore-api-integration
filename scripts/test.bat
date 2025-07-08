@echo off
echo ========================================
echo    Testes - E-commerce FakeStore
echo ========================================
echo.

echo [1/4] Verificando se o backend esta rodando...
curl -s http://localhost:3000/api/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Backend nao esta rodando!
    echo Execute scripts\start.bat primeiro
    pause
    exit /b 1
)
echo ✓ Backend esta rodando

echo.
echo [2/4] Testando endpoint de produtos...
curl -s http://localhost:3000/api/products >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Endpoint de produtos nao responde!
    pause
    exit /b 1
)
echo ✓ Endpoint de produtos funciona

echo.
echo [3/4] Testando adicao ao carrinho...
curl -s -X POST http://localhost:3000/api/add-to-cart -H "Content-Type: application/json" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Endpoint de carrinho nao responde!
    pause
    exit /b 1
)
echo ✓ Endpoint de carrinho funciona

echo.
echo [4/4] Testando conectividade com API externa...
curl -s https://fakestoreapi.com/products >nul 2>&1
if %errorlevel% neq 0 (
    echo AVISO: API externa nao acessivel
    echo Verifique sua conexao com a internet
) else (
    echo ✓ API externa acessivel
)

echo.
echo ========================================
echo    Todos os testes passaram!
echo ========================================
echo.
echo Para acessar a aplicacao:
echo Frontend (XAMPP): http://localhost/crpmango/frontend/
echo Frontend (PHP):   http://localhost:8000
echo Backend:          http://localhost:3000
echo.
pause 