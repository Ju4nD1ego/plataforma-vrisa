-- ============================
-- INSERTS PARA TABLA VARIABLE
-- ============================
-- Contaminantes criterio
INSERT INTO Variable (tipo, nombre, unidad, descripcion) VALUES
('CONTAMINANTE', 'Material Particulado 2.5', 'µg/m³', 'Partículas finas menores a 2.5 micrómetros'),
('CONTAMINANTE', 'Material Particulado 10', 'µg/m³', 'Partículas menores a 10 micrómetros'),
('CONTAMINANTE', 'Dióxido de Azufre', 'ppb', 'Gas contaminante producido por combustión'),
('CONTAMINANTE', 'Dióxido de Nitrógeno', 'ppb', 'Gas contaminante de óxidos de nitrógeno'),
('CONTAMINANTE', 'Ozono', 'ppb', 'Contaminante secundario fotoquímico'),
('CONTAMINANTE', 'Monóxido de Carbono', 'ppm', 'Gas tóxico por combustión incompleta');

-- Variables meteorológicas
INSERT INTO Variable (tipo, nombre, unidad, descripcion) VALUES
('METEOROLOGICA', 'Temperatura', '°C', 'Temperatura del aire ambiente'),
('METEOROLOGICA', 'Humedad Relativa', '%', 'Porcentaje de humedad en el aire'),
('METEOROLOGICA', 'Velocidad del Viento', 'm/s', 'Velocidad del viento'),
('METEOROLOGICA', 'Dirección del Viento', 'grados', 'Dirección de procedencia del viento'),
('METEOROLOGICA', 'Presión Atmosférica', 'hPa', 'Presión atmosférica'),
('METEOROLOGICA', 'Precipitación', 'mm', 'Cantidad de lluvia acumulada');

-- 1. Usuario Administrador de la Institución
INSERT INTO usuario (nombre, correo_electronico, contraseña, tipo_usuario, fecha_registro)
VALUES ('Admin Dagma', 'admin@dagma.gov.co', '1234', 'INSTITUCION', NOW());

-- 2. Institución asociada (Usando subconsulta para obtener el ID automáticamente)
INSERT INTO institucion (nombre, logo, direccion, estado, id_usuario, fecha_registro)
VALUES ('DAGMA Oficial', 'logo.png', 'Av 6N', 'ACTIVA', (SELECT id_usuario FROM usuario WHERE correo_electronico='admin@dagma.gov.co' LIMIT 1), NOW());