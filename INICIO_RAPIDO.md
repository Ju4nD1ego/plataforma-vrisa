# 🚀 Inicio Rápido - VRISA

## Para Ti (Desarrollador Principal)

### 1️⃣ Subir a GitHub (5 minutos)

```bash
cd "c:/Users/Usuario/OneDrive/Desktop/3er Semestre/DB/Proyecto Gravity/vrisa-project"

git init
git add .
git commit -m "Initial commit: VRISA Platform"
git remote add origin https://github.com/TU_USUARIO/vrisa-platform.git
git branch -M main
git push -u origin main
```

**Reemplaza `TU_USUARIO`** con tu usuario de GitHub.

### 2️⃣ Crear Datos de Prueba

```bash
# Asegúrate de que Docker esté corriendo
docker-compose up -d

# Instala requests si no lo tienes
pip install requests

# Ejecuta el script
python populate_test_data.py
```

Esto creará:
- 5 usuarios de prueba
- 5 alertas de ejemplo

### 3️⃣ Probar la Plataforma

1. Abre http://localhost:3000
2. Inicia sesión con: `admin@vrisa.com` / `admin123`
3. Explora el dashboard, instituciones, alertas, etc.

---

## Para tus Compañeros

### Instrucciones Cortas

```bash
# 1. Clonar
git clone https://github.com/TU_USUARIO/vrisa-platform.git
cd vrisa-platform

# 2. Levantar
docker-compose up --build

# 3. Abrir navegador
# http://localhost:3000
```

**Usuario de prueba**: `admin@vrisa.com` / `admin123`

---

## 📖 Documentación Completa

- **[GITHUB_GUIDE.md](GITHUB_GUIDE.md)** - Instrucciones detalladas de GitHub
- **[MANUAL_USUARIO.md](MANUAL_USUARIO.md)** - Cómo usar la plataforma completa
- **[README.md](README.md)** - Documentación técnica

---

## ❓ Respuestas Rápidas

**¿Cómo funciona?**
1. Registras usuarios
2. Creas instituciones (y las apruebas si eres admin)
3. Creas estaciones de monitoreo
4. Los sensores envían mediciones (vía API)
5. El sistema genera alertas automáticamente
6. Consultas el dashboard y generas reportes

**¿Dónde veo los datos?**
- Dashboard: http://localhost:3000/dashboard
- Alertas: http://localhost:3000/alertas
- API: http://localhost:8000/api/

**¿Cómo subo datos?**
- Opción 1: Script Python (populate_test_data.py)
- Opción 2: Admin Django (http://localhost:8000/admin/)
- Opción 3: API directa con Postman

**¿Por qué no veo datos?**
La base de datos empieza vacía. Ejecuta `populate_test_data.py` para crear datos de prueba.

---

## 🎯 Flujo de Demostración

Para una demo rápida:

1. **Login** como admin@vrisa.com
2. **Dashboard** - Muestra las estadísticas
3. **Instituciones** - Crea una solicitud y apruébala
4. **Estaciones** - Crea una estación
5. **Alertas** - Filtra por nivel
6. **Reportes** - Genera un reporte

---

## 🆘 Problemas Comunes

**Puerto ocupado**: `docker-compose down` primero
**Frontend no carga**: Espera 1-2 minutos
**Sin datos**: Ejecuta `populate_test_data.py`

---

**¡Listo para presentar! 🎉**
