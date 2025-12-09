@echo off
title Sistema de Auditorias ISO 27701 - Servidor

echo.
echo ================================================================
echo    SISTEMA DE AUDITORIAS ISO 27701 - INICIANDO
echo ================================================================
echo.

:: Iniciar Backend en nueva ventana
echo Iniciando Backend (Django)...
start "Backend - Django" cmd /k "cd backend && python manage.py runserver"

:: Esperar un poco
timeout /t 3 /nobreak > nul

:: Iniciar Frontend en nueva ventana
echo Iniciando Frontend (React)...
start "Frontend - React" cmd /k "cd frontend && npm start"

echo.
echo ================================================================
echo    SISTEMA INICIADO
echo ================================================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo El navegador se abrira automaticamente en unos segundos...
echo.
echo Para detener: cierra las ventanas de Backend y Frontend
echo ================================================================
echo.

:: Esperar a que el frontend este listo y abrir navegador
timeout /t 15 /nobreak > nul
start http://localhost:3000

pause