# 🔍 Sistema de Auditorías Empresariales

<div align="center">

![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white)

**Sistema web profesional para gestión de auditorías ISO con jerarquía empresarial**

[✨ Características](#-características) • [🚀 Inicio Rápido](#-inicio-rápido) • [📚 Documentación](#-documentación) • [🎯 Roadmap](#-roadmap)

</div>

---

## 📋 Descripción

Plataforma integral que permite a organizaciones realizar y gestionar auditorías de estándares internacionales (ISO 9001, ISO 27001, ISO 30000, etc.) con un sistema jerárquico de empresas matriz y filiales.

### 🎯 Problema que Resuelve

- ❌ Auditorías manuales en papel o Excel
- ❌ Falta de trazabilidad y control
- ❌ Dificultad para consolidar resultados de múltiples empresas
- ❌ Ausencia de análisis visual y comparativo

### ✅ Solución

- ✅ Digitalización completa del proceso de auditoría
- ✅ Sistema de roles y permisos granular
- ✅ Dashboards analíticos en tiempo real
- ✅ Reportes consolidados multi-empresa
- ✅ Plantillas de auditoría estandarizadas y personalizables

---

## ✨ Características

### 👥 Sistema de Roles

| Rol | Permisos |
|-----|----------|
| **🔧 Super Admin** | • Crear/eliminar empresas matriz<br>• Gestionar plantillas de auditorías<br>• Ver estadísticas globales del sistema |
| **🏢 Admin Empresarial** | • Crear/gestionar empresas filiales<br>• Realizar auditorías propias<br>• Ver resultados consolidados de todas sus filiales |
| **👤 Usuario** | • Realizar auditorías asignadas<br>• Ver resultados propios |

### 🔐 Seguridad

- ✅ Autenticación JWT con tokens de refresh
- ✅ Row Level Security (RLS) en base de datos
- ✅ Validación de permisos por rol en cada endpoint
- ✅ Protección CORS configurada
- ✅ Variables sensibles en archivos `.env`

### 📊 Funcionalidades Principales

- 📝 **Plantillas de Auditoría**: Crea plantillas reutilizables basadas en estándares ISO
- 🔄 **Auditorías en Progreso**: Sistema de guardado automático y continuación
- 📈 **Dashboards Analíticos**: Visualización de resultados con gráficos interactivos
- 🏗️ **Jerarquía Empresarial**: Empresas matriz gestionan múltiples filiales
- 📄 **Reportes Consolidados**: Comparación de resultados entre empresas
- 📎 **Adjuntos**: Carga de evidencias y documentos
- 🔔 **Sistema de Notificaciones**: Alertas de auditorías pendientes
- 📊 **Exportación**: Descarga de reportes en PDF/Excel

---

## 🏗️ Arquitectura

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   React SPA     │ ───▶ │   Django API    │ ───▶ │   Supabase      │
│  (Frontend)     │ HTTP │   (Backend)     │ SQL  │  (PostgreSQL)   │
│                 │ ◀─── │                 │ ◀─── │                 │
│  • Tailwind CSS │      │  • REST API     │      │  • Row Level    │
│  • React Router │      │  • JWT Auth     │      │    Security     │
│  • Recharts     │      │  • Supabase SDK │      │  • Real-time    │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Stack Tecnológico

**Backend**
- 🐍 Django 5.0
- 🔌 Django REST Framework
- 🔑 Simple JWT
- 🗄️ Supabase Python Client

**Frontend**
- ⚛️ React 18
- 🎨 Tailwind CSS
- 🧭 React Router v6
- 📡 Axios
- 📊 Recharts

**Base de Datos**
- 🐘 PostgreSQL (Supabase)
- 🔒 Row Level Security
- ⚡ Real-time subscriptions

---

## 🚀 Inicio Rápido

### Prerrequisitos

Asegúrate de tener instalado:

- ✅ Python 3.11 o superior
- ✅ Node.js 22 o superior
- ✅ Git
- ✅ Cuenta en [Supabase](https://supabase.com)

### 📦 Instalación

#### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/Django-React.git
cd Django-React
```

#### 2️⃣ Configurar Backend (Django)

```bash
# Navegar a la carpeta backend
cd backend

# Crear entorno virtual
py -m venv venv

# Activar entorno virtual (Windows)
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
# Crear archivo .env y agregar:
# SUPABASE_URL=tu_url
# SUPABASE_KEY=tu_key
# SECRET_KEY=tu_secret_key
# DEBUG=True

# Aplicar migraciones (si las hay)
py manage.py migrate

# Iniciar servidor de desarrollo
py manage.py runserver
```

✅ Backend corriendo en: http://localhost:8000

#### 3️⃣ Configurar Frontend (React)

```bash
# Abrir nueva terminal y navegar a frontend
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env y agregar:
# REACT_APP_API_URL=http://localhost:8000/api
# REACT_APP_SUPABASE_URL=tu_url
# REACT_APP_SUPABASE_ANON_KEY=tu_key

# Iniciar servidor de desarrollo
npm start
```

✅ Frontend corriendo en: http://localhost:3000

#### 4️⃣ Configurar Base de Datos (Supabase)

1. Acceder a tu proyecto en [Supabase](https://supabase.com)
2. Ir a **SQL Editor**
3. Copiar y ejecutar el script `database/schema.sql`
4. Verificar que las tablas se crearon correctamente

---

## 📚 Documentación

### 🔗 Endpoints de la API

#### Autenticación
```http
POST   /api/auth/login/     # Iniciar sesión
POST   /api/auth/refresh/   # Refrescar token
POST   /api/auth/logout/    # Cerrar sesión
GET    /api/auth/me/        # Obtener usuario actual
```

#### Empresas
```http
GET    /api/companies/           # Listar empresas
POST   /api/companies/           # Crear empresa
GET    /api/companies/{id}/      # Detalle de empresa
PUT    /api/companies/{id}/      # Actualizar empresa
DELETE /api/companies/{id}/      # Eliminar empresa
GET    /api/companies/{id}/tree/ # Árbol jerárquico
```

#### Auditorías
```http
GET    /api/audits/             # Listar auditorías
POST   /api/audits/             # Crear auditoría
GET    /api/audits/{id}/        # Detalle de auditoría
PUT    /api/audits/{id}/        # Actualizar auditoría
POST   /api/audits/{id}/submit/ # Enviar auditoría
GET    /api/audits/{id}/report/ # Generar reporte
```

#### Plantillas
```http
GET    /api/templates/          # Listar plantillas
POST   /api/templates/          # Crear plantilla
GET    /api/templates/{id}/     # Detalle de plantilla
```

#### Dashboard
```http
GET    /api/dashboard/stats/           # Estadísticas generales
GET    /api/dashboard/company-stats/   # Stats por empresa
```

---

## 📊 Modelo de Datos

### Entidades Principales

```
users ──┬── company_users ──── companies
        │                          │
        └── audits ────────────────┤
                │                  │
                └── audit_responses│
                                   │
audit_templates ───────────────────┘
        │
        └── audit_sections
                │
                └── audit_questions
```

### Jerarquía de Empresas

```
Empresa Matriz (is_parent=true)
    ├── Filial 1
    ├── Filial 2
    └── Filial 3
```

---

## 🎯 Roadmap

### ✅ Fase 1 - MVP (Completado)
- [x] Sistema de autenticación
- [x] CRUD de empresas
- [x] Jerarquía empresarial
- [x] Plantillas de auditorías
- [x] Realización de auditorías

### 🚧 Fase 2 - En Desarrollo
- [ ] Dashboard analítico con gráficos
- [ ] Reportes consolidados
- [ ] Sistema de notificaciones
- [ ] Exportación a PDF/Excel

### 📅 Fase 3 - Futuro
- [ ] Aplicación móvil (React Native)
- [ ] Auditorías offline
- [ ] Inteligencia artificial para análisis
- [ ] Integración con ISO online

---

## 🧪 Testing

```bash
# Backend
cd backend
py manage.py test

# Frontend
cd frontend
npm test

# Coverage
npm run test:coverage
```

---

## 🚀 Deployment

### Backend (Railway / Render)

```bash
# Instalar dependencias de producción
pip install gunicorn whitenoise

# Recolectar archivos estáticos
py manage.py collectstatic

# Iniciar con Gunicorn
gunicorn audit_system.wsgi:application
```

### Frontend (Vercel / Netlify)

```bash
# Build de producción
npm run build

# Carpeta a deployar: build/
```

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y de uso académico.

---

## 👨‍💻 Autor

**Estudiante UDLA** - Desarrollo Web Avanzado

---

## 📞 Contacto y Soporte

- 📧 Email: soporte@auditapp.com
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/Django-React/issues)
- 📖 Wiki: [Documentación Completa](https://github.com/tu-usuario/Django-React/wiki)

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub ⭐**

Hecho con ❤️ por estudiantes de UDLA

</div>