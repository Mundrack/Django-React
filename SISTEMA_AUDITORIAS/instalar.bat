@echo off
title Sistema de Auditorias ISO 27701 - Instalacion

echo.
echo ================================================================
echo    SISTEMA DE AUDITORIAS ISO 27701 - INSTALACION
echo    Mateo Puga - UDLA
echo ================================================================
echo.

:: Verificar Python
echo [1/6] Verificando Python...
python --version > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python no esta instalado. Instala Python 3.10+
    echo Descarga desde: https://www.python.org/downloads/
    pause
    exit /b 1
)
echo [OK] Python encontrado

:: Verificar Node.js
echo [2/6] Verificando Node.js...
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado. Instala Node.js 18+
    echo Descarga desde: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js encontrado

:: Instalar dependencias Backend
echo.
echo [3/6] Instalando dependencias del Backend...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Error instalando dependencias de Python
    pause
    exit /b 1
)
echo [OK] Dependencias Backend instaladas
cd ..

:: Instalar dependencias Frontend
echo.
echo [4/6] Instalando dependencias del Frontend...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error instalando dependencias de Node.js
    pause
    exit /b 1
)
echo [OK] Dependencias Frontend instaladas
cd ..

:: Migraciones de base de datos
echo.
echo [5/6] Aplicando migraciones de base de datos...
cd backend
python manage.py migrate --run-syncdb
if %errorlevel% neq 0 (
    echo [ERROR] Error en migraciones
    pause
    exit /b 1
)
echo [OK] Migraciones aplicadas
cd ..

:: Seed de datos
echo.
echo [6/6] Creando datos iniciales...
cd backend
python manage.py seed_iso27701
python manage.py seed_demo_data
echo [OK] Datos iniciales creados
cd ..

echo.
echo ================================================================
echo    INSTALACION COMPLETADA
echo ================================================================
echo.
echo Para iniciar el sistema, ejecuta: iniciar.bat
echo.
echo Credenciales de prueba:
echo   - Admin: admin@demo.com / admin123
echo   - Gerente: gerente@demo.com / demo123
echo   - Auditor: auditor@demo.com / demo123
echo.
echo ================================================================
pause