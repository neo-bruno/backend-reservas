/*==============================================================*/
/* DBMS name: PostgreSQL 15+                                    */
/* Author: Rudolf & su manager técnico 😎                       */
/* Created on: 20/10/2025                                       */
/*==============================================================*/

-- ==============================================================
-- Tabla: USUARIO
-- ==============================================================
create table USUARIO (
   ID_USUARIO SERIAL primary key,
   ROL_USUARIO VARCHAR(50) not null,                -- 'admin', 'cliente', etc.
   NOMBRE_USUARIO VARCHAR(250) not null,
   TELEFONO_USUARIO VARCHAR(20) not null unique,    -- identificador principal
   CODIGO_PAIS_USUARIO VARCHAR(10) not null,                -- ej: +591
   CONTRASENA_USUARIO VARCHAR(200) not null,        -- hash con bcrypt
   VERIFICADO_USUARIO BOOLEAN default false,
   FECHA_CREACION_USUARIO TIMESTAMP default now()
);

create unique index USUARIO_TELEFONO_UK on USUARIO (TELEFONO_USUARIO);


-- ==============================================================
-- Tabla: NEGOCIO
-- ==============================================================
create table NEGOCIO (
   ID_NEGOCIO SERIAL primary key,
   TIPO_NEGOCIO VARCHAR(50) not null,               -- 'hotel', 'peluqueria', 'spa', etc.
   NOMBRE_NEGOCIO VARCHAR(250) not null,
   UBICACION_NEGOCIO TEXT not null,
   DESCRIPCION_NEGOCIO TEXT,
   TELEFONO_NEGOCIO VARCHAR(100),
   ESTADO_NEGOCIO INT default 1,                    -- 1 = activo, 0 = inactivo
   FECHA_CREACION TIMESTAMP default now()
);


-- ==============================================================
-- Tabla: HABITACION
-- ==============================================================
create table HABITACION (
   ID_HABITACION SERIAL primary key,
   ID_NEGOCIO INT not null references NEGOCIO(ID_NEGOCIO) on delete cascade,
   TIPO_HABITACION VARCHAR(50) not null,
   NUMERO_HABITACION VARCHAR(100) not null,
   NOMBRE_HABITACION VARCHAR(250) not null,
   DESCRIPCION_HABITACION TEXT,
   CAPACIDAD_HABITACION INT default 1,
   PRECIO_HABITACION NUMERIC(10,2) not null,
   ESTADO_HABITACION INT default 1,                 -- 1 = activa, 0 = fuera de servicio
   FECHA_CREACION_HABITACION TIMESTAMP default now()
);

create index HABITACION_NEGOCIO_FK on HABITACION (ID_NEGOCIO);


-- ==============================================================
-- Tabla: DISPONIBLE
-- ==============================================================
create table DISPONIBLE (
   ID_DISPONIBLE SERIAL primary key,
   ID_HABITACION INT not null references HABITACION(ID_HABITACION) on delete cascade,
   FECHA_INICIAL_DISPONIBLE DATE not null,
   HORA_INICIAL_DISPONIBLE TIME not null,
   FECHA_FINAL_DISPONIBLE DATE not null,
   HORA_FINAL_DISPONIBLE TIME not null,
   ESTADO_DISPONIBLE BOOLEAN default true,
   FUENTE_DISPONIBLE VARCHAR(50) default 'manual',
   FECHA_CREACION_DISPONIBLE TIMESTAMP default now()
);

create index DISPONIBLE_HABITACION_FK on DISPONIBLE (ID_HABITACION);
create index DISPONIBLE_FECHA_IDX on DISPONIBLE (FECHA_INICIAL_DISPONIBLE, FECHA_FINAL_DISPONIBLE);


-- ==============================================================
-- Tabla: RESERVA
-- ==============================================================
create table RESERVA (
   ID_RESERVA SERIAL primary key,
   ID_USUARIO INT not null references USUARIO(ID_USUARIO) on delete cascade,
   ID_HABITACION INT not null references HABITACION(ID_HABITACION) on delete cascade,
   CODIGO_RESERVA VARCHAR(250) not null unique,
   CHECK_IN_RESERVA TIMESTAMP not null,
   CHECK_OUT_RESERVA TIMESTAMP not null,
   HORA_LLEGADA_RESERVA TIME null,
   MONTO_TOTAL_RESERVA NUMERIC(10,2),
   ESTADO_RESERVA VARCHAR(50) not null default 'pendiente',  -- pendiente, confirmada, cancelada
   FECHA_CREACION_RESERVA TIMESTAMP default now()
);

create index RESERVA_USUARIO_FK on RESERVA (ID_USUARIO);
create index RESERVA_HABITACION_FK on RESERVA (ID_HABITACION);
create index RESERVA_FECHA_IDX on RESERVA (CHECK_IN_RESERVA, CHECK_OUT_RESERVA);


-- ==============================================================
-- Tabla: USUARIO_NEGOCIO (para admins o empleados de un negocio)
-- ==============================================================
create table USUARIO_NEGOCIO (
   ID_USUARIO_NEGOCIO SERIAL primary key,
   ID_USUARIO INT not null references USUARIO(ID_USUARIO) on delete cascade,
   ID_NEGOCIO INT not null references NEGOCIO(ID_NEGOCIO) on delete cascade,
   ROL_NEGOCIO VARCHAR(50) default 'admin',
   FECHA_CREACION TIMESTAMP default now(),
   unique (ID_USUARIO, ID_NEGOCIO)
);

create index USUARIO_NEGOCIO_FK1 on USUARIO_NEGOCIO (ID_USUARIO);
create index USUARIO_NEGOCIO_FK2 on USUARIO_NEGOCIO (ID_NEGOCIO);


-- ==============================================================
-- Tabla: CODIGO_VERIFICACION (para OTP / recuperación por WhatsApp)
-- ==============================================================
create table CODIGO_VERIFICACION (
   ID_CODIGO SERIAL primary key,
   ID_USUARIO INT not null references USUARIO(ID_USUARIO) on delete cascade,
   CODIGO VARCHAR(10) not null,
   FECHA_EXPIRACION TIMESTAMP not null,
   USADO BOOLEAN default false,
   FECHA_CREACION TIMESTAMP default now()
);

create index CODIGO_VERIFICACION_USUARIO_FK on CODIGO_VERIFICACION (ID_USUARIO);

/*==============================================================*/
/* Eliminar: Detiene los usuario de la bd_fenix                 */
/*==============================================================*/
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'bd_reservas' AND pid <> pg_backend_pid();

DROP DATABASE bd_reservas
/*==============================================================*/