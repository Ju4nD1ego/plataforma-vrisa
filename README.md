# Proyecto Final - Bases de datos
### Aplicación VriSA


<p align="center">
  <strong>Universidad del Valle</strong><br>
  Escuela de Ingeniería de Sistemas y Computación<br>
  Profesor: Jefferson Amado Peña Torres<br>
  Diciembre de 2025
</p>

---

## Autores

- **Juan Marin Orozco** - 2422117
- **Sara Giraldo Mosquera** 2417149
- **Isabella Bermúdez** - 2418564
- **Brandon Alexis Franco Flor** - 2435998
- **Juan Diego Ledezma** - 2540088

---


## Video de Sustentación

[Enlace al video en YouTube](https://youtu.be/Ox20XBcWdM8)

---

## Documentación

### Informe Técnico Completo

[Informe Técnico]().




**Implementacion del proyecto:**


#  VRISA Platform - Sistema de Vigilancia de Riesgos e Inmisiones de Sustancias Atmosféricas

Plataforma completa de monitoreo de calidad del aire desarrollada con Django REST Framework, React y PostgreSQL.

##  Características

- **Sistema de Autenticación JWT** con 5 roles de usuario (Administrador, Institución, Operador, Investigador, Ciudadano)
- **Gestión de Instituciones** con flujo de solicitud y aprobación
- **Gestión de Estaciones** de monitoreo con geolocalización
- **Gestión de Sensores** y variables atmosféricas
- **Dashboard en Tiempo Real** con gráficos y visualizaciones
- **Sistema de Alertas** con niveles (Buena, Moderada, Dañina, Peligrosa)
- **Generación de Reportes** (Calidad del Aire, Tendencias, Alertas Críticas, Infraestructura)

##  Requisitos Previos

- Docker Desktop instalado
- Docker Compose
- Puertos 3000, 8000 y 5432 disponibles

## � Documentación Adicional

- **[MANUAL_USUARIO.md](MANUAL_USUARIO.md)** - Manual completo de cómo usar la plataforma paso a paso
- **[populate_test_data.py](populate_test_data.py)** - Script para crear datos de prueba automáticamente


##  Instalación y Despliegue

### 1. Clonar el repositorio
```bash
cd vrisa-project
```

### 2. Levantar los servicios con Docker Compose
```bash
docker-compose up --build
```

Este comando:
- Construye las imágenes de Docker para backend, frontend y base de datos
- Inicializa PostgreSQL con el esquema DDL y datos iniciales
- Levanta Django en el puerto 8000
- Levanta React en el puerto 3000

### 3. Acceder a la aplicación

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000/api/](http://localhost:8000/api/)
- **Admin Django**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

### 4. Detener los servicios
```bash
docker-compose down
```

Para eliminar también los volúmenes:
```bash
docker-compose down -v
```

## 📁 Estructura del Proyecto

```
vrisa-project/
├── backend/                    # Django REST Framework
│   ├── api/                   # App principal
│   │   ├── models.py         # Modelos (managed=False)
│   │   ├── serializers.py    # Serializadores DRF
│   │   ├── views.py          # ViewSets y endpoints
│   │   └── ...
│   ├── vrisa/                # Configuración Django
│   │   ├── settings.py       # Settings con CORS, JWT, DB
│   │   ├── urls.py           # Rutas API
│   │   └── ...
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/                  # React + Vite
│   ├── src/
│   │   ├── pages/            # Páginas principales
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Instituciones.jsx
│   │   │   ├── Estaciones.jsx
│   │   │   ├── Alertas.jsx
│   │   │   └── Reportes.jsx
│   │   ├── services/         # API service con Axios
│   │   │   └── api.js
│   │   ├── App.jsx           # Router principal
│   │   └── ...
│   ├── Dockerfile
│   └── package.json
│
├── database/                  # PostgreSQL
│   ├── init/
│   │   ├── 01-base_inicial.ddl.sql
│   │   └── 02-datos_obligatorios.dml.sql
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

##  Endpoints API Principales

### Autenticación
- `POST /api/auth/login/` - Login con email y contraseña
- `POST /api/auth/register/` - Registro de nuevos usuarios

### Instituciones
- `GET/POST /api/instituciones/` - Listar/Crear instituciones
- `GET/POST /api/solicitudes/instituciones/` - Solicitudes de instituciones
- `PATCH /api/solicitudes/instituciones/{id}/aprobar/` - Aprobar solicitud

### Estaciones
- `GET/POST /api/estaciones/` - Listar/Crear estaciones
- `GET/POST /api/solicitudes/estaciones/` - Solicitudes de estaciones
- `PATCH /api/solicitudes/estaciones/{id}/aprobar/` - Aprobar solicitud

### Variables y Sensores
- `GET /api/variables/` - Listar variables atmosféricas
- `GET/POST /api/sensores/` - Gestión de sensores

### Mediciones y Alertas
- `GET/POST /api/mediciones/` - Gestión de mediciones
- `GET /api/mediciones/ultimas/` - Últimas 10 mediciones
- `GET /api/alertas/` - Listar alertas

### Reportes
- `GET/POST /api/reportes/` - Generación de reportes

##  Páginas Frontend

1. **Login/Registro** - Autenticación de usuarios
2. **Dashboard** - Vista general con gráficos y estadísticas
3. **Instituciones** - Gestión y aprobación de instituciones
4. **Estaciones** - Gestión y aprobación de estaciones
5. **Alertas** - Visualización de alertas con filtros
6. **Reportes** - Generación de reportes personalizados

##  Configuración

### Variables de Entorno

Copia `.env.example` a `.env` y ajusta según necesites:

```env
DB_NAME=vrisa_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432
DJANGO_SECRET_KEY=your_secret_key
DEBUG=True
```

### Base de Datos

La base de datos se inicializa automáticamente con:
- Esquema completo (10 tablas)
- 12 variables atmosféricas predefinidas (6 contaminantes + 6 meteorológicas)

##  Testing

Para probar la aplicación:

1. Registra un nuevo usuario en el frontend
2. Inicia sesión
3. Crea una solicitud de institución
4. Si eres administrador, aprueba la solicitud
5. Crea una estación asociada a la institución
6. Visualiza el dashboard con datos

##  Troubleshooting

### El backend no se conecta a la base de datos
- Verifica que el servicio `db` esté corriendo: `docker-compose ps`
- Revisa los logs: `docker-compose logs db`

### El frontend no se conecta al backend
- Verifica que el backend esté en el puerto 8000
- Revisa CORS en `settings.py`

### Errores de permisos en Docker
- En Windows, asegúrate de que Docker Desktop tenga permisos
- Ejecuta Docker Desktop como administrador si es necesario

##  Notas Técnicas

- Los modelos Django usan `managed=False` para no interferir con el esquema SQL existente
- Las contraseñas se almacenan en texto plano para compatibilidad con el esquema legacy (en producción usar hashing)
- El frontend usa Chart.js para visualizaciones
- JWT tokens tienen validez de 60 minutos

##  Roles de Usuario

- **ADMINISTRADOR**: Aprueba instituciones y estaciones
- **INSTITUCION**: Gestiona sus estaciones
- **OPERADOR**: Gestiona sensores y mediciones
- **INVESTIGADOR**: Consulta datos y genera reportes
- **CIUDADANO**: Consulta información pública





