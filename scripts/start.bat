@echo off
echo ========================================
echo    E-commerce FakeStore API Integration
echo ========================================
echo.

echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js encontrado

echo.
echo [2/4] Verificando PHP...
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo AVISO: PHP nao encontrado no PATH
    echo O frontend pode nao funcionar corretamente
    echo Considere instalar XAMPP ou configurar o PHP
) else (
    echo ✓ PHP encontrado
)

echo.
echo [3/4] Instalando dependencias do backend...
cd backend
if not exist node_modules (
    echo Instalando dependencias...
    npm install
    if %errorlevel% neq 0 (
        echo ERRO: Falha ao instalar dependencias!
        pause
        exit /b 1
    )
) else (
    echo ✓ Dependencias ja instaladas
)

echo.
echo [4/4] Iniciando servicos...
echo.

echo Iniciando Backend (Node.js)...
start "Backend - Node.js" cmd /k "cd backend && npm start"

echo Aguardando backend inicializar...
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo    Servicos iniciados com sucesso!
echo ========================================
echo.
echo Frontend (XAMPP): http://localhost/crpmango/frontend/
echo Frontend (PHP):   http://localhost:8000
echo Backend:          http://localhost:3000
echo.
echo IMPORTANTE: Certifique-se de que o XAMPP Apache esta rodando!
echo.
echo Pressione qualquer tecla para abrir o frontend...
pause >nul

start http://localhost/crpmango/frontend/

echo.
echo Para parar os servicos, feche as janelas do terminal
echo ou pressione Ctrl+C em cada uma delas.
echo.
pause 