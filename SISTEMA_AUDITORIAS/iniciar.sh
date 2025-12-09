#!/bin/bash

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║       SISTEMA DE AUDITORÍAS ISO 27701 - INICIANDO               ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "Deteniendo servidores..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

# Iniciar Backend
echo "Iniciando Backend (Django)..."
cd backend
python3 manage.py runserver &
BACKEND_PID=$!
cd ..

# Esperar un poco
sleep 3

# Iniciar Frontend
echo "Iniciando Frontend (React)..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║              🚀 SISTEMA INICIADO                                ║"
echo "╠══════════════════════════════════════════════════════════════════╣"
echo "║                                                                  ║"
echo "║  Backend:  http://localhost:8000                                ║"
echo "║  Frontend: http://localhost:3000                                ║"
echo "║                                                                  ║"
echo "║  Presiona Ctrl+C para detener los servidores                   ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Abrir navegador (funciona en la mayoría de sistemas)
sleep 5
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v open &> /dev/null; then
    open http://localhost:3000
fi

# Esperar a que terminen los procesos
wait
