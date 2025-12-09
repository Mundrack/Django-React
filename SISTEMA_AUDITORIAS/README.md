# 🔐 Sistema de Auditorías Empresariales ISO 27701

**Proyecto de Titulación - Ingeniería Web**  
**Universidad de Las Américas (UDLA)**  
**Autor:** Mateo Puga  
**Fecha:** 2025

---

## 📋 Descripción

Sistema web completo para gestión de auditorías de cumplimiento ISO 27701 (Gestión de Privacidad de la Información). Permite a las organizaciones evaluar su nivel de cumplimiento con estándares internacionales de privacidad, generar reportes detallados y gestionar recomendaciones de mejora.

### Características Principales

- ✅ **Auditorías ISO 27701** - Plantilla completa con 55+ preguntas organizadas en 10 secciones
- 📊 **Dashboard Interactivo** - Visualización de métricas, tendencias y puntuaciones
- 🏢 **Gestión Jerárquica** - 5 niveles organizacionales (Empresa → Sucursal → Departamento → Equipo → Sub-equipo)
- 👥 **Multi-usuario** - Sistema de roles (Owner, Manager, Employee) con permisos diferenciados
- 📈 **Comparaciones** - Análisis comparativo entre múltiples auditorías
- 💡 **Recomendaciones Automáticas** - Generación inteligente de acciones correctivas
- 🔒 **Autenticación JWT** - Sistema seguro con tokens de acceso y refresh

---

## 🛠️ Stack Tecnológico

### Backend
- **Django 5.0** - Framework web Python
- **Django REST Framework** - API RESTful
- **PostgreSQL** (Supabase) - Base de datos
- **JWT** - Autenticación con tokens

### Frontend
- **React 18** - Librería UI
- **React Router 6** - Navegación SPA
- **Tailwind CSS** - Estilos utility-first
- **Recharts** - Gráficos y visualizaciones
- **Axios** - Cliente HTTP

---

## 🚀 Instalación Rápida

### Requisitos Previos
- Python 3.10+
- Node.js 18+
- Git

### Windows
```bash
# 1. Clonar/descomprimir el proyecto
# 2. Ejecutar instalador
instalar.bat

# 3. Iniciar el sistema
iniciar.bat
```

### Linux/Mac
```bash
# 1. Clonar/descomprimir el proyecto
# 2. Dar permisos y ejecutar
chmod +x instalar.sh iniciar.sh
./instalar.sh

# 3. Iniciar el sistema
./iniciar.sh
```

---

## 🔑 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Admin (Owner)** | admin@demo.com | admin123 |
| **Gerente** | gerente@demo.com | demo123 |
| **Auditor** | auditor@demo.com | demo123 |

---

## 📁 Estructura del Proyecto

```
SISTEMA_AUDITORIAS/
├── backend/                    # API Django
│   ├── audit_system/          # Configuración principal
│   ├── apps/
│   │   ├── authentication/    # Usuarios y organizaciones
│   │   ├── core/              # Jerarquía organizacional
│   │   └── audits/            # Sistema de auditorías
│   ├── requirements.txt
│   └── manage.py
│
├── frontend/                   # React App
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/             # Páginas de la aplicación
│   │   ├── services/          # Servicios API
│   │   ├── context/           # Estado global
│   │   └── utils/             # Utilidades
│   └── package.json
│
├── instalar.bat / .sh         # Scripts de instalación
├── iniciar.bat / .sh          # Scripts de inicio
└── README.md
```

---

## 🌐 Endpoints API Principales

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Registro de usuario |
| POST | `/api/auth/login/` | Inicio de sesión |
| POST | `/api/auth/logout/` | Cerrar sesión |
| GET | `/api/auth/me/` | Perfil actual |

### Auditorías
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/templates/` | Listar plantillas |
| GET/POST | `/api/audits/` | Listar/Crear auditorías |
| POST | `/api/audits/{id}/start/` | Iniciar auditoría |
| POST | `/api/audits/{id}/answer/` | Responder pregunta |
| POST | `/api/audits/{id}/complete/` | Completar auditoría |
| GET | `/api/audits/{id}/results/` | Ver resultados |

### Jerarquía
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/hierarchy/tree/` | Árbol completo |
| GET/POST | `/api/companies/` | Gestión de empresas |
| GET/POST | `/api/branches/` | Gestión de sucursales |

---

## 📊 Flujo de una Auditoría

```
1. CREAR      → Seleccionar plantilla y nivel organizacional
      ↓
2. INICIAR    → Cambiar estado a "En Progreso"
      ↓
3. EJECUTAR   → Responder preguntas por sección
      ↓
4. COMPLETAR  → Calcular puntuación final
      ↓
5. RESULTADOS → Ver gráficos y recomendaciones
```

---

## 🧮 Sistema de Puntuación

- **Preguntas Sí/No**: Sí = 100%, No = 0%
- **Escala (1-5)**: Proporcional (3/5 = 60%)
- **Opción múltiple**: Primera opción = 100%, segunda = 50%

### Clasificación de Puntuación
| Rango | Clasificación | Color |
|-------|---------------|-------|
| 85-100% | Excelente | 🟢 Verde |
| 70-84% | Bueno | 🔵 Azul |
| 50-69% | Regular | 🟡 Amarillo |
| 0-49% | Crítico | 🔴 Rojo |

---

## 🔧 Configuración de Base de Datos

El proyecto está configurado para usar **Supabase** (PostgreSQL en la nube). Las credenciales están en `backend/.env`:

```env
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=ProyectoWebAuditorias
DB_HOST=db.ppgzdxgowhwdtbkzytbd.supabase.co
DB_PORT=5432
```

---

## 📝 Plantilla ISO 27701 Incluida

La plantilla incluye 10 secciones con 55+ preguntas:

1. **Contexto de la Organización** - 4 preguntas
2. **Liderazgo y Compromiso** - 5 preguntas
3. **Planificación** - 5 preguntas
4. **Soporte y Recursos** - 5 preguntas
5. **Operación** - 6 preguntas
6. **Derechos del Titular** - 7 preguntas
7. **Seguridad de Datos Personales** - 8 preguntas
8. **Transferencias de Datos** - 5 preguntas
9. **Evaluación del Desempeño** - 5 preguntas
10. **Mejora Continua** - 5 preguntas

---

## 🤝 Soporte

Para dudas o problemas:
- **Email:** mateo.puga@udla.edu.ec
- **GitHub Issues:** Crear un issue en el repositorio

---

## 📄 Licencia

Este proyecto fue desarrollado como proyecto de titulación para la Universidad de Las Américas (UDLA). Uso académico autorizado.

---

**Desarrollado con ❤️ por Mateo Puga - UDLA 2025**
