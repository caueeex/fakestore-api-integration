@echo off
echo ========================================
echo    Integracao FakeStore API - XAMPP
echo ========================================
echo.

echo [1/4] Verificando XAMPP...
if not exist "C:\xampp\htdocs" (
    echo ERRO: XAMPP nao encontrado em C:\xampp
    echo Por favor, instale o XAMPP: https://www.apachefriends.org/
    pause
    exit /b 1
)
echo XAMPP encontrado!

echo.
echo [2/4] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js: https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js encontrado!

echo.
echo [3/4] Instalando dependencias do backend...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)
echo Dependencias instaladas com sucesso!

echo.
echo [4/4] Iniciando servidor backend...
echo.
echo ========================================
echo    URLs de Acesso:
echo ========================================
echo Frontend: http://localhost/crpmango/frontend/
echo Backend:  http://localhost:3000
echo Health:   http://localhost:3000/api/health
echo ========================================
echo.
echo Pressione Ctrl+C para parar o servidor
echo.
npm start 