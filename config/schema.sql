/*==============================================================*/
/* DBMS name: PostgreSQL 15+                                    */
/* Author: Rudolf & su manager técnico 😎                       */
/* Created on: 20/10/2025                                       */
/*==============================================================*/

/*==============================================================*/
/*      SISTEMA DE RESERVAS MULTI-NEGOCIOS                     */
/*      Autenticación por WhatsApp (Teléfono)                  */
/*      Base de datos: PostgreSQL                              */
/*      Fecha: 25/10/2025                                      */
/*==============================================================*/

-- Limpieza previa (solo usar en entorno de desarrollo)
DROP TABLE IF EXISTS usuario_negocio, usuario, rol, persona, reserva, pago,
resena, restriccion, habitacion_servicio, habitacion, servicio,
imagen, negocio, estado CASCADE;

-------------------------------------------------------------
-- TABLA ESTADO
-------------------------------------------------------------
CREATE TABLE estado (
  id_estado SERIAL PRIMARY KEY,
  nombre_estado VARCHAR(50) NOT NULL,
  descripcion_estado TEXT,
  tipo_estado VARCHAR(50) NOT NULL
);

-------------------------------------------------------------
-- TABLA ROL
-------------------------------------------------------------
CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(250) NOT NULL
);

-------------------------------------------------------------
-- TABLA PERSONA
-------------------------------------------------------------
CREATE TABLE persona (
    id_persona SERIAL PRIMARY KEY,
    nombre_persona VARCHAR(250) NOT NULL,
    documento_persona VARCHAR(50),
    expedicion_persona VARCHAR(10),
    fecha_nacimiento DATE,
    nit_persona VARCHAR(50),
    razon_social_persona VARCHAR(250),
    telefono_persona VARCHAR(30) NOT NULL,
    tipo_persona INT,
    fecha_creacion_persona TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------------------------
-- TABLA USUARIO (Autenticación por teléfono/WhatsApp)
-------------------------------------------------------------
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    id_rol INT NOT NULL REFERENCES rol(id_rol) ON UPDATE CASCADE ON DELETE RESTRICT,
    id_persona INT REFERENCES persona(id_persona) ON UPDATE CASCADE ON DELETE SET NULL,
    nombre_usuario VARCHAR(250) NOT NULL,
    telefono_usuario VARCHAR(20) NOT NULL UNIQUE, -- login principal
    codigo_pais_usuario VARCHAR(10) NOT NULL,    
    contrasena_usuario VARCHAR(200) NOT NULL,
    verificado_usuario BOOLEAN DEFAULT FALSE, -- se activa tras verificación WhatsApp
    fecha_creacion_usuario TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------------------------
-- TABLA NEGOCIO
-------------------------------------------------------------
CREATE TABLE negocio (
    id_negocio SERIAL PRIMARY KEY,
    id_estado INT NOT NULL REFERENCES estado(id_estado) ON UPDATE CASCADE ON DELETE RESTRICT,
    tipo_negocio INT NOT NULL,
    nombre_negocio VARCHAR(250) NOT NULL,
    ubicacion_negocio TEXT NOT NULL,
    descripcion_negocio TEXT NOT NULL,
    telefono_negocio VARCHAR(20) NOT NULL,
    fecha_creacion_negocio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------------------------
-- TABLA USUARIO_NEGOCIO
-------------------------------------------------------------
CREATE TABLE usuario_negocio (
    id_usuario_negocio SERIAL PRIMARY KEY,
    id_negocio INT NOT NULL REFERENCES negocio(id_negocio) ON UPDATE CASCADE ON DELETE CASCADE,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE,
    rol_usuario_negocio VARCHAR(250) NOT NULL
);

-------------------------------------------------------------
-- TABLA SERVICIO
-------------------------------------------------------------
CREATE TABLE servicio (
    id_servicio SERIAL PRIMARY KEY,
    nombre_servicio VARCHAR(250) NOT NULL,
    icono_servicio VARCHAR(100)
);

-------------------------------------------------------------
-- TABLA HABITACION
-------------------------------------------------------------
CREATE TABLE habitacion (
    id_habitacion SERIAL PRIMARY KEY,
    id_negocio INT NOT NULL REFERENCES negocio(id_negocio) ON UPDATE CASCADE ON DELETE CASCADE,
    id_estado INT NOT NULL REFERENCES estado(id_estado) ON UPDATE CASCADE ON DELETE RESTRICT,
    tipo_habitacion INT NOT NULL,
    numero_habitacion VARCHAR(100) NOT NULL,
    nombre_habitacion VARCHAR(250) NOT NULL,
    precio_habitacion NUMERIC(8,2) NOT NULL,
    descripcion_habitacion TEXT NOT NULL,
    capacidad_habitacion INT DEFAULT 1,
    fecha_creacion_habitacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------------------------
-- TABLA HABITACION_SERVICIO
-------------------------------------------------------------
CREATE TABLE habitacion_servicio (
    id_hab_servicio SERIAL PRIMARY KEY,
    id_habitacion INT NOT NULL REFERENCES habitacion(id_habitacion) ON UPDATE CASCADE ON DELETE CASCADE,
    id_servicio INT NOT NULL REFERENCES servicio(id_servicio) ON UPDATE CASCADE ON DELETE RESTRICT
);

-------------------------------------------------------------
-- TABLA IMAGEN
-------------------------------------------------------------
CREATE TABLE imagen (
    id_imagen SERIAL PRIMARY KEY,
    id_habitacion INT REFERENCES habitacion(id_habitacion) ON UPDATE CASCADE ON DELETE CASCADE,
    id_negocio INT REFERENCES negocio(id_negocio) ON UPDATE CASCADE ON DELETE CASCADE,
    url_imagen TEXT NOT NULL,
    descripcion_imagen TEXT,
    fecha_creacion_imagen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------------------------
-- TABLA RESTRICCION (fechas NO disponibles)
-------------------------------------------------------------
CREATE TABLE restriccion (
    id_restriccion SERIAL PRIMARY KEY,
    id_habitacion INT NOT NULL REFERENCES habitacion(id_habitacion) ON UPDATE CASCADE ON DELETE CASCADE,
    fecha_inicial_restriccion DATE NOT NULL,
    hora_inicial_restriccion TIME NOT NULL,
    fecha_final_restriccion DATE NOT NULL,
    hora_final_restriccion TIME NOT NULL,
    motivo_restriccion TEXT,
    estado_restriccion INT,
    fecha_creacion_restriccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------------------------
-- TABLA RESERVA
-------------------------------------------------------------
CREATE TABLE reserva (
    id_reserva SERIAL PRIMARY KEY,
    id_estado INT NOT NULL REFERENCES estado(id_estado) ON UPDATE CASCADE ON DELETE RESTRICT,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE,
    id_habitacion INT NOT NULL REFERENCES habitacion(id_habitacion) ON UPDATE CASCADE ON DELETE CASCADE,
    id_restriccion INT REFERENCES restriccion(id_restriccion) ON UPDATE CASCADE ON DELETE SET NULL,
    id_persona INT NOT NULL REFERENCES persona(id_persona) ON UPDATE CASCADE ON DELETE RESTRICT,
    codigo_reserva VARCHAR(250) NOT NULL UNIQUE,
    check_in_reserva DATE NOT NULL,
    check_out_reserva DATE NOT NULL,
    hora_llegada_reserva TIME,
    monto_total_reserva NUMERIC(10,2),
    observacion_reserva TEXT,
    fecha_creacion_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------------------------
-- TABLA PAGO
-------------------------------------------------------------
CREATE TABLE pago (
    id_pago SERIAL PRIMARY KEY,
    id_reserva INT NOT NULL REFERENCES reserva(id_reserva) ON UPDATE CASCADE ON DELETE CASCADE,
    monto_pago NUMERIC(8,2) NOT NULL,
    tipo_pago INT NOT NULL,
    metodo_pago INT NOT NULL,
    comision_pago NUMERIC(8,2),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_pago INT NOT NULL,
    fecha_creacion_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------------------------
-- TABLA RESENA
-------------------------------------------------------------
CREATE TABLE resena (
    id_resena SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE,
    id_reserva INT NOT NULL REFERENCES reserva(id_reserva) ON UPDATE CASCADE ON DELETE CASCADE,
    puntuacion_resena INT,
    comentario_resena TEXT,
    fecha_creacion_resena TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*==============================================================*/
/* Insertar: Datos a la tabla Rol pre-definidos                 */
/*==============================================================*/
INSERT INTO public.rol(
	nombre_rol)
	VALUES ('Admin');
	
INSERT INTO public.rol(
	nombre_rol)
	VALUES ('Cliente');
/*==============================================================*/


/*==============================================================*/
/* Insertar: Datos a la tabla Estado pre-definidos                 */
/*==============================================================*/
-- 🔹 ESTADOS DE HABITACIÓN
INSERT INTO estado (nombre_estado, descripcion_estado, tipo_estado) VALUES
('disponible', 'Habitación lista para recibir huéspedes.', 'habitacion'),
('ocupada', 'Habitación actualmente con huéspedes.', 'habitacion'),
('en limpieza', 'Habitación en proceso de limpieza o mantenimiento.', 'habitacion'),
('fuera de servicio', 'Habitación no disponible por reparación u otra causa.', 'habitacion');

-- 🔹 ESTADOS DE RESERVA
INSERT INTO estado (nombre_estado, descripcion_estado, tipo_estado) VALUES
('pendiente', 'Reserva creada pero aún no pagada o confirmada.', 'reserva'),
('confirmada', 'Reserva confirmada y pagada.', 'reserva'),
('cancelada', 'Reserva cancelada por el cliente o el administrador.', 'reserva'),
('completada', 'Reserva finalizada exitosamente.', 'reserva'),
('no show', 'El huésped no se presentó en la fecha indicada.', 'reserva');

-- 🔹 ESTADOS DE RESTRICCIÓN
INSERT INTO estado (nombre_estado, descripcion_estado, tipo_estado) VALUES
('activa', 'Rango de fechas restringido actualmente.', 'restriccion'),
('expirada', 'Rango de restricción que ya ha terminado.', 'restriccion');

-- 🔹 ESTADOS DE USUARIO
INSERT INTO estado (nombre_estado, descripcion_estado, tipo_estado) VALUES
('activo', 'Usuario con acceso y permisos vigentes en el sistema.', 'usuario'),
('inactivo', 'Usuario deshabilitado temporalmente.', 'usuario'),
('verificado', 'Usuario con número telefónico validado por WhatsApp.', 'usuario');

-- 🔹 ESTADOS DE NEGOCIO
INSERT INTO estado (nombre_estado, descripcion_estado, tipo_estado) VALUES
('activo', 'Negocio en funcionamiento y visible para los usuarios.', 'negocio'),
('inactivo', 'Negocio temporalmente deshabilitado por el administrador.', 'negocio'),
('en revisión', 'Negocio pendiente de verificación o aprobación.', 'negocio'),
('bloqueado', 'Negocio bloqueado por incumplir políticas del sistema.', 'negocio');

/*=============================================================================*/


/*==============================================================*/
/* Eliminar: Detiene los usuario de la bd_fenix                 */
/*==============================================================*/
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'bd_reservas' AND pid <> pg_backend_pid();

DROP DATABASE bd_reservas
/*==============================================================*/