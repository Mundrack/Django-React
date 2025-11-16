# 🏢 Sistema de Auditorías Empresariales ISO

Sistema web integral para la gestión de auditorías empresariales basadas en estándares ISO (9001, 27001, 30000), diseñado para empresas con estructuras jerárquicas donde una empresa matriz supervisa múltiples filiales.

![Estado del Proyecto](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)
![Django](https://img.shields.io/badge/Django-5.0-green)
![React](https://img.shields.io/badge/React-18-blue)
![Python](https://img.shields.io/badge/Python-3.13-blue)

---

## 🎯 Objetivos del Proyecto

- **Automatización:** Digitalizar y automatizar el proceso de auditorías ISO
- **Consolidación:** Centralizar resultados de múltiples empresas filiales
- **Visualización:** Generar dashboards interactivos con análisis comparativo
- **Trazabilidad:** Mantener historial completo de auditorías y resultados
- **Accesibilidad:** Sistema web accesible desde cualquier dispositivo

---

## 🚀 Demo en Vivo

### **Backend API (Django REST Framework)**
🔗 **URL:** [https://django-react-1e0c.onrender.com](https://django-react-1e0c.onrender.com)

- **Admin Panel:** [/admin](https://django-react-1e0c.onrender.com/admin)
- **API Root:** [/api](https://django-react-1e0c.onrender.com/api)
- **Empresas:** [/api/companies](https://django-react-1e0c.onrender.com/api/companies)
- **Auditorías:** [/api/audits](https://django-react-1e0c.onrender.com/api/audits)
- **Usuarios:** [/api/users](https://django-react-1e0c.onrender.com/api/users)

### **Frontend (React)**
🔗 **URL:** `http://localhost:5173` (Desarrollo local)
> ⚠️ El frontend en producción se deployará próximamente en Netlify/Vercel

---

## 🎨 Características Principales

### ✅ Implementadas

#### **Sistema de Autenticación y Roles**
- 🔐 Login/Logout con JWT
- 👥 3 niveles de usuario:
  - **Super Admin:** Gestión total del sistema
  - **Company Admin:** Administración de su empresa y filiales
  - **Company User:** Ejecución de auditorías asignadas

#### **Gestión de Empresas**
- 🏢 CRUD completo de empresas
- 🔗 Estructura jerárquica (Matriz → Filiales)
- ✔️ Validación de RUC ecuatoriano (13 dígitos)
- 📊 Vista consolidada de empresas relacionadas

#### **Gestión de Usuarios**
- ➕ Creación de usuarios por Super Admin
- 🏷️ Asignación de roles y empresas
- 📋 Listado con filtros y búsqueda
- ✏️ Edición y eliminación

#### **Sistema de Plantillas de Auditorías**
- 📝 Plantillas personalizables por estándar ISO
- 📑 Organización en secciones
- ❓ Preguntas con diferentes tipos de respuesta:
  - Sí/No/Parcial
  - Escala 1-5
  - Texto libre
- ⚖️ Sistema de pesos para cálculo de puntaje

#### **API REST Completa**
- 🌐 Django REST Framework
- 📄 Documentación automática
- 🔄 Endpoints CRUD para todos los recursos
- 🔍 Filtros y búsqueda
- 📦 Paginación

#### **Deploy en Producción**
- ☁️ Backend en Render
- 🗄️ Base de datos en Supabase (PostgreSQL)
- 🔄 CI/CD con GitHub
- 🌍 SSL/HTTPS configurado

### 🔄 En Desarrollo

- [ ] Formulario interactivo para responder auditorías
- [ ] Dashboards analíticos con gráficos (Recharts)
- [ ] Reportes exportables a PDF/Excel
- [ ] Sistema de notificaciones
- [ ] Comparativas entre empresas
- [ ] Historial y tendencias temporales

---

## 🛠️ Tecnologías Utilizadas

### **Backend**
- **Django 5.0** - Framework web Python
- **Django REST Framework** - API REST
- **PostgreSQL** - Base de datos relacional
- **Supabase** - Backend as a Service
- **Gunicorn** - Servidor WSGI para producción
- **Whitenoise** - Servir archivos estáticos

### **Frontend**
- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **Context API** - Manejo de estado global

### **DevOps**
- **Git/GitHub** - Control de versiones
- **Render** - Hosting backend
- **Supabase** - Hosting base de datos

---

## 📁 Estructura del Proyecto
```
Django-React/
│
├── backend/                      # Backend Django
│   ├── audit_system/            # Configuración principal
│   │   ├── settings.py          # Configuración Django
│   │   ├── urls.py              # URLs principales
│   │   └── wsgi.py              # WSGI para producción
│   │
│   ├── authentication/          # App de autenticación
│   │   ├── models.py            # Modelo User personalizado
│   │   ├── serializers.py       # Serializers de usuarios
│   │   ├── views.py             # Login, registro, etc.
│   │   └── admin.py             # Admin de usuarios
│   │
│   ├── companies/               # App de empresas
│   │   ├── models.py            # Company, CompanyUser
│   │   ├── serializers.py       # Serializers de empresas
│   │   ├── views.py             # CRUD de empresas
│   │   └── admin.py             # Admin de empresas
│   │
│   ├── audits/                  # App de auditorías
│   │   ├── models.py            # Audit, Template, Section, Question, Response
│   │   ├── serializers.py       # Serializers de auditorías
│   │   ├── views.py             # CRUD de auditorías
│   │   └── admin.py             # Admin de auditorías
│   │
│   ├── staticfiles/             # Archivos estáticos compilados
│   ├── requirements.txt         # Dependencias Python
│   ├── manage.py                # CLI de Django
│   └── .env                     # Variables de entorno (no incluido)
│
├── frontend/                    # Frontend React
│   ├── src/
│   │   ├── api/                 # Configuración de Axios
│   │   │   └── axios.js
│   │   ├── components/          # Componentes reutilizables
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/             # Context API
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/               # Custom hooks
│   │   │   └── useAuth.js
│   │   ├── pages/               # Páginas/Vistas
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Users.jsx
│   │   ├── App.jsx              # Componente principal
│   │   ├── main.jsx             # Punto de entrada
│   │   └── index.css            # Estilos globales (Tailwind)
│   │
│   ├── public/                  # Archivos públicos
│   ├── package.json             # Dependencias Node.js
│   ├── vite.config.js           # Configuración de Vite
│   ├── tailwind.config.js       # Configuración de Tailwind
│   └── .env                     # Variables de entorno (no incluido)
│
├── .gitignore                   # Archivos ignorados por Git
└── README.md                    # Este archivo
```

---

## 🚀 Instalación y Configuración

### **Prerrequisitos**

- Python 3.13+
- Node.js 18+
- PostgreSQL (o cuenta en Supabase)
- Git

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/Mundrack/Django-React.git
cd Django-React
```

### **2. Configurar Backend**

#### **Crear entorno virtual:**
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate
```

#### **Instalar dependencias:**
```bash
pip install -r requirements.txt
```

#### **Configurar variables de entorno:**

Crear archivo `backend/.env`:
```env
# Django
SECRET_KEY=tu-secret-key-super-segura
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (Supabase)
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu-password-de-supabase
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173
```

#### **Ejecutar migraciones:**
```bash
python manage.py makemigrations
python manage.py migrate
```

#### **Crear superusuario:**
```bash
python manage.py createsuperuser
```

#### **Iniciar servidor:**
```bash
python manage.py runserver
```

El backend estará disponible en: `http://127.0.0.1:8000`

---

### **3. Configurar Frontend**

#### **Instalar dependencias:**
```bash
cd frontend
npm install
```

#### **Configurar variables de entorno:**

Crear archivo `frontend/.env`:
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

#### **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 🔑 Credenciales de Prueba

### **Desarrollo Local**

**Super Admin:**
- Email: `admin@auditapp.com`
- Password: (cualquier contraseña funciona en desarrollo)

**Django Admin:**
- Usuario: `MateoAdmin`
- Password: `admin123`

### **Producción (Render)**

**Django Admin:**
- URL: https://django-react-1e0c.onrender.com/admin
- Usuario: `MateoAdmin`
- Password: `admin123`

---

## 📡 API Endpoints

### **Autenticación**
```
POST   /api/auth/login/          - Iniciar sesión
POST   /api/auth/register/       - Registrar usuario
GET    /api/auth/me/             - Obtener usuario actual
```

### **Usuarios**
```
GET    /api/users/               - Listar usuarios
POST   /api/users/               - Crear usuario
GET    /api/users/{id}/          - Obtener usuario
PUT    /api/users/{id}/          - Actualizar usuario
DELETE /api/users/{id}/          - Eliminar usuario
```

### **Empresas**
```
GET    /api/companies/           - Listar empresas
POST   /api/companies/           - Crear empresa
GET    /api/companies/{id}/      - Obtener empresa
PUT    /api/companies/{id}/      - Actualizar empresa
DELETE /api/companies/{id}/      - Eliminar empresa
GET    /api/companies/parents/   - Solo empresas matriz
GET    /api/companies/{id}/tree/ - Árbol jerárquico
```

### **Auditorías**
```
GET    /api/audits/              - Listar auditorías
POST   /api/audits/              - Crear auditoría
GET    /api/audits/{id}/         - Obtener auditoría
PUT    /api/audits/{id}/         - Actualizar auditoría
DELETE /api/audits/{id}/         - Eliminar auditoría
POST   /api/audits/{id}/submit/  - Enviar auditoría
```

### **Plantillas**
```
GET    /api/templates/           - Listar plantillas
POST   /api/templates/           - Crear plantilla
GET    /api/templates/{id}/      - Obtener plantilla
PUT    /api/templates/{id}/      - Actualizar plantilla
DELETE /api/templates/{id}/      - Eliminar plantilla
```

### **Respuestas**
```
GET    /api/responses/?audit={id} - Respuestas de una auditoría
POST   /api/responses/            - Crear respuesta
PUT    /api/responses/{id}/       - Actualizar respuesta
```

---

## 📊 Modelo de Datos

### **Relaciones Principales**
```
User (Usuario)
├── role: super_admin | company_admin | company_user
└── CompanyUser → Company (Asignación a empresa)

Company (Empresa)
├── is_parent: Boolean (¿Es matriz?)
├── parent: ForeignKey (Empresa matriz)
└── subsidiaries: Filiales relacionadas

AuditTemplate (Plantilla de Auditoría)
├── iso_standard: ISO 9001, 27001, etc.
└── AuditSection (Secciones)
    └── AuditQuestion (Preguntas)
        ├── answer_type: yes_no_partial | scale_1_5 | text
        └── weight: Decimal (peso para puntaje)

Audit (Auditoría)
├── template: ForeignKey(AuditTemplate)
├── company: ForeignKey(Company)
├── auditor: ForeignKey(User) - Quien creó
├── assigned_to: ForeignKey(User) - Quien ejecuta
├── status: pending | in_progress | completed
├── score: Decimal (0-100)
└── AuditResponse (Respuestas)
    ├── question: ForeignKey(AuditQuestion)
    ├── answer_choice: yes | no | partial
    └── answer_numeric: 1-5
```

---

## 🎯 Casos de Uso

### **1. Super Admin crea plantilla de auditoría**
1. Accede a Django Admin
2. Crea `AuditTemplate` (ej: "ISO 9001 - Calidad")
3. Agrega `AuditSection` (ej: "Gestión de Calidad")
4. Agrega `AuditQuestion` con tipo y peso

### **2. Company Admin asigna auditoría**
1. Inicia sesión en el sistema
2. Va a "Nueva Auditoría"
3. Selecciona plantilla, empresa filial, y usuario
4. El usuario recibe la auditoría pendiente

### **3. Company User ejecuta auditoría**
1. Ve auditorías asignadas en su dashboard
2. Responde preguntas de cada sección
3. Sube evidencias (archivos)
4. Envía auditoría completada

### **4. Company Admin revisa resultados**
1. Ve dashboard consolidado
2. Compara resultados entre filiales
3. Exporta reporte PDF
4. Toma decisiones de mejora

---

## 🔧 Scripts Útiles

### **Backend**
```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Recopilar archivos estáticos
python manage.py collectstatic

# Iniciar servidor
python manage.py runserver

# Shell de Django
python manage.py shell
```

### **Frontend**
```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

---

## 🌐 Deploy

### **Backend (Render)**

1. **Conectar repositorio GitHub a Render**
2. **Configurar variables de entorno en Render:**
   - `SECRET_KEY`
   - `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
   - `ALLOWED_HOSTS`
   - `CORS_ALLOWED_ORIGINS`
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `gunicorn audit_system.wsgi:application`

### **Frontend (Netlify/Vercel) - Próximamente**

1. **Conectar repositorio GitHub**
2. **Build Command:** `npm run build`
3. **Publish Directory:** `dist`
4. **Environment Variable:** `VITE_API_URL=https://django-react-1e0c.onrender.com/api`

---

## 🗺️ Roadmap

### **Fase 1: MVP ✅ (Completado)**
- [x] Autenticación y roles
- [x] CRUD de empresas con jerarquía
- [x] CRUD de usuarios
- [x] Sistema de plantillas
- [x] API REST completa
- [x] Deploy del backend

### **Fase 2: Funcionalidades Core 🔄 (En Desarrollo)**
- [ ] Formulario interactivo de auditorías
- [ ] Cálculo automático de puntajes
- [ ] Dashboards analíticos
- [ ] Deploy del frontend

### **Fase 3: Análisis y Reportes 📅 (Planificado)**
- [ ] Gráficos comparativos
- [ ] Exportación a PDF/Excel
- [ ] Tendencias temporales
- [ ] Sistema de notificaciones

### **Fase 4: Mejoras Avanzadas 🚀 (Futuro)**
- [ ] Subida de evidencias (archivos)
- [ ] Comentarios y observaciones
- [ ] Historial de cambios
- [ ] Modo offline
- [ ] App móvil

---

## 👥 Equipo

- **Mateo Puga** - Backend Django, Base de Datos, API REST, Deploy
- **[Nombre Compañero]** - Frontend React, Dashboards, Reportes, Visualizaciones

---

## 📄 Licencia

Este proyecto fue desarrollado como proyecto final para la materia de Desarrollo Web en la Universidad De Las Américas (UDLA).

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📞 Contacto

**Mateo Puga**
- GitHub: [@Mundrack](https://github.com/Mundrack)
- Email: mateopuga75@gmail.com

**Repositorio:** [https://github.com/Mundrack/Django-React](https://github.com/Mundrack/Django-React)

---

<div align="center">
  <p>Desarrollado con ❤️ en Ecuador 🇪🇨</p>
  <p>UDLA - Desarrollo Web - 2025</p>
</div>