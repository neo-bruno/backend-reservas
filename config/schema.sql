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

/*==============================================================*/
/* DBMS name:      PostgreSQL 9.x                               */
/* Created on:     08/01/2026 14:43:26                          */
/*==============================================================*/

/*==============================================================*/
/* DBMS name:      PostgreSQL 9.x                               */
/* Created on:     09/01/2026 12:08:37                          */
/*==============================================================*/

/*==============================================================*/
/* DBMS name:      PostgreSQL 9.x                               */
/* Created on:     06/02/2026 12:10:25                          */
/*==============================================================*/

/*==============================================================*/
/* Table: CAMA                                                  */
/*==============================================================*/
create table CAMA (
   ID_CAMA              SERIAL               not null,
   TIPO_CAMA            VARCHAR(250)         null,
   DESCRIPCION_CAMA     TEXT                 null,
   COSTO_CAMA           NUMERIC(8,2)         null,
   CANT_PERSONA_CAMA    INT4                 null,
   TIPO_PERSONA_CAMA    VARCHAR(250)         null,
   ICONO_PERSONA_CAMA   VARCHAR(250)         null,
   constraint PK_CAMA primary key (ID_CAMA)
);

/*==============================================================*/
/* Index: CAMA_PK                                               */
/*==============================================================*/
create unique index CAMA_PK on CAMA (
ID_CAMA
);

/*==============================================================*/
/* Table: CATEGORIA                                             */
/*==============================================================*/
create table CATEGORIA (
   ID_CATEGORIA         SERIAL               not null,
   NOMBRE_CATEGORIA     VARCHAR(250)         not null,
   DESCRIPCION_CATEGORIA TEXT                 null,
   PRECIO_AHORA_CATEGORIA NUMERIC(8,2)         null,
   PRECIO_ANTES_CATEGORIA NUMERIC(8,2)         null,
   DESCUENTO_CATEGORIA  NUMERIC(8,2)         null,
   CANT_NOCHES_CATEGORIA INT4                 null,
   constraint PK_CATEGORIA primary key (ID_CATEGORIA)
);

/*==============================================================*/
/* Index: CATEGORIA_PK                                          */
/*==============================================================*/
create unique index CATEGORIA_PK on CATEGORIA (
ID_CATEGORIA
);

/*==============================================================*/
/* Table: FOTO                                                  */
/*==============================================================*/
create table FOTO (
   ID_FOTO              SERIAL               not null,
   ID_SECCION           INT4                 not null,
   NOMBRE_FOTO          VARCHAR(250)         null,
   URL_FOTO             TEXT                 null,
   constraint PK_FOTO primary key (ID_FOTO)
);

/*==============================================================*/
/* Index: FOTO_PK                                               */
/*==============================================================*/
create unique index FOTO_PK on FOTO (
ID_FOTO
);

/*==============================================================*/
/* Table: HABITACION                                            */
/*==============================================================*/
create table HABITACION (
   ID_HABITACION        SERIAL               not null,
   ID_CATEGORIA         INT4                 not null,
   ID_NIVEL             INT4                 not null,
   NUMERO_HABITACION    VARCHAR(100)         not null,
   NOMBRE_HABITACION    VARCHAR(250)         not null,
   ADULTOS_HABITACION   INT4                 null,
   NINOS_HABITACION     INT4                 null,
   DESCRIPCION_HABITACION TEXT                 null,
   DETALLE_HABITACION   TEXT                 null,
   ESTADO_HABITACION    INT4                 null,
   constraint PK_HABITACION primary key (ID_HABITACION)
);

/*==============================================================*/
/* Index: HABITACION_PK                                         */
/*==============================================================*/
create unique index HABITACION_PK on HABITACION (
ID_HABITACION
);

/*==============================================================*/
/* Index: CATEGORIA_HABITACION_FK                               */
/*==============================================================*/
create  index CATEGORIA_HABITACION_FK on HABITACION (
ID_CATEGORIA
);

/*==============================================================*/
/* Index: NIVEL_HABITACION_FK                                   */
/*==============================================================*/
create  index NIVEL_HABITACION_FK on HABITACION (
ID_NIVEL
);

/*==============================================================*/
/* Table: HABITACION_CAMA                                       */
/*==============================================================*/
create table HABITACION_CAMA (
   ID_HABITACION_CAMA   SERIAL               not null,
   ID_HABITACION        INT4                 not null,
   ID_CAMA              INT4                 not null,
   CANTIDAD_HAB_CAMA    INT4                 null,
   COSTO_HAB_CAMA       NUMERIC(8,2)         null,
   TOTAL_HAB_CAMA       NUMERIC(8,2)         null,
   constraint PK_HABITACION_CAMA primary key (ID_HABITACION_CAMA)
);

/*==============================================================*/
/* Index: HABITACION_CAMA_PK                                    */
/*==============================================================*/
create unique index HABITACION_CAMA_PK on HABITACION_CAMA (
ID_HABITACION_CAMA
);

/*==============================================================*/
/* Index: CAMA_HABITACION_CAMA_FK                               */
/*==============================================================*/
create  index CAMA_HABITACION_CAMA_FK on HABITACION_CAMA (
ID_CAMA
);

/*==============================================================*/
/* Index: HABITACION_CAMA_HABITACION_FK                         */
/*==============================================================*/
create  index HABITACION_CAMA_HABITACION_FK on HABITACION_CAMA (
ID_HABITACION
);

/*==============================================================*/
/* Table: ICONO                                                 */
/*==============================================================*/
create table ICONO (
   ID_ICONO             SERIAL               not null,
   ID_SECCION           INT4                 not null,
   NOMBRE_ICONO         TEXT                 null,
   TITULO_ICONO         TEXT                 null,
   SUBTITULO_ICONO      TEXT                 null,
   DESCRIPCION_ICONO    TEXT                 null,
   constraint PK_ICONO primary key (ID_ICONO)
);

/*==============================================================*/
/* Index: ICONO_PK                                              */
/*==============================================================*/
create unique index ICONO_PK on ICONO (
ID_ICONO
);

/*==============================================================*/
/* Table: IMAGEN                                                */
/*==============================================================*/
create table IMAGEN (
   ID_IMAGEN            SERIAL               not null,
   ID_HABITACION        INT4                 not null,
   URL_IMAGEN           TEXT                 not null,
   NOMBRE_IMAGEN        TEXT                 null,
   constraint PK_IMAGEN primary key (ID_IMAGEN)
);

/*==============================================================*/
/* Index: IMAGEN_PK                                             */
/*==============================================================*/
create unique index IMAGEN_PK on IMAGEN (
ID_IMAGEN
);

/*==============================================================*/
/* Index: IMAGEN_HABITACION_FK                                  */
/*==============================================================*/
create  index IMAGEN_HABITACION_FK on IMAGEN (
ID_HABITACION
);

/*==============================================================*/
/* Table: NEGOCIO                                               */
/*==============================================================*/
create table NEGOCIO (
   ID_NEGOCIO           SERIAL               not null,
   TIPO_NEGOCIO         INT4                 not null,
   NOMBRE_NEGOCIO       VARCHAR(250)         not null,
   UBICACION_NEGOCIO    TEXT                 not null,
   DESCRIPCION_NEGOCIO  TEXT                 not null,
   TELEFONO_NEGOCIO     VARCHAR(20)          not null,
   ESTADO_NEGOCIO       INT4                 null,
   URL_NEGOCIO          TEXT                 null,
   NOMBRE_URL_NEGOCIO   VARCHAR(250)         null,
   constraint PK_NEGOCIO primary key (ID_NEGOCIO)
);

/*==============================================================*/
/* Index: NEGOCIO_PK                                            */
/*==============================================================*/
create unique index NEGOCIO_PK on NEGOCIO (
ID_NEGOCIO
);

/*==============================================================*/
/* Table: NIVEL                                                 */
/*==============================================================*/
create table NIVEL (
   ID_NIVEL             SERIAL               not null,
   NOMBRE_NIVEL         VARCHAR(100)         not null,
   DESCRIPCION_NIVEL    TEXT                 null,
   ICONO_NIVEL          TEXT                 null,
   constraint PK_NIVEL primary key (ID_NIVEL)
);

/*==============================================================*/
/* Index: NIVEL_PK                                              */
/*==============================================================*/
create unique index NIVEL_PK on NIVEL (
ID_NIVEL
);

/*==============================================================*/
/* Table: PAGO                                                  */
/*==============================================================*/
create table PAGO (
   ID_PAGO              SERIAL               not null,
   ID_RESERVA           INT4                 not null,
   MONTO_PAGO           NUMERIC(8,2)         null,
   TIPO_PAGO            INT4                 not null,
   METODO_PAGO          INT4                 not null,
   COMISION_PAGO        NUMERIC(8,2)         null,
   FECHA_PAGO           DATE                 not null,
   ESTADO_PAGO          INT4                 not null,
   URL_PAGO             TEXT                 null,
   constraint PK_PAGO primary key (ID_PAGO)
);

/*==============================================================*/
/* Index: PAGO_PK                                               */
/*==============================================================*/
create unique index PAGO_PK on PAGO (
ID_PAGO
);

/*==============================================================*/
/* Index: PAGO_RESERVA_FK                                       */
/*==============================================================*/
create  index PAGO_RESERVA_FK on PAGO (
ID_RESERVA
);

/*==============================================================*/
/* Table: PERSONA                                               */
/*==============================================================*/
create table PERSONA (
   ID_PERSONA           SERIAL               not null,
   NOMBRE_PERSONA       VARCHAR(250)         not null,
   DOCUMENTO_PERSONA    VARCHAR(50)          null,
   EXPEDICION_PERSONA   VARCHAR(10)          null,
   FECHA_NACIMIENTO_PERSONA DATE                 null,
   NIT_PERSONA          VARCHAR(122)         null,
   RAZON_SOCIAL_PERSONA VARCHAR(250)         null,
   TELEFONO_PERSONA     VARCHAR(1024)        null,
   TIPO_PERSONA         INT4                 null,
   constraint PK_PERSONA primary key (ID_PERSONA)
);

/*==============================================================*/
/* Index: PERSONA_PK                                            */
/*==============================================================*/
create unique index PERSONA_PK on PERSONA (
ID_PERSONA
);

/*==============================================================*/
/* Table: PIE                                                   */
/*==============================================================*/
create table PIE (
   ID_PIE               SERIAL               not null,
   ID_SECCION           INT4                 not null,
   NOMBRE_PIE           TEXT                 null,
   URL_PIE              TEXT                 null,
   MAPA_PIE             TEXT                 null,
   constraint PK_PIE primary key (ID_PIE)
);

/*==============================================================*/
/* Index: PIE_PK                                                */
/*==============================================================*/
create unique index PIE_PK on PIE (
ID_PIE
);

/*==============================================================*/
/* Table: RESENA                                                */
/*==============================================================*/
create table RESENA (
   ID_RESENA            SERIAL               not null,
   ID_HABITACION        INT4                 not null,
   ID_USUARIO           INT4                 not null,
   FECHA_RESENA         DATE                 null,
   PUNTUACION_RESENA    INT4                 null,
   COMENTARIO_RESENA    TEXT                 null,
   ESTADO_RESENA        BOOL                 not null default false,
   constraint PK_RESENA primary key (ID_RESENA)
);

/*==============================================================*/
/* Index: RESENA_PK                                             */
/*==============================================================*/
create unique index RESENA_PK on RESENA (
ID_RESENA
);

/*==============================================================*/
/* Index: RESENA_USUARIO_FK                                     */
/*==============================================================*/
create  index RESENA_USUARIO_FK on RESENA (
ID_USUARIO
);

/*==============================================================*/
/* Index: RESENA_HABITACION_FK                                  */
/*==============================================================*/
create  index RESENA_HABITACION_FK on RESENA (
ID_HABITACION
);

/*==============================================================*/
/* Table: RESERVA                                               */
/*==============================================================*/
create table RESERVA (
   ID_RESERVA           SERIAL               not null,
   ID_USUARIO           INT4                 not null,
   ID_PERSONA           INT4                 not null,
   ID_HABITACION        INT4                 not null,
   ID_RESTRICCION       INT4                 not null,
   CODIGO_RESERVA       VARCHAR(250)         not null,
   FECHA_RESERVA        DATE                 null,
   CHECK_IN_RESERVA     DATE                 not null,
   CHECK_OUT_RESERVA    DATE                 not null,
   HORA_LLEGADA_RESERVA TIME                 null,
   TOTAL_ESTADIA_RESERVA NUMERIC(8,2)         null,
   DESCUENTO_RESERVA    NUMERIC(8,2)         null,
   SERVICIO_RESERVA     NUMERIC(8,2)         null,
   MONTO_TOTAL_RESERVA  NUMERIC(8,2)         null,
   ESTADO_RESERVA       INT4                 null,
   OBSERVACION_RESERVA  TEXT                 null,
   CONDICION_RESERVA    INT4                 null,
   constraint PK_RESERVA primary key (ID_RESERVA)
);

/*==============================================================*/
/* Index: RESERVA_PK                                            */
/*==============================================================*/
create unique index RESERVA_PK on RESERVA (
ID_RESERVA
);

/*==============================================================*/
/* Index: RESERVA_USUARIO_FK                                    */
/*==============================================================*/
create  index RESERVA_USUARIO_FK on RESERVA (
ID_USUARIO
);

/*==============================================================*/
/* Index: RESERVA_HABITACION_FK                                 */
/*==============================================================*/
create  index RESERVA_HABITACION_FK on RESERVA (
ID_HABITACION
);

/*==============================================================*/
/* Index: RESERVA_RESTRICCION_FK                                */
/*==============================================================*/
create  index RESERVA_RESTRICCION_FK on RESERVA (
ID_RESTRICCION
);

/*==============================================================*/
/* Index: RESERVA_PERSONA_FK                                    */
/*==============================================================*/
create  index RESERVA_PERSONA_FK on RESERVA (
ID_PERSONA
);

/*==============================================================*/
/* Table: RESTRICCION                                           */
/*==============================================================*/
create table RESTRICCION (
   ID_RESTRICCION       SERIAL               not null,
   ID_HABITACION        INT4                 not null,
   FECHA_INICIAL_RESTRICCION DATE                 not null,
   HORA_INICIAL_RESTRICCION TIME                 not null,
   FECHA_FINAL_RESTRICCION DATE                 not null,
   HORA_FINAL_RESTRICCION TIME                 not null,
   MOTIVO_RESTRICCION   TEXT                 null,
   ESTADO_RESTRICCION   INT4                 null,
   constraint PK_RESTRICCION primary key (ID_RESTRICCION)
);

/*==============================================================*/
/* Index: RESTRICCION_PK                                        */
/*==============================================================*/
create unique index RESTRICCION_PK on RESTRICCION (
ID_RESTRICCION
);

/*==============================================================*/
/* Index: RESTRICCION_HABITACION_FK                             */
/*==============================================================*/
create  index RESTRICCION_HABITACION_FK on RESTRICCION (
ID_HABITACION
);

/*==============================================================*/
/* Table: ROL                                                   */
/*==============================================================*/
create table ROL (
   ID_ROL               SERIAL               not null,
   NOMBRE_ROL           VARCHAR(250)         not null,
   constraint PK_ROL primary key (ID_ROL)
);

/*==============================================================*/
/* Index: ROL_PK                                                */
/*==============================================================*/
create unique index ROL_PK on ROL (
ID_ROL
);

/*==============================================================*/
/* Table: SECCION                                               */
/*==============================================================*/
create table SECCION (
   ID_SECCION           SERIAL               not null,
   ID_NEGOCIO           INT4                 not null,
   TIPO_SECCION         INT4                 null,
   NOMBRE_SECCION       TEXT                 null,
   TITULO_SECCION       TEXT                 null,
   SUBTITULO_SECCION    TEXT                 null,
   DETALLE_SECCION      TEXT                 null,
   DESCRIPCION_SECCION  TEXT                 null,
   URL_SECCION          TEXT                 null,
   VIDEO_SECCION        TEXT                 null,
   constraint PK_SECCION primary key (ID_SECCION)
);

/*==============================================================*/
/* Index: SECCION_PK                                            */
/*==============================================================*/
create unique index SECCION_PK on SECCION (
ID_SECCION
);

/*==============================================================*/
/* Index: SECCION_NEGOCIO_FK                                    */
/*==============================================================*/
create  index SECCION_NEGOCIO_FK on SECCION (
ID_NEGOCIO
);

/*==============================================================*/
/* Table: SERVICIO                                              */
/*==============================================================*/
create table SERVICIO (
   ID_SERVICIO          SERIAL               not null,
   NOMBRE_SERVICIO      VARCHAR(250)         not null,
   ICONO_SERVICIO       VARCHAR(100)         not null,
   constraint PK_SERVICIO primary key (ID_SERVICIO)
);

/*==============================================================*/
/* Index: SERVICIO_PK                                           */
/*==============================================================*/
create unique index SERVICIO_PK on SERVICIO (
ID_SERVICIO
);

/*==============================================================*/
/* Table: SERVICIO_HAB                                          */
/*==============================================================*/
create table SERVICIO_HAB (
   ID_SERVICIO_HAB      SERIAL               not null,
   ID_HABITACION        INT4                 not null,
   ID_SERVICIO          INT4                 not null,
   constraint PK_SERVICIO_HAB primary key (ID_SERVICIO_HAB)
);

/*==============================================================*/
/* Index: SERVICIO_HAB_PK                                       */
/*==============================================================*/
create unique index SERVICIO_HAB_PK on SERVICIO_HAB (
ID_SERVICIO_HAB
);

/*==============================================================*/
/* Index: HAB_SERV_HAB_FK                                       */
/*==============================================================*/
create  index HAB_SERV_HAB_FK on SERVICIO_HAB (
ID_HABITACION
);

/*==============================================================*/
/* Index: SERVICIO_HABITACION_SERVICIO_FK                       */
/*==============================================================*/
create  index SERVICIO_HABITACION_SERVICIO_FK on SERVICIO_HAB (
ID_SERVICIO
);

/*==============================================================*/
/* Table: USUARIO                                               */
/*==============================================================*/
create table USUARIO (
   ID_USUARIO           SERIAL               not null,
   ID_ROL               INT4                 not null,
   ID_PERSONA           INT4                 not null,
   NOMBRE_USUARIO       VARCHAR(250)         null,
   TELEFONO_USUARIO     VARCHAR(20)          not null,
   CODIGO_PAIS_USUARIO  VARCHAR(10)          not null,
   CONTRASENA_USUARIO   VARCHAR(200)         not null,
   VERIFICADO_USUARIO   BOOL                 null default false,
   EMAIL_USUARIO        VARCHAR(250)         null,
   VERIFICADO_PHONE_USUARIO BOOL                 null default false,
   VERIFICADO_EMAIL_USUARIO BOOL                 null default false,
   METODO_REGISTRO_USUARIO VARCHAR(250)         null,
   constraint PK_USUARIO primary key (ID_USUARIO)
);

/*==============================================================*/
/* Index: USUARIO_PK                                            */
/*==============================================================*/
create unique index USUARIO_PK on USUARIO (
ID_USUARIO
);

/*==============================================================*/
/* Index: USUARIO_PERSONA_FK                                    */
/*==============================================================*/
create  index USUARIO_PERSONA_FK on USUARIO (
ID_PERSONA
);

/*==============================================================*/
/* Index: USUARIO_ROL_FK                                        */
/*==============================================================*/
create  index USUARIO_ROL_FK on USUARIO (
ID_ROL
);

/*==============================================================*/
/* Table: USUARIO_NEGOCIO                                       */
/*==============================================================*/
create table USUARIO_NEGOCIO (
   ID_USUARIO_NEGOCIO   SERIAL               not null,
   ID_NEGOCIO           INT4                 not null,
   ID_USUARIO           INT4                 not null,
   ROL_USUARIO_NEGOCIO  VARCHAR(250)         not null,
   constraint PK_USUARIO_NEGOCIO primary key (ID_USUARIO_NEGOCIO)
);

/*==============================================================*/
/* Index: USUARIO_NEGOCIO_PK                                    */
/*==============================================================*/
create unique index USUARIO_NEGOCIO_PK on USUARIO_NEGOCIO (
ID_USUARIO_NEGOCIO
);

/*==============================================================*/
/* Index: USUARIO_NEGOCIO_USUARIO_FK                            */
/*==============================================================*/
create  index USUARIO_NEGOCIO_USUARIO_FK on USUARIO_NEGOCIO (
ID_USUARIO
);

/*==============================================================*/
/* Index: USUARIO_NEGOCIO_NEGOCIO_FK                            */
/*==============================================================*/
create  index USUARIO_NEGOCIO_NEGOCIO_FK on USUARIO_NEGOCIO (
ID_NEGOCIO
);

CREATE TABLE password_resets (
  id_reset SERIAL PRIMARY KEY,
  id_usuario INT NOT NULL,
  token_hash VARCHAR(64) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);


alter table FOTO
   add constraint FK_FOTO_SECCION_F_SECCION foreign key (ID_SECCION)
      references SECCION (ID_SECCION)
      on delete restrict on update restrict;

alter table HABITACION
   add constraint FK_HABITACI_CATEGORIA_CATEGORI foreign key (ID_CATEGORIA)
      references CATEGORIA (ID_CATEGORIA)
      on delete restrict on update restrict;

alter table HABITACION
   add constraint FK_HABITACI_NIVEL_HAB_NIVEL foreign key (ID_NIVEL)
      references NIVEL (ID_NIVEL)
      on delete restrict on update restrict;

alter table HABITACION_CAMA
   add constraint FK_HABITACI_CAMA_HABI_CAMA foreign key (ID_CAMA)
      references CAMA (ID_CAMA)
      on delete restrict on update restrict;

alter table HABITACION_CAMA
   add constraint FK_HABITACI_HABITACIO_HABITACI foreign key (ID_HABITACION)
      references HABITACION (ID_HABITACION)
      on delete restrict on update restrict;

alter table ICONO
   add constraint FK_ICONO_SECCION_I_SECCION foreign key (ID_SECCION)
      references SECCION (ID_SECCION)
      on delete restrict on update restrict;

alter table IMAGEN
   add constraint FK_IMAGEN_IMAGEN_HA_HABITACI foreign key (ID_HABITACION)
      references HABITACION (ID_HABITACION)
      on delete restrict on update restrict;

alter table PAGO
   add constraint FK_PAGO_PAGO_RESE_RESERVA foreign key (ID_RESERVA)
      references RESERVA (ID_RESERVA)
      on delete restrict on update restrict;

alter table PIE
   add constraint FK_PIE_SECCION_P_SECCION foreign key (ID_SECCION)
      references SECCION (ID_SECCION)
      on delete restrict on update restrict;

alter table RESENA
   add constraint FK_RESENA_RESENA_HA_HABITACI foreign key (ID_HABITACION)
      references HABITACION (ID_HABITACION)
      on delete restrict on update restrict;

alter table RESENA
   add constraint FK_RESENA_RESENA_US_USUARIO foreign key (ID_USUARIO)
      references USUARIO (ID_USUARIO)
      on delete restrict on update restrict;

alter table RESERVA
   add constraint FK_RESERVA_RESERVA_H_HABITACI foreign key (ID_HABITACION)
      references HABITACION (ID_HABITACION)
      on delete restrict on update restrict;

alter table RESERVA
   add constraint FK_RESERVA_RESERVA_P_PERSONA foreign key (ID_PERSONA)
      references PERSONA (ID_PERSONA)
      on delete restrict on update restrict;

alter table RESERVA
   add constraint FK_RESERVA_RESERVA_R_RESTRICC foreign key (ID_RESTRICCION)
      references RESTRICCION (ID_RESTRICCION)
      on delete restrict on update restrict;

alter table RESERVA
   add constraint FK_RESERVA_RESERVA_U_USUARIO foreign key (ID_USUARIO)
      references USUARIO (ID_USUARIO)
      on delete restrict on update restrict;

alter table RESTRICCION
   add constraint FK_RESTRICC_RESTRICCI_HABITACI foreign key (ID_HABITACION)
      references HABITACION (ID_HABITACION)
      on delete restrict on update restrict;

alter table SECCION
   add constraint FK_SECCION_SECCION_N_NEGOCIO foreign key (ID_NEGOCIO)
      references NEGOCIO (ID_NEGOCIO)
      on delete restrict on update restrict;

alter table SERVICIO_HAB
   add constraint FK_SERVICIO_HAB_SERV__HABITACI foreign key (ID_HABITACION)
      references HABITACION (ID_HABITACION)
      on delete restrict on update restrict;

alter table SERVICIO_HAB
   add constraint FK_SERVICIO_SERVICIO__SERVICIO foreign key (ID_SERVICIO)
      references SERVICIO (ID_SERVICIO)
      on delete restrict on update restrict;

alter table USUARIO
   add constraint FK_USUARIO_USUARIO_P_PERSONA foreign key (ID_PERSONA)
      references PERSONA (ID_PERSONA)
      on delete restrict on update restrict;

alter table USUARIO
   add constraint FK_USUARIO_USUARIO_R_ROL foreign key (ID_ROL)
      references ROL (ID_ROL)
      on delete restrict on update restrict;

alter table USUARIO_NEGOCIO
   add constraint FK_USUARIO__USUARIO_N_NEGOCIO foreign key (ID_NEGOCIO)
      references NEGOCIO (ID_NEGOCIO)
      on delete restrict on update restrict;

alter table USUARIO_NEGOCIO
   add constraint FK_USUARIO__USUARIO_N_USUARIO foreign key (ID_USUARIO)
      references USUARIO (ID_USUARIO)
      on delete restrict on update restrict;





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
/* Insertar: Datos a la tabla cama pre-definidos                 */
/*==============================================================*/
-- insertar tipo de camas y comision
INSERT INTO public.cama(
tipo_cama, descripcion_cama, costo_cama, cant_persona_cama, tipo_persona_cama, icono_persona_cama)
VALUES ('simple', 'cama de 1½ plaza (105-120cm x 190-200cm)', 10, 1, 'adulto / niño', 'human-male');

INSERT INTO public.cama(
tipo_cama, descripcion_cama, costo_cama, cant_persona_cama, tipo_persona_cama, icono_persona_cama)
VALUES ('litera', 'cama de 1 plaza (~ 90cm x 190cm)', 8, 1, 'adulto / niño', 'human-male');

INSERT INTO public.cama(
tipo_cama, descripcion_cama, costo_cama, cant_persona_cama, tipo_persona_cama, icono_persona_cama)
VALUES ('cama supletoria', 'cama de 1 plaza (~ 90cm x 190cm)', 8, 1, 'adulto / niño', 'human-male');

INSERT INTO public.cama(
tipo_cama, descripcion_cama, costo_cama, cant_persona_cama, tipo_persona_cama, icono_persona_cama)
VALUES ('sofa cama', 'cama de 1 plaza (variable)', 5, 1, 'adulto / niño', 'human-male');

INSERT INTO public.cama(
tipo_cama, descripcion_cama, costo_cama, cant_persona_cama, tipo_persona_cama, icono_persona_cama)
VALUES ('cuna', 'cuna para bebe c/colchon especial', 5, 1, 'bebe', 'baby-carriage');

INSERT INTO public.cama(
tipo_cama, descripcion_cama, costo_cama, cant_persona_cama, tipo_persona_cama, icono_persona_cama)
VALUES ('matrimonial', 'cama de 2 plazas (135-160cm x 190-200cm)', 20, 2, 'adultos', 'human-male-female');

INSERT INTO public.cama(
tipo_cama, descripcion_cama, costo_cama, cant_persona_cama, tipo_persona_cama, icono_persona_cama)
VALUES ('suit', 'cama de 2½ plazas (180-200cm x 200-210cm)', 25, 2, 'adultos', 'human-male-female');

/*=============================================================================*/

/*==============================================================================*/
INSERT INTO public.negocio(
	tipo_negocio, nombre_negocio, ubicacion_negocio, descripcion_negocio, telefono_negocio, estado_negocio)
	VALUES (1, 'Hotel Felipez', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3663.6554784754126!2d-66.15938362493647!3d-17.391353164301915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93e373f62e1181c5%3A0x47bc3b6db48c0a00!2sFelipez%20Hotel!5e1!3m2!1ses!2sbo!4v1767986977741!5m2!1ses!2sbo', 'Hotel de 3 estrellas, con buen servicio de desayuno y las habitaciones limpias y bien mantenidas', '77409001 - 4 4510773', 1);
/*==============================================================================*/

/*==============================================================================*/
-- INSERTAMOS LA PRIMERA SECCION CON TIPO = 1

INSERT INTO public.seccion(
	id_negocio, tipo_seccion, nombre_seccion, titulo_seccion, subtitulo_seccion, detalle_seccion, descripcion_seccion, url_seccion, video_seccion)
	VALUES (1, 1, '', 'Nuestros servicios nos caracteriza', 'Convencete <br> y siente la calidez...!', '', '', '', 'https://www.ansonika.com/paradise/html-menu-3/video/sunset.mp4');	
/*==============================================================================*/

/*==============================================================================*/
-- INSERTAMOS LA SEGUNDA SECCION CON TIPO = 2

INSERT INTO public.seccion(
	id_negocio, tipo_seccion, nombre_seccion, titulo_seccion, subtitulo_seccion, detalle_seccion, descripcion_seccion, url_seccion, video_seccion)
	VALUES (1, 2, 'Sobre Nosotros', 'Tailored services and the experience of unique holidays', 'Vivamus volutpat eros pulvinar velit laoreet, sit amet egestas erat dignissim.', 'Maria...the Owner', 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.', '', '');

-- INSERTAMOS FOTOS A LA SEGUNDA SECCION CON ID_SECCION = 2
INSERT INTO public.foto(
	id_seccion, nombre_foto, url_foto)
	VALUES (2, '', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBVNilXQ180kLC_S7990l0zAtCVu1rZ3no5g&s');
INSERT INTO public.foto(
	id_seccion, nombre_foto, url_foto)
	VALUES (2, '', 'https://enzomuebles.com/wp-content/uploads/2023/01/dormitorio-moderno-ventana.jpg');
INSERT INTO public.foto(
	id_seccion, nombre_foto, url_foto)
	VALUES (2, '', 'https://media.gettyimages.com/id/1266155634/es/foto/lujosos-y-elegantes-interiores-de-dormitorio.jpg?s=1024x1024&w=gi&k=20&c=CzT_9g39vpyysJoMgqjvsGtEXKztoRjswiRLC3RLCMI=');
INSERT INTO public.foto(
	id_seccion, nombre_foto, url_foto)
	VALUES (2, '', 'https://media.gettyimages.com/id/1334117334/es/foto/render-digital-de-una-gran-habitaci%C3%B3n-en-suite-de-hotel.jpg?s=612x612&w=0&k=20&c=qBkhTfkm4NCZbxj8PSy_8xbSSysqQcKBJNcdrASvvVU=');
INSERT INTO public.foto(
	id_seccion, nombre_foto, url_foto)
	VALUES (2, '', 'https://media.gettyimages.com/id/1370825295/es/foto/moderna-habitaci%C3%B3n-de-hotel-con-cama-doble-mesas-de-noche-televisor-y-paisaje-urbano-desde-la.jpg?s=612x612&w=0&k=20&c=TvQ3P2DNP_3Y_owum8au9db1XmTbaaH5Pdt1aEmjUgI=');
/*==============================================================================*/

/*==============================================================================*/
-- INSERTAMOS LA PRIMERA SECCION CON TIPO = 3

INSERT INTO public.seccion(
	id_negocio, tipo_seccion, nombre_seccion, titulo_seccion, subtitulo_seccion, detalle_seccion, descripcion_seccion, url_seccion, video_seccion)
	VALUES (1, 3, 'Servicio de Desayuno', 'Nuestra Cafeteria', '', '', 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.', '', '');

-- INSERTAR FOTOS
INSERT INTO public.foto(
	id_seccion, nombre_foto, url_foto)
	VALUES (3, '', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBVNilXQ180kLC_S7990l0zAtCVu1rZ3no5g&s');
INSERT INTO public.foto(
	id_seccion, nombre_foto, url_foto)
	VALUES (3, '', 'https://enzomuebles.com/wp-content/uploads/2023/01/dormitorio-moderno-ventana.jpg');
INSERT INTO public.foto(
	id_seccion, nombre_foto, url_foto)
	VALUES (3, '', 'https://media.gettyimages.com/id/1266155634/es/foto/lujosos-y-elegantes-interiores-de-dormitorio.jpg?s=1024x1024&w=gi&k=20&c=CzT_9g39vpyysJoMgqjvsGtEXKztoRjswiRLC3RLCMI=');
INSERT INTO public.foto(
	id_seccion, nombre_foto, url_foto)
	VALUES (3, '', 'https://media.gettyimages.com/id/1334117334/es/foto/render-digital-de-una-gran-habitaci%C3%B3n-en-suite-de-hotel.jpg?s=612x612&w=0&k=20&c=qBkhTfkm4NCZbxj8PSy_8xbSSysqQcKBJNcdrASvvVU=');
INSERT INTO public.foto(
	id_seccion, nombre_foto, url_foto)
	VALUES (3, '', 'https://media.gettyimages.com/id/1370825295/es/foto/moderna-habitaci%C3%B3n-de-hotel-con-cama-doble-mesas-de-noche-televisor-y-paisaje-urbano-desde-la.jpg?s=612x612&w=0&k=20&c=TvQ3P2DNP_3Y_owum8au9db1XmTbaaH5Pdt1aEmjUgI=');

-- INSERTAR ICONOS
INSERT INTO public.icono(
	id_seccion, nombre_icono, titulo_icono, subtitulo_icono, descripcion_icono)
	VALUES (3, 'bookmark-outline', 'Jugos', '', 'Agua Fria y Caliente, Juego de Papaya, Jugo de Piña, Jugo de Maracuya, Jugo de Naranja');
INSERT INTO public.icono(
	id_seccion, nombre_icono, titulo_icono, subtitulo_icono, descripcion_icono)
	VALUES (3, 'bookmark-outline', 'Masitas', '', 'Queque, Rollo de queso, Pan tostada, Pan cacero.');
INSERT INTO public.icono(
	id_seccion, nombre_icono, titulo_icono, subtitulo_icono, descripcion_icono)
	VALUES (3, 'bookmark-outline', 'Liquidos', '', 'Te, Cafe, Chocolate, Mates, Leches.');
INSERT INTO public.icono(
	id_seccion, nombre_icono, titulo_icono, subtitulo_icono, descripcion_icono)
	VALUES (3, 'bookmark-outline', 'Panes', '', '');
/*==============================================================================*/

/*==============================================================================*/
-- INSERTAMOS LA CUARTA SECCION CON TIPO = 4

INSERT INTO public.seccion(
	id_negocio, tipo_seccion, nombre_seccion, titulo_seccion, subtitulo_seccion, detalle_seccion, descripcion_seccion, url_seccion, video_seccion)
	VALUES (1, 4, 'Paradise Hotel', 'Main Facilities', '', '', '', '', '');

-- INSERTAMOS ICONOS CON ID_SECCION = 4
INSERT INTO public.icono(
	id_seccion, nombre_icono, titulo_icono, subtitulo_icono, descripcion_icono)
	VALUES (4, 'car', 'Private Parking', '', 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.');
INSERT INTO public.icono(
	id_seccion, nombre_icono, titulo_icono, subtitulo_icono, descripcion_icono)
	VALUES (4, 'wifi', 'High Speed Wifi', '', 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.');
INSERT INTO public.icono(
	id_seccion, nombre_icono, titulo_icono, subtitulo_icono, descripcion_icono)
	VALUES (4, 'glass-cocktail', 'Bar & Restaurant', '', 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.');
INSERT INTO public.icono(
	id_seccion, nombre_icono, titulo_icono, subtitulo_icono, descripcion_icono)
	VALUES (4, 'pool', 'Swimming Pool', '', 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.');
/*==============================================================================*/

/*==============================================================================*/
-- INSERTAMOS LA QUINTA SECCION CON TIPO = 5
INSERT INTO public.seccion(
	id_negocio, tipo_seccion, nombre_seccion, titulo_seccion, subtitulo_seccion, detalle_seccion, descripcion_seccion, url_seccion, video_seccion)
	VALUES (1, 5, 'Testimonios', 'Nuestros Huespedes son Importantes', '', '', '', '', '');
/*==============================================================================*/

/*==============================================================================*/
-- INSERTAMOS LA SEXTA SECCION CON TIPO = 6
INSERT INTO public.seccion(
	id_negocio, tipo_seccion, nombre_seccion, titulo_seccion, subtitulo_seccion, detalle_seccion, descripcion_seccion, url_seccion, video_seccion)
	VALUES (1, 6, '', '', '', '', '', 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d7614.852670528359!2d-66.15684499999996!3d-17.391316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDIzJzI5LjAiUyA2NsKwMDknMjQuNSJX!5e0!3m2!1ses!2sbo!4v1750029148098!5m2!1ses!2sbo', 'https://media.gettyimages.com/id/1266155634/es/foto/lujosos-y-elegantes-interiores-de-dormitorio.jpg?s=1024x1024&w=gi&k=20&c=CzT_9g39vpyysJoMgqjvsGtEXKztoRjswiRLC3RLCMI=');

-- INSERTAR ICONOS
INSERT INTO public.icono(
	id_seccion, nombre_icono, titulo_icono, subtitulo_icono, descripcion_icono)
	VALUES (6, 'map-marker', 'Direccion', '', 'Calle España #172 entre Av. Heroinas y C. Colombia');
INSERT INTO public.icono(
	id_seccion, nombre_icono, titulo_icono, subtitulo_icono, descripcion_icono)
	VALUES (6, 'phone-classic', 'Telefonos', '', '(+591) 77409001 - 4 4510773');
INSERT INTO public.icono(
	id_seccion, nombre_icono, titulo_icono, subtitulo_icono, descripcion_icono)
	VALUES (6, 'map', 'Lugar', '', 'Cochabamba - Bolivia');
INSERT INTO public.icono(
	id_seccion, nombre_icono, titulo_icono, subtitulo_icono, descripcion_icono)
	VALUES (6, 'warehouse', 'Hotel Familia Felipez', '', '');
INSERT INTO public.icono(
	id_seccion, nombre_icono, titulo_icono, subtitulo_icono, descripcion_icono)
	VALUES (6, 'whatsapp', '(+591) 77409001', '', '');
/*==============================================================================*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

/*==============================================================*/
/* Eliminar: Detiene los usuario de la bd_fenix                 */
/*==============================================================*/
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'bd_reservas' AND pid <> pg_backend_pid();

DROP DATABASE bd_reservas
/*==============================================================*/

-- Limpieza previa (solo usar en entorno de desarrollo)
DROP TABLE IF EXISTS usuario_negocio, usuario, rol, persona, reserva, pago,
resena, restriccion, habitacion_servicio, habitacion, servicio,
imagen, negocio, estado CASCADE;