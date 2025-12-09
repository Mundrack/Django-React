#!/bin/bash

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║       SISTEMA DE AUDITORÍAS ISO 27701 - INSTALACIÓN             ║"
echo "║                 Mateo Puga - UDLA                                ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar Python
echo "[1/6] Verificando Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 no está instalado. Por favor instálalo."
    exit 1
fi
echo "✅ Python encontrado: $(python3 --version)"

# Verificar Node.js
echo "[2/6] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo."
    exit 1
fi
echo "✅ Node.js encontrado: $(node --version)"

# Instalar dependencias Backend
echo ""
echo "[3/6] Instalando dependencias del Backend..."
cd backend
pip3 install -r requirements.txt --quiet
if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias de Python"
    exit 1
fi
echo "✅ Dependencias Backend instaladas"
cd ..

# Instalar dependencias Frontend
echo ""
echo "[4/6] Instalando dependencias del Frontend..."
cd frontend
npm install --silent
if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias de Node.js"
    exit 1
fi
echo "✅ Dependencias Frontend instaladas"
cd ..

# Migraciones de base de datos
echo ""
echo "[5/6] Aplicando migraciones de base de datos..."
cd backend
python3 manage.py migrate --run-syncdb
if [ $? -ne 0 ]; then
    echo "❌ Error en migraciones"
    exit 1
fi
echo "✅ Migraciones aplicadas"
cd ..

# Seed de datos
echo ""
echo "[6/6] Creando datos iniciales..."
cd backend
python3 manage.py seed_iso27701
python3 manage.py seed_demo_data
echo "✅ Datos iniciales creados"
cd ..

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║              ✅ INSTALACIÓN COMPLETADA                          ║"
echo "╠══════════════════════════════════════════════════════════════════╣"
echo "║                                                                  ║"
echo "║  Para iniciar el sistema, ejecuta: ./iniciar.sh                 ║"
echo "║                                                                  ║"
echo "║  Credenciales de prueba:                                        ║"
echo "║    • Admin: admin@demo.com / admin123                           ║"
echo "║    • Gerente: gerente@demo.com / demo123                        ║"
echo "║    • Auditor: auditor@demo.com / demo123                        ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
