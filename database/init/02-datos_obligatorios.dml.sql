-- =================================================================
-- ARCHIVO MAESTRO: DATOS OBLIGATORIOS + DEMOSTRACIÓN (VRISA)
-- =================================================================

BEGIN;

-- 1. VARIABLES (Catálogo obligatorio)
INSERT INTO variable (tipo, nombre, unidad, descripcion) VALUES
('CONTAMINANTE', 'Material Particulado 2.5', 'µg/m³', 'Partículas finas menores a 2.5 micrómetros'),
('CONTAMINANTE', 'Material Particulado 10', 'µg/m³', 'Partículas menores a 10 micrómetros'),
('CONTAMINANTE', 'Dióxido de Azufre', 'ppb', 'Gas contaminante producido por combustión'),
('CONTAMINANTE', 'Dióxido de Nitrógeno', 'ppb', 'Gas contaminante de óxidos de nitrógeno'),
('CONTAMINANTE', 'Ozono', 'ppb', 'Contaminante secundario fotoquímico'),
('CONTAMINANTE', 'Monóxido de Carbono', 'ppm', 'Gas tóxico por combustión incompleta'),
('METEOROLOGICA', 'Temperatura', '°C', 'Temperatura del aire ambiente'),
('METEOROLOGICA', 'Humedad Relativa', '%', 'Porcentaje de humedad en el aire'),
('METEOROLOGICA', 'Velocidad del Viento', 'm/s', 'Velocidad del viento'),
('METEOROLOGICA', 'Dirección del Viento', 'grados', 'Dirección de procedencia del viento'),
('METEOROLOGICA', 'Presión Atmosférica', 'hPa', 'Presión atmosférica'),
('METEOROLOGICA', 'Precipitación', 'mm', 'Cantidad de lluvia acumulada');

-- 2. USUARIOS (Admin Principal + Actores Demo)
INSERT INTO usuario (nombre, correo_electronico, contraseña, tipo_usuario, fecha_registro) VALUES
('Admin Dagma', 'admin@dagma.gov.co', '1234', 'INSTITUCION', NOW() - INTERVAL '2 months'),
('Admin CVC', 'admin@cvc.gov.co', '1234', 'INSTITUCION', NOW() - INTERVAL '2 months'),
('Admin Univalle', 'admin@univalle.edu.co', '1234', 'INSTITUCION', NOW() - INTERVAL '2 months'),
('Operador Norte', 'operador.norte@correo.com', '1234', 'OPERADOR', NOW() - INTERVAL '1 month'),
('Operador Sur', 'operador.sur@correo.com', '1234', 'OPERADOR', NOW() - INTERVAL '1 month');

-- 3. INSTITUCIONES (Con Admin Dagma Activado)
INSERT INTO institucion (nombre, logo, direccion, estado, id_usuario, fecha_registro) VALUES
('DAGMA Oficial', 'logo.png', 'Av 6N', 'ACTIVA', (SELECT id_usuario FROM usuario WHERE correo_electronico='admin@dagma.gov.co' LIMIT 1), NOW() - INTERVAL '2 months'),
('CVC Regional', 'logo_cvc.png', 'Carrera 56 #11', 'ACTIVA', (SELECT id_usuario FROM usuario WHERE correo_electronico='admin@cvc.gov.co' LIMIT 1), NOW() - INTERVAL '2 months'),
('Univalle Ambiental', 'logo_uv.png', 'Calle 13 #100', 'ACTIVA', (SELECT id_usuario FROM usuario WHERE correo_electronico='admin@univalle.edu.co' LIMIT 1), NOW() - INTERVAL '2 months');

-- 4. INFRAESTRUCTURA (Estaciones y Sensores)
INSERT INTO estacion (nombre, longitud, latitud, estado, certificado, id_usuario, id_institucion, fecha_registro) VALUES
('Estación Flora (CVC)', -76.52, 3.48, 'ACTIVA', 'CERT-002', (SELECT id_usuario FROM usuario WHERE correo_electronico='operador.norte@correo.com' LIMIT 1), (SELECT id_institucion FROM institucion WHERE nombre='CVC Regional' LIMIT 1), NOW() - INTERVAL '1 month'),
('Estación Pance (Univalle)', -76.54, 3.35, 'ACTIVA', 'CERT-003', (SELECT id_usuario FROM usuario WHERE correo_electronico='operador.sur@correo.com' LIMIT 1), (SELECT id_institucion FROM institucion WHERE nombre='Univalle Ambiental' LIMIT 1), NOW() - INTERVAL '1 month');

INSERT INTO sensor (estado, fabricante, tipo, modelo, fecha_instalacion, id_usuario, id_estacion, id_variable) VALUES
('ACTIVO', 'Xiaomi', 'Laser', 'X-PM', NOW() - INTERVAL '1 month', (SELECT id_usuario FROM usuario WHERE correo_electronico='operador.norte@correo.com' LIMIT 1), (SELECT id_estacion FROM estacion WHERE nombre='Estación Flora (CVC)' LIMIT 1), 1),
('ACTIVO', 'Sony', 'Termico', 'T-200', NOW() - INTERVAL '1 month', (SELECT id_usuario FROM usuario WHERE correo_electronico='operador.sur@correo.com' LIMIT 1), (SELECT id_estacion FROM estacion WHERE nombre='Estación Pance (Univalle)' LIMIT 1), 7);

-- 5. MEDICIONES HISTÓRICAS (Para gráficas de Tendencias)
INSERT INTO medicion (valor, fecha, id_sensor, id_variable) VALUES
-- Datos de hace un mes
(45.0, NOW() - INTERVAL '30 days', (SELECT id_sensor FROM sensor WHERE modelo='X-PM' LIMIT 1), 1),
(42.5, NOW() - INTERVAL '29 days', (SELECT id_sensor FROM sensor WHERE modelo='X-PM' LIMIT 1), 1),
-- Datos recientes
(12.5, NOW() - INTERVAL '24 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-PM' LIMIT 1), 1),
(14.2, NOW() - INTERVAL '22 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-PM' LIMIT 1), 1),
(18.5, NOW() - INTERVAL '20 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-PM' LIMIT 1), 1),
(22.1, NOW() - INTERVAL '18 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-PM' LIMIT 1), 1),
(28.4, NOW() - INTERVAL '16 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-PM' LIMIT 1), 1),
(25.0, NOW() - INTERVAL '14 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-PM' LIMIT 1), 1),
(19.2, NOW() - INTERVAL '12 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-PM' LIMIT 1), 1),
(15.8, NOW() - INTERVAL '10 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-PM' LIMIT 1), 1),
(14.1, NOW() - INTERVAL '8 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-PM' LIMIT 1), 1),
(13.5, NOW() - INTERVAL '6 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-PM' LIMIT 1), 1),
(12.8, NOW() - INTERVAL '4 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-PM' LIMIT 1), 1),
(12.0, NOW(), (SELECT id_sensor FROM sensor WHERE modelo='X-PM' LIMIT 1), 1);

-- 6. ALERTAS DEMO
INSERT INTO alerta (nivel, valor, fecha, mensaje, id_estacion, id_variable) VALUES
('MEDIO', 28.4, NOW() - INTERVAL '16 hours', 'Aumento de material particulado zona norte', (SELECT id_estacion FROM estacion WHERE nombre='Estación Flora (CVC)' LIMIT 1), 1),
('BAJO', 18.5, NOW() - INTERVAL '20 hours', 'Leve incremento en PM2.5', (SELECT id_estacion FROM estacion WHERE nombre='Estación Flora (CVC)' LIMIT 1), 1);

-- 7. SOLICITUD PENDIENTE (Para aprobar en video)
INSERT INTO solicitud_estacion (nombre, longitud, latitud, estado, certificado, fecha_solicitud, id_usuario, id_institucion) VALUES
('Estación Base Aérea', -76.49, 3.46, 'PENDIENTE', 'DOC-PENDIENTE.pdf', NOW(), (SELECT id_usuario FROM usuario WHERE correo_electronico='operador.norte@correo.com' LIMIT 1), (SELECT id_institucion FROM institucion WHERE nombre='DAGMA Oficial' LIMIT 1));

COMMIT;