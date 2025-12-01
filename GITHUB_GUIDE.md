# Guía de Despliegue en GitHub - VRISA

## 📤 Subir el Proyecto a GitHub

### Paso 1: Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión
2. Click en el botón **"+"** (arriba derecha) → **"New repository"**
3. Configura:
   - **Repository name**: `vrisa-platform` (o el nombre que prefieras)
   - **Description**: "Sistema de Vigilancia de Riesgos e Inmisiones de Sustancias Atmosféricas"
   - **Visibility**: Public o Private (según prefieras)
   - ❌ **NO** marques "Initialize with README" (ya tienes uno)
4. Click en **"Create repository"**

### Paso 2: Inicializar Git Localmente

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
cd "c:/Users/Usuario/OneDrive/Desktop/3er Semestre/DB/Proyecto Gravity/vrisa-project"

# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: VRISA Platform completa"

# Conectar con GitHub (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/vrisa-platform.git

# Subir el código
git branch -M main
git push -u origin main
```

### Paso 3: Verificar

Ve a tu repositorio en GitHub y deberías ver todos los archivos.

---

## 👥 Instrucciones para tus Compañeros

Comparte estas instrucciones con tu equipo:

### Requisitos Previos

- Git instalado ([descargar aquí](https://git-scm.com/downloads))
- Docker Desktop instalado ([descargar aquí](https://www.docker.com/products/docker-desktop/))
- Puertos 3000, 8000 y 5432 disponibles

### Pasos para Descargar y Ejecutar

#### 1. Clonar el Repositorio

```bash
# Reemplaza TU_USUARIO con el usuario de GitHub donde está el repo
git clone https://github.com/TU_USUARIO/vrisa-platform.git

# Entrar a la carpeta
cd vrisa-platform
```

#### 2. Levantar el Proyecto con Docker

```bash
docker-compose up --build
```

**Espera 2-3 minutos** mientras se construyen las imágenes y se inician los servicios.

#### 3. Acceder a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/

#### 4. Detener el Proyecto

Presiona `Ctrl + C` en la terminal, luego:

```bash
docker-compose down
```

### Solución de Problemas Comunes

**Error: "Port already in use"**
- Verifica que no tengas otros servicios usando los puertos 3000, 8000 o 5432
- Cierra otros proyectos Docker: `docker-compose down`

**Error: "Cannot connect to Docker daemon"**
- Asegúrate de que Docker Desktop esté corriendo

**Frontend no carga**
- Espera 1-2 minutos después de `docker-compose up`
- Verifica logs: `docker-compose logs frontend`

---

## 🔄 Actualizar el Proyecto

Si haces cambios y quieres que tus compañeros los descarguen:

### Tú (quien hace cambios):
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

### Tus compañeros:
```bash
git pull
docker-compose down
docker-compose up --build
```

---

## 📋 Estructura del Repositorio

```
vrisa-platform/
├── backend/          # Django REST Framework
├── frontend/         # React + Vite
├── database/         # PostgreSQL + scripts SQL
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## 🎓 Notas para el Equipo

- **NO** compartan el archivo `.env` si contiene contraseñas reales
- El `.gitignore` ya está configurado para excluir archivos innecesarios
- Si alguien tiene problemas, que revise la sección de Troubleshooting en el README.md

---

## 🆘 Soporte

Si alguien del equipo tiene problemas:
1. Verificar que Docker Desktop esté corriendo
2. Revisar logs: `docker-compose logs`
3. Reconstruir desde cero: `docker-compose down -v && docker-compose up --build`
