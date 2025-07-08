@echo off
echo ========================================
echo    Instalacao - E-commerce FakeStore
echo ========================================
echo.

echo [1/3] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js encontrado

echo.
echo [2/3] Verificando NPM...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: NPM nao encontrado!
    pause
    exit /b 1
)
echo ✓ NPM encontrado

echo.
echo [3/3] Instalando dependencias do backend...
cd backend
if exist node_modules (
    echo Removendo node_modules existente...
    rmdir /s /q node_modules
)

echo Instalando dependencias...
npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Instalacao concluida com sucesso!
echo ========================================
echo.
echo Para iniciar a aplicacao, execute:
echo scripts\start.bat
echo.
pause 