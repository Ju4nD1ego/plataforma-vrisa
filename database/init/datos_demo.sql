BEGIN;

-- ============================
-- 1. USUARIOS ADICIONALES
-- ============================
INSERT INTO usuario (nombre, correo_electronico, contraseña, tipo_usuario, fecha_registro) VALUES
('Admin CVC', 'admin@cvc.gov.co', '1234', 'INSTITUCION', NOW()),
('Admin Univalle', 'admin@univalle.edu.co', '1234', 'INSTITUCION', NOW()),
('Operador Norte', 'operador.norte@correo.com', '1234', 'OPERADOR', NOW()),
('Operador Sur', 'operador.sur@correo.com', '1234', 'OPERADOR', NOW()),
('Operador Centro', 'operador.centro@correo.com', '1234', 'OPERADOR', NOW());

-- ============================
-- 2. INSTITUCIONES ADICIONALES
-- ============================
INSERT INTO institucion (nombre, logo, direccion, estado, id_usuario, fecha_registro) VALUES
('CVC Regional', 'logo_cvc.png', 'Carrera 56 #11', 'ACTIVA',
 (SELECT id_usuario FROM usuario WHERE correo_electronico='admin@cvc.gov.co' LIMIT 1), NOW()),
('Univalle Ambiental', 'logo_uv.png', 'Calle 13 #100', 'ACTIVA',
 (SELECT id_usuario FROM usuario WHERE correo_electronico='admin@univalle.edu.co' LIMIT 1), NOW());

-- ============================
-- 3. ESTACIONES ACTIVAS
-- ============================
-- Ojo: 'DAGMA Oficial' ya se crea en 02-datos_obligatorios.dml.sql
INSERT INTO estacion (nombre, longitud, latitud, estado, certificado, id_usuario, id_institucion, fecha_registro) VALUES
('Estación Flora (CVC)', -76.52, 3.48, 'ACTIVA', 'CERT-002',
 (SELECT id_usuario FROM usuario WHERE correo_electronico='operador.norte@correo.com' LIMIT 1),
 (SELECT id_institucion FROM institucion WHERE nombre='CVC Regional' LIMIT 1), NOW()),
('Estación Pance (Univalle)', -76.54, 3.35, 'ACTIVA', 'CERT-003',
 (SELECT id_usuario FROM usuario WHERE correo_electronico='operador.sur@correo.com' LIMIT 1),
 (SELECT id_institucion FROM institucion WHERE nombre='Univalle Ambiental' LIMIT 1), NOW()),
('Estación Centro (DAGMA)', -76.53, 3.45, 'ACTIVA', 'CERT-004',
 (SELECT id_usuario FROM usuario WHERE correo_electronico='operador.centro@correo.com' LIMIT 1),
 (SELECT id_institucion FROM institucion WHERE nombre='DAGMA Oficial' LIMIT 1), NOW());

-- ============================
-- 4. SENSORES
-- ============================
-- Asumimos:
--   id_variable = 1  -> PM2.5
--   id_variable = 2  -> Temperatura
INSERT INTO sensor (estado, fabricante, tipo, modelo, fecha_instalacion, id_usuario, id_estacion, id_variable) VALUES
('ACTIVO', 'Xiaomi', 'Laser', 'X-100', NOW(),
 (SELECT id_usuario FROM usuario WHERE correo_electronico='operador.norte@correo.com' LIMIT 1),
 (SELECT id_estacion FROM estacion WHERE nombre='Estación Flora (CVC)' LIMIT 1), 1),
('ACTIVO', 'Sony', 'Termico', 'T-200', NOW(),
 (SELECT id_usuario FROM usuario WHERE correo_electronico='operador.sur@correo.com' LIMIT 1),
 (SELECT id_estacion FROM estacion WHERE nombre='Estación Pance (Univalle)' LIMIT 1), 2),
('ACTIVO', 'Bosch', 'Laser', 'X-200', NOW(),
 (SELECT id_usuario FROM usuario WHERE correo_electronico='operador.centro@correo.com' LIMIT 1),
 (SELECT id_estacion FROM estacion WHERE nombre='Estación Centro (DAGMA)' LIMIT 1), 1);

-- ============================
-- 5. SOLICITUD PENDIENTE (Para el video)
-- ============================
INSERT INTO solicitud_estacion (nombre, longitud, latitud, estado, certificado,
                               fecha_solicitud, id_usuario, id_institucion)
VALUES
('Estación Base Aérea', -76.49, 3.46, 'PENDIENTE', 'DOC-PENDIENTE.pdf',
 NOW(),
 (SELECT id_usuario FROM usuario WHERE correo_electronico='operador.norte@correo.com' LIMIT 1),
 (SELECT id_institucion FROM institucion WHERE nombre='DAGMA Oficial' LIMIT 1));

-- ============================
-- 6. MEDICIONES SIMULADAS (PM2.5 - Estación Flora)
-- ============================
-- Sensor PM2.5 en Flora (últimas 24 horas, ya lo tenías)
INSERT INTO medicion (valor, fecha, id_sensor, id_variable) VALUES
(12.5, NOW() - INTERVAL '24 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(14.2, NOW() - INTERVAL '22 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(18.5, NOW() - INTERVAL '20 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(22.1, NOW() - INTERVAL '18 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(28.4, NOW() - INTERVAL '16 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(25.0, NOW() - INTERVAL '14 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(19.2, NOW() - INTERVAL '12 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(15.8, NOW() - INTERVAL '10 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(14.1, NOW() - INTERVAL '8 hours',  (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(13.5, NOW() - INTERVAL '6 hours',  (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(12.8, NOW() - INTERVAL '4 hours',  (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(11.5, NOW() - INTERVAL '2 hours',  (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(12.0, NOW(),                          (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1);

-- Mediciones adicionales para la ÚLTIMA SEMANA en Flora
INSERT INTO medicion (valor, fecha, id_sensor, id_variable) VALUES
(10.5, NOW() - INTERVAL '7 days', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(11.2, NOW() - INTERVAL '6 days', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(13.8, NOW() - INTERVAL '5 days', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(20.1, NOW() - INTERVAL '4 days', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(30.4, NOW() - INTERVAL '3 days', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(35.0, NOW() - INTERVAL '2 days', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(27.3, NOW() - INTERVAL '36 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1);

-- ============================
-- 6B. MEDICIONES SIMULADAS (Temperatura - Estación Pance)
-- ============================
INSERT INTO medicion (valor, fecha, id_sensor, id_variable) VALUES
(18.0, NOW() - INTERVAL '24 hours', (SELECT id_sensor FROM sensor WHERE modelo='T-200' LIMIT 1), 2),
(19.5, NOW() - INTERVAL '20 hours', (SELECT id_sensor FROM sensor WHERE modelo='T-200' LIMIT 1), 2),
(21.0, NOW() - INTERVAL '16 hours', (SELECT id_sensor FROM sensor WHERE modelo='T-200' LIMIT 1), 2),
(22.3, NOW() - INTERVAL '12 hours', (SELECT id_sensor FROM sensor WHERE modelo='T-200' LIMIT 1), 2),
(23.1, NOW() - INTERVAL '8 hours',  (SELECT id_sensor FROM sensor WHERE modelo='T-200' LIMIT 1), 2),
(24.0, NOW() - INTERVAL '4 hours',  (SELECT id_sensor FROM sensor WHERE modelo='T-200' LIMIT 1), 2),
(23.0, NOW(),                          (SELECT id_sensor FROM sensor WHERE modelo='T-200' LIMIT 1), 2),

-- Temperaturas de días anteriores
(19.0, NOW() - INTERVAL '7 days', (SELECT id_sensor FROM sensor WHERE modelo='T-200' LIMIT 1), 2),
(20.5, NOW() - INTERVAL '5 days', (SELECT id_sensor FROM sensor WHERE modelo='T-200' LIMIT 1), 2),
(26.0, NOW() - INTERVAL '3 days', (SELECT id_sensor FROM sensor WHERE modelo='T-200' LIMIT 1), 2),
(27.5, NOW() - INTERVAL '2 days', (SELECT id_sensor FROM sensor WHERE modelo='T-200' LIMIT 1), 2);

-- ============================
-- 6C. MEDICIONES SIMULADAS (PM2.5 - Estación Centro DAGMA)
-- ============================
INSERT INTO medicion (valor, fecha, id_sensor, id_variable) VALUES
(15.0, NOW() - INTERVAL '18 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-200' LIMIT 1), 1),
(18.2, NOW() - INTERVAL '12 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-200' LIMIT 1), 1),
(40.5, NOW() - INTERVAL '6 hours',  (SELECT id_sensor FROM sensor WHERE modelo='X-200' LIMIT 1), 1),
(32.0, NOW() - INTERVAL '3 hours',  (SELECT id_sensor FROM sensor WHERE modelo='X-200' LIMIT 1), 1),
(29.8, NOW(),                           (SELECT id_sensor FROM sensor WHERE modelo='X-200' LIMIT 1), 1);

-- ============================
-- 7. ALERTAS
-- ============================
-- Alertas ya existentes para Flora
INSERT INTO alerta (nivel, valor, fecha, mensaje, id_estacion, id_variable) VALUES
('MEDIO', 28.4, NOW() - INTERVAL '16 hours',
 'Aumento de material particulado',
 (SELECT id_estacion FROM estacion WHERE nombre='Estación Flora (CVC)' LIMIT 1), 1),
('BAJO', 18.5, NOW() - INTERVAL '20 hours',
 'Leve incremento',
 (SELECT id_estacion FROM estacion WHERE nombre='Estación Flora (CVC)' LIMIT 1), 1);

-- Nuevas alertas para Flora (picos altos en días pasados)
INSERT INTO alerta (nivel, valor, fecha, mensaje, id_estacion, id_variable) VALUES
('ALTO', 35.0, NOW() - INTERVAL '2 days',
 'Superación de umbral diario de PM2.5',
 (SELECT id_estacion FROM estacion WHERE nombre='Estación Flora (CVC)' LIMIT 1), 1),
('ALTO', 30.4, NOW() - INTERVAL '3 days',
 'Episodio de contaminación moderada',
 (SELECT id_estacion FROM estacion WHERE nombre='Estación Flora (CVC)' LIMIT 1), 1);

-- Alertas para Pance (temperatura)
INSERT INTO alerta (nivel, valor, fecha, mensaje, id_estacion, id_variable) VALUES
('BAJO', 18.0, NOW() - INTERVAL '24 hours',
 'Temperatura baja en la madrugada',
 (SELECT id_estacion FROM estacion WHERE nombre='Estación Pance (Univalle)' LIMIT 1), 2),
('MEDIO', 26.0, NOW() - INTERVAL '3 days',
 'Onda de calor ligera',
 (SELECT id_estacion FROM estacion WHERE nombre='Estación Pance (Univalle)' LIMIT 1), 2);

-- Alertas para Estación Centro (DAGMA)
INSERT INTO alerta (nivel, valor, fecha, mensaje, id_estacion, id_variable) VALUES
('ALTO', 40.5, NOW() - INTERVAL '6 hours',
 'PM2.5 muy elevado en zona centro',
 (SELECT id_estacion FROM estacion WHERE nombre='Estación Centro (DAGMA)' LIMIT 1), 1),
('MEDIO', 32.0, NOW() - INTERVAL '3 hours',
 'Persistencia de material particulado',
 (SELECT id_estacion FROM estacion WHERE nombre='Estación Centro (DAGMA)' LIMIT 1), 1);

COMMIT;
