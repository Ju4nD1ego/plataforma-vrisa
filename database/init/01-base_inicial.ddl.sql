-- ============================
-- TABLA USUARIO
-- ============================
CREATE TABLE Usuario (
    id_Usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    primer_apellido VARCHAR(100),
    segundo_apellido VARCHAR(100),
    correo_electronico VARCHAR(300) UNIQUE NOT NULL,
    contraseña VARCHAR(200) NOT NULL,
    fecha_nacimiento DATE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_usuario VARCHAR(50) NOT NULL
);

-- ============================
-- TABLA INSTITUCION
-- ============================
CREATE TABLE Institucion (
    id_Institucion SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    logo VARCHAR(500),
    direccion VARCHAR(100),
    set_colores VARCHAR(100),
    correo_electronico VARCHAR(300),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL,
    id_Usuario INT NOT NULL,
    
    FOREIGN KEY (id_Usuario) REFERENCES Usuario(id_Usuario)
);

-- ============================
-- TABLA SOLICITUD_INSTITUCION
-- ============================
CREATE TABLE Solicitud_Institucion (
    id_Solicitud SERIAL PRIMARY KEY,
    id_Usuario INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    logo VARCHAR(500),
    direccion VARCHAR(100),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL,
    
    FOREIGN KEY (id_Usuario) REFERENCES Usuario(id_Usuario)
);

-- ============================
-- TABLA ESTACION
-- ============================
CREATE TABLE Estacion (
    id_Estacion SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    longitud NUMERIC(9,6),
    latitud NUMERIC(9,6),
    estado VARCHAR(20) NOT NULL,
    certificado VARCHAR(500),
    
    id_Usuario INT NOT NULL,
    id_Institucion INT NOT NULL,
    FOREIGN KEY (id_Usuario) REFERENCES Usuario(id_Usuario),
    FOREIGN KEY (id_Institucion) REFERENCES Institucion(id_Institucion)
);

-- ============================
-- TABLA SOLICITUD_ESTACION
-- ============================
CREATE TABLE Solicitud_Estacion (
    id_Solicitud SERIAL PRIMARY KEY,
    id_Usuario INT NOT NULL,
    id_Institucion INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    longitud NUMERIC(9,6),
    latitud NUMERIC(9,6),
    certificado VARCHAR(500),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL,
    
    FOREIGN KEY (id_Usuario) REFERENCES Usuario(id_Usuario),
    FOREIGN KEY (id_Institucion) REFERENCES Institucion(id_Institucion)
);

-- ============================
-- TABLA VARIABLE
-- ============================
CREATE TABLE Variable (
    id_Variable SERIAL PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    unidad VARCHAR(20) NOT NULL,
    descripcion TEXT
);

-- ============================
-- TABLA SENSOR
-- ============================
CREATE TABLE Sensor (
    id_Sensor SERIAL PRIMARY KEY,
    fecha_instalacion DATE,
    estado VARCHAR(20) NOT NULL,
    fabricante VARCHAR(100),
    tipo VARCHAR(100),
    modelo VARCHAR(50),
    
    id_Usuario INT NOT NULL,
    id_Estacion INT NOT NULL,
    id_Variable INT NOT NULL,
    FOREIGN KEY (id_Usuario) REFERENCES Usuario(id_Usuario),
    FOREIGN KEY (id_Estacion) REFERENCES Estacion(id_Estacion),
    FOREIGN KEY (id_Variable) REFERENCES Variable(id_Variable)
);

-- ============================
-- TABLA MEDICION
-- ============================
CREATE TABLE Medicion (
    id_Medicion SERIAL PRIMARY KEY,
    id_Sensor INT NOT NULL,
    id_Variable INT NOT NULL,
    valor NUMERIC(10,3) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_Sensor) REFERENCES Sensor(id_Sensor),
    FOREIGN KEY (id_Variable) REFERENCES Variable(id_Variable)
);

-- ============================
-- TABLA ALERTA
-- ============================
CREATE TABLE Alerta (
    id_Alerta SERIAL PRIMARY KEY,
    id_Estacion INT NOT NULL,
    id_Variable INT NOT NULL,
    nivel VARCHAR(20) NOT NULL,
    valor NUMERIC(10,3) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mensaje TEXT,
    
    FOREIGN KEY (id_Estacion) REFERENCES Estacion(id_Estacion),
    FOREIGN KEY (id_Variable) REFERENCES Variable(id_Variable)
);

-- ============================
-- TABLA REPORTE
-- ============================
CREATE TABLE Reporte (
    id_Reporte SERIAL PRIMARY KEY,
    id_Usuario INT NOT NULL,
    tipo_reporte VARCHAR(50) NOT NULL,
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    
    FOREIGN KEY (id_Usuario) REFERENCES Usuario(id_Usuario)
);