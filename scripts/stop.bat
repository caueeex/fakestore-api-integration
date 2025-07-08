@echo off
echo ========================================
echo    Parando Servicos - E-commerce
echo ========================================
echo.

echo [1/2] Parando servidor Node.js...
taskkill /f /im node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Servidor Node.js parado
) else (
    echo - Nenhum servidor Node.js encontrado
)

echo.
echo [2/2] Parando servidor PHP...
taskkill /f /im php.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Servidor PHP parado
) else (
    echo - Nenhum servidor PHP encontrado
)

echo.
echo ========================================
echo    Todos os servicos foram parados!
echo ========================================
echo.
pause 