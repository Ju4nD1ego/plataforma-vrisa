# Manual de Usuario - VRISA Platform

##  ¿Cómo Funciona la Plataforma?

VRISA es un sistema para monitorear la calidad del aire. Aquí te explico paso a paso cómo usarlo:

---

## 📝 Paso 1: Registro e Inicio de Sesión

### Registrarse por Primera Vez

1. Abre http://localhost:3000
2. Verás la pantalla de **Login**
3. Click en el botón **"Registrarse"**
4. Completa el formulario:
   - **Nombre**: Tu nombre
   - **Primer Apellido**: Tu apellido
   - **Correo Electrónico**: tu@email.com
   - **Contraseña**: Elige una contraseña
   - **Tipo de Usuario**: Selecciona tu rol:
     - **CIUDADANO**: Solo consulta información
     - **INVESTIGADOR**: Consulta y genera reportes
     - **OPERADOR**: Gestiona sensores y mediciones
     - **INSTITUCION**: Gestiona instituciones y estaciones
     - **ADMINISTRADOR**: Aprueba solicitudes
5. Click en **"Registrarse"**

### Iniciar Sesión

1. En la pantalla de Login, ingresa:
   - **Correo Electrónico**
   - **Contraseña**
2. Click en **"Iniciar Sesión"**
3. Serás redirigido al **Dashboard**

---

##  Paso 2: Dashboard (Pantalla Principal)

El Dashboard muestra:

### Estadísticas Principales
- **Total Mediciones**: Número de mediciones registradas
- **Alertas Activas**: Alertas de calidad del aire

### Gráfico de Tendencias
- Muestra las últimas 10 mediciones en un gráfico de líneas
- Puedes ver cómo varían los valores a lo largo del tiempo

### Alertas Recientes
- Lista de las últimas 5 alertas
- Código de colores:
  - 🟢 **Verde (Buena)**: Calidad del aire óptima
  - 🟡 **Amarillo (Moderada)**: Calidad aceptable
  - 🟠 **Naranja (Dañina)**: Cuidado para grupos sensibles
  - 🔴 **Rojo (Peligrosa)**: Peligroso para todos

### Navegación
En la barra superior puedes ir a:
- **Instituciones**
- **Estaciones**
- **Alertas**
- **Reportes**
- **Cerrar Sesión**

---

##  Paso 3: Gestión de Instituciones

### Ver Instituciones Activas
1. Click en **"Instituciones"** en el navbar
2. Verás tarjetas con todas las instituciones aprobadas

### Solicitar una Nueva Institución
1. Click en **"Nueva Solicitud"**
2. Completa el formulario:
   - **Nombre**: Nombre de la institución (ej: "Universidad Nacional")
   - **URL del Logo**: Link a la imagen del logo (opcional)
   - **Dirección**: Dirección física
3. Click en **"Enviar Solicitud"**
4. La solicitud quedará **PENDIENTE** hasta que un administrador la apruebe

### Aprobar Solicitudes (Solo Administradores)
1. Baja hasta la sección **"Solicitudes Pendientes"**
2. Verás las solicitudes con borde naranja
3. Click en **"Aprobar"**
4. La institución se creará automáticamente y aparecerá en "Instituciones Activas"

---

##  Paso 4: Gestión de Estaciones

### Ver Estaciones Activas
1. Click en **"Estaciones"** en el navbar
2. Verás todas las estaciones de monitoreo aprobadas
3. Cada tarjeta muestra:
   - Nombre de la estación
   - Coordenadas (latitud, longitud)
   - Estado (ACTIVA)

### Solicitar una Nueva Estación
1. Click en **"Nueva Solicitud"**
2. Completa el formulario:
   - **Nombre**: Nombre de la estación (ej: "Estación Centro")
   - **Institución**: Selecciona a qué institución pertenece
   - **Longitud**: Coordenada (ej: -99.133209)
   - **Latitud**: Coordenada (ej: 19.432608)
   - **URL del Certificado**: Link al certificado de calibración (opcional)
3. Click en **"Enviar Solicitud"**

### Aprobar Solicitudes (Solo Administradores)
Similar al proceso de instituciones.

---

## Paso 5: Ver Alertas

1. Click en **"Alertas"** en el navbar
2. Usa los botones de filtro:
   - **Todas**: Muestra todas las alertas
   - **Buena**: Solo alertas de calidad buena
   - **Moderada**: Calidad moderada
   - **Dañina**: Calidad dañina
   - **Peligrosa**: Calidad peligrosa
3. Cada alerta muestra:
   - Nivel de alerta (con color)
   - Fecha y hora
   - Mensaje descriptivo
   - Valor medido
   - ID de estación y variable

---

## 📊 Paso 6: Generar Reportes

1. Click en **"Reportes"** en el navbar
2. Verás 4 tipos de reportes disponibles:
   - **Calidad del Aire**: Análisis detallado
   - **Tendencias**: Patrones a lo largo del tiempo
   - **Alertas Críticas**: Resumen de eventos importantes
   - **Infraestructura**: Estado de estaciones y sensores

### Generar un Reporte
1. Selecciona el **Tipo de Reporte**
2. Elige **Fecha Inicio** (desde cuándo)
3. Elige **Fecha Fin** (hasta cuándo)
4. Click en **"Generar Reporte"**
5. Verás un mensaje de confirmación

---

##  Paso 7: ¿Cómo Subir Datos?

### Opción 1: Usar la API Directamente

Puedes usar herramientas como **Postman** o **curl** para enviar datos:

#### Crear una Medición
```bash
POST http://localhost:8000/api/mediciones/
Content-Type: application/json
Authorization: Bearer TU_TOKEN_JWT

{
  "id_sensor": 1,
  "id_variable": 1,
  "valor": 35.5
}
```

#### Crear una Alerta
```bash
POST http://localhost:8000/api/alertas/
Content-Type: application/json

{
  "id_estacion": 1,
  "id_variable": 1,
  "nivel": "MODERADA",
  "valor": 75.3,
  "mensaje": "Niveles de PM2.5 moderados"
}
```

### Opción 2: Usar el Admin de Django

1. Primero, crea un superusuario:
```bash
docker-compose exec backend python manage.py createsuperuser
```

2. Accede a http://localhost:8000/admin/
3. Inicia sesión con las credenciales que creaste
4. Puedes agregar datos manualmente desde ahí

### Opción 3: Script Python (Recomendado para Pruebas)

Crea un archivo `test_data.py`:

```python
import requests

# Login
response = requests.post('http://localhost:8000/api/auth/login/', json={
    'email': 'tu@email.com',
    'password': 'tucontraseña'
})
token = response.json()['access']

# Crear medición
headers = {'Authorization': f'Bearer {token}'}
requests.post('http://localhost:8000/api/mediciones/', 
    headers=headers,
    json={
        'id_sensor': 1,
        'id_variable': 1,
        'valor': 42.5
    }
)
```

---

## Flujo Completo de Uso

### Escenario: Monitorear Calidad del Aire en tu Ciudad

1. **Administrador** crea usuarios para el equipo
2. **Usuario Institución** solicita crear su institución
3. **Administrador** aprueba la institución
4. **Usuario Institución** solicita crear estaciones de monitoreo
5. **Administrador** aprueba las estaciones
6. **Operador** instala sensores en las estaciones
7. **Operador** registra sensores en el sistema (vía API)
8. **Sensores** envían mediciones automáticamente (vía API)
9. **Sistema** genera alertas automáticamente cuando hay valores peligrosos
10. **Investigador** consulta el dashboard y genera reportes
11. **Ciudadano** consulta las alertas públicas

---

##  Datos de Prueba

Para probar rápidamente, puedes usar estos datos:

### Variables Predefinidas (ya están en la BD)
- ID 1: Material Particulado 2.5
- ID 2: Material Particulado 10
- ID 3: Dióxido de Azufre
- ID 4: Dióxido de Nitrógeno
- ID 5: Ozono
- ID 6: Monóxido de Carbono

### Crear Datos de Prueba
1. Registra un usuario administrador
2. Crea una institución
3. Crea una estación
4. Usa Postman o Python para crear mediciones

---

## Preguntas Frecuentes

**P: ¿Por qué no veo datos en el dashboard?**
R: Porque la base de datos está vacía al inicio. Necesitas crear instituciones, estaciones y mediciones primero.

**P: ¿Cómo creo un administrador?**
R: Regístrate normalmente y en la base de datos cambia el campo `tipo_usuario` a 'ADMINISTRADOR'.

**P: ¿Dónde están los sensores?**
R: Los sensores se gestionan vía API. En un sistema real, dispositivos IoT enviarían datos automáticamente.

**P: ¿Puedo cambiar los colores/diseño?**
R: Sí, edita los archivos CSS en `frontend/src/pages/`.

---

## Enlaces Útiles

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Admin Django: http://localhost:8000/admin/
- Documentación API: http://localhost:8000/api/ (navegable)

-
