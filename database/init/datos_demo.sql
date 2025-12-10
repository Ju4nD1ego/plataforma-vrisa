BEGIN;

-- 1. USUARIOS ADICIONALES
INSERT INTO usuario (nombre, correo_electronico, contraseña, tipo_usuario, fecha_registro) VALUES
('Admin CVC', 'admin@cvc.gov.co', '1234', 'INSTITUCION', NOW()),
('Admin Univalle', 'admin@univalle.edu.co', '1234', 'INSTITUCION', NOW()),
('Operador Norte', 'operador.norte@correo.com', '1234', 'OPERADOR', NOW()),
('Operador Sur', 'operador.sur@correo.com', '1234', 'OPERADOR', NOW());

-- 2. INSTITUCIONES ADICIONALES
INSERT INTO institucion (nombre, logo, direccion, estado, id_usuario, fecha_registro) VALUES
('CVC Regional', 'logo_cvc.png', 'Carrera 56 #11', 'ACTIVA', (SELECT id_usuario FROM usuario WHERE correo_electronico='admin@cvc.gov.co' LIMIT 1), NOW()),
('Univalle Ambiental', 'logo_uv.png', 'Calle 13 #100', 'ACTIVA', (SELECT id_usuario FROM usuario WHERE correo_electronico='admin@univalle.edu.co' LIMIT 1), NOW());

-- 3. ESTACIONES ACTIVAS
INSERT INTO estacion (nombre, longitud, latitud, estado, certificado, id_usuario, id_institucion, fecha_registro) VALUES
('Estación Flora (CVC)', -76.52, 3.48, 'ACTIVA', 'CERT-002', (SELECT id_usuario FROM usuario WHERE correo_electronico='operador.norte@correo.com' LIMIT 1), (SELECT id_institucion FROM institucion WHERE nombre='CVC Regional' LIMIT 1), NOW()),
('Estación Pance (Univalle)', -76.54, 3.35, 'ACTIVA', 'CERT-003', (SELECT id_usuario FROM usuario WHERE correo_electronico='operador.sur@correo.com' LIMIT 1), (SELECT id_institucion FROM institucion WHERE nombre='Univalle Ambiental' LIMIT 1), NOW());

-- 4. SENSORES (¡ESTO ERA LO QUE FALTABA!)
-- Creamos sensores para las estaciones nuevas. 
-- Asumimos variable 1 (PM2.5) y variable 2 (Temperatura) que ya existen.
INSERT INTO sensor (estado, fabricante, tipo, modelo, fecha_instalacion, id_usuario, id_estacion, id_variable) VALUES
('ACTIVO', 'Xiaomi', 'Laser', 'X-100', NOW(), (SELECT id_usuario FROM usuario WHERE correo_electronico='operador.norte@correo.com' LIMIT 1), (SELECT id_estacion FROM estacion WHERE nombre='Estación Flora (CVC)' LIMIT 1), 1),
('ACTIVO', 'Sony', 'Termico', 'T-200', NOW(), (SELECT id_usuario FROM usuario WHERE correo_electronico='operador.sur@correo.com' LIMIT 1), (SELECT id_estacion FROM estacion WHERE nombre='Estación Pance (Univalle)' LIMIT 1), 2);

-- 5. SOLICITUD PENDIENTE (Para el video)
INSERT INTO solicitud_estacion (nombre, longitud, latitud, estado, certificado, fecha_solicitud, id_usuario, id_institucion) VALUES
('Estación Base Aérea', -76.49, 3.46, 'PENDIENTE', 'DOC-PENDIENTE.pdf', NOW(), (SELECT id_usuario FROM usuario WHERE correo_electronico='operador.norte@correo.com' LIMIT 1), (SELECT id_institucion FROM institucion WHERE nombre='DAGMA Oficial' LIMIT 1));

-- 6. MEDICIONES SIMULADAS
-- Usamos subconsultas para encontrar el ID del sensor que acabamos de crear (el de la estación Flora)
INSERT INTO medicion (valor, fecha, id_sensor, id_variable) VALUES
(12.5, NOW() - INTERVAL '24 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(14.2, NOW() - INTERVAL '22 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(18.5, NOW() - INTERVAL '20 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(22.1, NOW() - INTERVAL '18 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(28.4, NOW() - INTERVAL '16 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(25.0, NOW() - INTERVAL '14 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(19.2, NOW() - INTERVAL '12 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(15.8, NOW() - INTERVAL '10 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(14.1, NOW() - INTERVAL '8 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(13.5, NOW() - INTERVAL '6 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(12.8, NOW() - INTERVAL '4 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(11.5, NOW() - INTERVAL '2 hours', (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1),
(12.0, NOW(), (SELECT id_sensor FROM sensor WHERE modelo='X-100' LIMIT 1), 1);

-- 7. ALERTAS
INSERT INTO alerta (nivel, valor, fecha, mensaje, id_estacion, id_variable) VALUES
('MEDIO', 28.4, NOW() - INTERVAL '16 hours', 'Aumento de material particulado', (SELECT id_estacion FROM estacion WHERE nombre='Estación Flora (CVC)' LIMIT 1), 1),
('BAJO', 18.5, NOW() - INTERVAL '20 hours', 'Leve incremento', (SELECT id_estacion FROM estacion WHERE nombre='Estación Flora (CVC)' LIMIT 1), 1);

COMMIT;