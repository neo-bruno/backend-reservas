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
/* DBMS name:      PostgreSQL 9.x                               */
/* Created on:     26/02/2026 11:06:15                          */
/*==============================================================*/

/*==============================================================*/
/* DBMS name:      PostgreSQL 9.x                               */
/* Created on:     26/02/2026 17:31:53                          */
/*==============================================================*/

/*==============================================================*/
/* Table: CAJA                                                  */
/*==============================================================*/
create table CAJA (
   ID_CAJA              SERIAL               not null,
   MONTO_INICIAL_CAJA   NUMERIC(8,2)         null,
   MONTO_CUENTA_CAJA    NUMERIC(8,2)         null,
   MONTO_INGRESO_CAJA   NUMERIC(8,2)         null,
   MONTO_GASTO_CAJA     NUMERIC(8,2)         null,
   ESTADO_CAJA          INT4                 null,
   constraint PK_CAJA primary key (ID_CAJA)
);

/*==============================================================*/
/* Index: CAJA_PK                                               */
/*==============================================================*/
create unique index CAJA_PK on CAJA (
ID_CAJA
);

/*==============================================================*/
/* Table: CAJA_CUENTA                                           */
/*==============================================================*/
create table CAJA_CUENTA (
   ID_CAJA_CUENTA       SERIAL               not null,
   ID_CUENTA            INT4                 not null,
   ID_CAJA              INT4                 not null,
   MONTO_CAJA_CUENTA    NUMERIC(8,2)         null,
   constraint PK_CAJA_CUENTA primary key (ID_CAJA_CUENTA)
);

/*==============================================================*/
/* Index: CAJA_CUENTA_PK                                        */
/*==============================================================*/
create unique index CAJA_CUENTA_PK on CAJA_CUENTA (
ID_CAJA_CUENTA
);

/*==============================================================*/
/* Index: CUENTA_CAJA_CUENTA_FK                                 */
/*==============================================================*/
create  index CUENTA_CAJA_CUENTA_FK on CAJA_CUENTA (
ID_CUENTA
);

/*==============================================================*/
/* Index: CAJA_CAJA_CUENTA_FK                                   */
/*==============================================================*/
create  index CAJA_CAJA_CUENTA_FK on CAJA_CUENTA (
ID_CAJA
);

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
/* Table: COMANDA                                               */
/*==============================================================*/
create table COMANDA (
   ID_COMANDA           SERIAL               not null,
   ID_CUENTA            INT4                 not null,
   NUMERO_COMANDA       INT4                 null,
   CODIGO_COMANDA       VARCHAR(250)         null,
   TIPO_COMANDA         TEXT                 null,
   TOTAL_COMANDA        NUMERIC(8,2)         null,
   ESTADO_COMANDA       INT4                 null,
   constraint PK_COMANDA primary key (ID_COMANDA)
);

/*==============================================================*/
/* Index: COMANDA_PK                                            */
/*==============================================================*/
create unique index COMANDA_PK on COMANDA (
ID_COMANDA
);

/*==============================================================*/
/* Index: COMANDA_CUENTA_FK                                     */
/*==============================================================*/
create  index COMANDA_CUENTA_FK on COMANDA (
ID_CUENTA
);

/*==============================================================*/
/* Table: CUENTA                                                */
/*==============================================================*/
create table CUENTA (
   ID_CUENTA            SERIAL               not null,
   MONTO_PRODUCTO_CUENTA NUMERIC(8,2)         null,
   MONTO_SERVICIO_CUENTA NUMERIC(8,2)         null,
   MONTO_COMANDA_CUENTA NUMERIC(8,2)         null,
   MONTO_ESTADIA_CUENTA NUMERIC(8,2)         null,
   MONTO_ADELANTO_CUENTA NUMERIC(8,2)         null,
   MONTO_TOTAL_CUENTA   NUMERIC(8,2)         null,
   ESTADO_CUENTA        INT4                 null,
   constraint PK_CUENTA primary key (ID_CUENTA)
);

/*==============================================================*/
/* Index: CUENTA_PK                                             */
/*==============================================================*/
create unique index CUENTA_PK on CUENTA (
ID_CUENTA
);

/*==============================================================*/
/* Table: DETALLE                                               */
/*==============================================================*/
create table DETALLE (
   ID_DETALLE           SERIAL               not null,
   ID_COMANDA           INT4                 not null,
   FECHA_DETALLE        DATE                 null,
   CANTIDAD_DETALLE     INT4                 null,
   CONCEPTO_DETALLE     TEXT                 null,
   PRECIO_DETALLE       NUMERIC(8,2)         null,
   IMPORTE_DETALLE      NUMERIC(8,2)         null,
   constraint PK_DETALLE primary key (ID_DETALLE)
);

/*==============================================================*/
/* Index: DETALLE_PK                                            */
/*==============================================================*/
create unique index DETALLE_PK on DETALLE (
ID_DETALLE
);

/*==============================================================*/
/* Index: DETALLE_COMANDA_FK                                    */
/*==============================================================*/
create  index DETALLE_COMANDA_FK on DETALLE (
ID_COMANDA
);

/*==============================================================*/
/* Table: ESTADIA                                               */
/*==============================================================*/
create table ESTADIA (
   ID_ESTADIA           SERIAL               not null,
   ID_CUENTA            INT4                 not null,
   FECHA_INICIO_ESTADIA DATE                 null,
   FECHA_FINAL_ESTADIA  DATE                 null,
   NOCHES_ESTADIA       INT4                 null,
   PRECIO_ESTADIA       NUMERIC(8,2)         null,
   ESTADO_ESTADIA       INT4                 null,
   constraint PK_ESTADIA primary key (ID_ESTADIA)
);

/*==============================================================*/
/* Index: ESTADIA_PK                                            */
/*==============================================================*/
create unique index ESTADIA_PK on ESTADIA (
ID_ESTADIA
);

/*==============================================================*/
/* Index: ESTADIA_CUENTA_FK                                     */
/*==============================================================*/
create  index ESTADIA_CUENTA_FK on ESTADIA (
ID_CUENTA
);

/*==============================================================*/
/* Table: FLUJO                                                 */
/*==============================================================*/
create table FLUJO (
   ID_FLUJO             SERIAL               not null,
   ID_CAJA              INT4                 not null,
   FECHA_FLUJO          DATE                 null,
   TIPO_FLUJO           VARCHAR(250)         null,
   MONTO_FLUJO          NUMERIC(8,2)         null,
   OBSERVACION_FLUJO    TEXT                 null,
   ESTADO_FLUJO         INT4                 null,
   constraint PK_FLUJO primary key (ID_FLUJO)
);

/*==============================================================*/
/* Index: FLUJO_PK                                              */
/*==============================================================*/
create unique index FLUJO_PK on FLUJO (
ID_FLUJO
);

/*==============================================================*/
/* Index: FLUJO_CAJA_FK                                         */
/*==============================================================*/
create  index FLUJO_CAJA_FK on FLUJO (
ID_CAJA
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
/* Table: KARDEX                                                */
/*==============================================================*/
create table KARDEX (
   ID_KARDEX            SERIAL               not null,
   ID_PRODUCTO          INT4                 not null,
   CODIGO_KARDEX        VARCHAR(250)         null,
   CANTIDAD_KARDEX      INT4                 null,
   PRECIO_KARDEX        NUMERIC(8,2)         null,
   COSTO_KARDEX         NUMERIC(8,2)         null,
   constraint PK_KARDEX primary key (ID_KARDEX)
);

/*==============================================================*/
/* Index: KARDEX_PK                                             */
/*==============================================================*/
create unique index KARDEX_PK on KARDEX (
ID_KARDEX
);

/*==============================================================*/
/* Index: KARDEX_PRODUCTO_FK                                    */
/*==============================================================*/
create  index KARDEX_PRODUCTO_FK on KARDEX (
ID_PRODUCTO
);

/*==============================================================*/
/* Table: MOVIMIENTO                                            */
/*==============================================================*/
create table MOVIMIENTO (
   ID_MOVIMIENTO        SERIAL               not null,
   ID_KARDEX            INT4                 not null,
   ID_CUENTA            INT4                 not null,
   FECHA_MOVIMIENTO     DATE                 null,
   TIPO_MOVIMIENTO      VARCHAR(255)         null,
   CANTIDAD_MOVIMIENTO  INT4                 null,
   MONTO_MOVIMIENTO     NUMERIC(8,2)         null,
   constraint PK_MOVIMIENTO primary key (ID_MOVIMIENTO)
);

/*==============================================================*/
/* Index: MOVIMIENTO_PK                                         */
/*==============================================================*/
create unique index MOVIMIENTO_PK on MOVIMIENTO (
ID_MOVIMIENTO
);

/*==============================================================*/
/* Index: MOVIMIENTO_CUENTA_FK                                  */
/*==============================================================*/
create  index MOVIMIENTO_CUENTA_FK on MOVIMIENTO (
ID_CUENTA
);

/*==============================================================*/
/* Index: MOVIMIENTO_KARDEX_FK                                  */
/*==============================================================*/
create  index MOVIMIENTO_KARDEX_FK on MOVIMIENTO (
ID_KARDEX
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
   CODIGO_CELULAR_NEGOCIO VARCHAR(100)         null,
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
/* Table: PASSWORD_RESETS                                       */
/*==============================================================*/
create table PASSWORD_RESETS (
   ATTRIBUTE_133        SERIAL               not null,
   ID_USUARIO           INT4                 not null,
   TOKEN_HASH           VARCHAR(100)         not null,
   EXPIRES_AT           DATE                 null,
   USED                 BOOL                 null,
   CREATED_AT           DATE                 null,
   constraint PK_PASSWORD_RESETS primary key (ATTRIBUTE_133)
);

/*==============================================================*/
/* Index: PASSWORD_RESETS_PK                                    */
/*==============================================================*/
create unique index PASSWORD_RESETS_PK on PASSWORD_RESETS (
ATTRIBUTE_133
);

/*==============================================================*/
/* Index: RESET_USUARIO_FK                                      */
/*==============================================================*/
create  index RESET_USUARIO_FK on PASSWORD_RESETS (
ID_USUARIO
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
/* Table: PRODUCTO                                              */
/*==============================================================*/
create table PRODUCTO (
   ID_PRODUCTO          SERIAL               not null,
   CODIGO_PRODUCTO      TEXT                 null,
   TIPO_PRODUCTO        VARCHAR(250)         null,
   NOMBRE_PRODUCTO      VARCHAR(250)         null,
   FECHA_CADUCIDAD_PRODUCTO DATE                 null,
   CANT_MINIMA_PRODUCTO INT4                 null,
   ESTADO_PRODUCTO      INT4                 null,
   constraint PK_PRODUCTO primary key (ID_PRODUCTO)
);

/*==============================================================*/
/* Index: PRODUCTO_PK                                           */
/*==============================================================*/
create unique index PRODUCTO_PK on PRODUCTO (
ID_PRODUCTO
);

/*==============================================================*/
/* Table: REGISTRO                                              */
/*==============================================================*/
create table REGISTRO (
   ID_REGISTRO          SERIAL               not null,
   ID_RESTRICCION       INT4                 not null,
   ID_HABITACION        INT4                 not null,
   ID_CUENTA            INT4                 not null,
   NUMERO_REGISTRO      INT4                 null,
   FECHA_REGISTRO       DATE                 null,
   PRECIO_REGISTRO      NUMERIC(8,2)         null,
   TOTAL_REGISTRO       NUMERIC(8,2)         null,
   ESTADO_REGISTRO      INT4                 null,
   constraint PK_REGISTRO primary key (ID_REGISTRO)
);

/*==============================================================*/
/* Index: REGISTRO_PK                                           */
/*==============================================================*/
create unique index REGISTRO_PK on REGISTRO (
ID_REGISTRO
);

/*==============================================================*/
/* Index: REGISTRO_HABITACION_FK                                */
/*==============================================================*/
create  index REGISTRO_HABITACION_FK on REGISTRO (
ID_HABITACION
);

/*==============================================================*/
/* Index: REGISTRO_RESTRICCION_FK                               */
/*==============================================================*/
create  index REGISTRO_RESTRICCION_FK on REGISTRO (
ID_RESTRICCION
);

/*==============================================================*/
/* Index: CUENTA_REGISTRO_FK                                    */
/*==============================================================*/
create  index CUENTA_REGISTRO_FK on REGISTRO (
ID_CUENTA
);

/*==============================================================*/
/* Table: REGISTRO_PERSONA                                      */
/*==============================================================*/
create table REGISTRO_PERSONA (
   ID_REGISTRO_PERSONA  SERIAL               not null,
   ID_PERSONA           INT4                 not null,
   ID_REGISTRO          INT4                 not null,
   constraint PK_REGISTRO_PERSONA primary key (ID_REGISTRO_PERSONA)
);

/*==============================================================*/
/* Index: REGISTRO_PERSONA_PK                                   */
/*==============================================================*/
create unique index REGISTRO_PERSONA_PK on REGISTRO_PERSONA (
ID_REGISTRO_PERSONA
);

/*==============================================================*/
/* Index: REGISTRO_REGISTRO_PERSONA_FK                          */
/*==============================================================*/
create  index REGISTRO_REGISTRO_PERSONA_FK on REGISTRO_PERSONA (
ID_REGISTRO
);

/*==============================================================*/
/* Index: PERSONA_REGISTRO_PERSONA_FK                           */
/*==============================================================*/
create  index PERSONA_REGISTRO_PERSONA_FK on REGISTRO_PERSONA (
ID_PERSONA
);

/*==============================================================*/
/* Table: REGISTRO_RESERVA                                      */
/*==============================================================*/
create table REGISTRO_RESERVA (
   ID_REGISTRO_RESERVA  SERIAL               not null,
   ID_RESERVA           INT4                 not null,
   ID_REGISTRO          INT4                 not null,
   constraint PK_REGISTRO_RESERVA primary key (ID_REGISTRO_RESERVA)
);

/*==============================================================*/
/* Index: REGISTRO_RESERVA_PK                                   */
/*==============================================================*/
create unique index REGISTRO_RESERVA_PK on REGISTRO_RESERVA (
ID_REGISTRO_RESERVA
);

/*==============================================================*/
/* Index: RESERVA_REGISTRO_RESERVA_FK                           */
/*==============================================================*/
create  index RESERVA_REGISTRO_RESERVA_FK on REGISTRO_RESERVA (
ID_RESERVA
);

/*==============================================================*/
/* Index: REGISTRO_REGISTRO_RESERVA_FK                          */
/*==============================================================*/
create  index REGISTRO_REGISTRO_RESERVA_FK on REGISTRO_RESERVA (
ID_REGISTRO
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
/* Table: USUARIO_CAJA                                          */
/*==============================================================*/
create table USUARIO_CAJA (
   ID_USUARIO_CAJA      SERIAL               not null,
   ID_CAJA              INT4                 not null,
   ID_USUARIO           INT4                 not null,
   FECHA_USUARIO_CAJA   DATE                 null,
   constraint PK_USUARIO_CAJA primary key (ID_USUARIO_CAJA)
);

/*==============================================================*/
/* Index: USUARIO_CAJA_PK                                       */
/*==============================================================*/
create unique index USUARIO_CAJA_PK on USUARIO_CAJA (
ID_USUARIO_CAJA
);

/*==============================================================*/
/* Index: USUARIO_USUARIO_CAJA_FK                               */
/*==============================================================*/
create  index USUARIO_USUARIO_CAJA_FK on USUARIO_CAJA (
ID_USUARIO
);

/*==============================================================*/
/* Index: CAJA_USUARIO_CAJA_FK                                  */
/*==============================================================*/
create  index CAJA_USUARIO_CAJA_FK on USUARIO_CAJA (
ID_CAJA
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

CREATE TABLE foto_producto (
    id_foto_producto SERIAL PRIMARY KEY,
    id_producto INT NOT NULL,    
    nombre_foto_producto VARCHAR(250),
    url_foto_producto TEXT,

    -- 🔗 Relación con persona
    CONSTRAINT fk_foto_producto_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX idx_foto_producto_id_producto
ON foto_producto(id_producto);

CREATE TABLE foto_persona (
    id_foto_persona SERIAL PRIMARY KEY,
    id_persona INT NOT NULL,
    tipo_foto_persona INT,
    nombre_foto_persona VARCHAR(250),
    url_foto_persona TEXT,

    -- 🔗 Relación con persona
    CONSTRAINT fk_foto_persona_persona
        FOREIGN KEY (id_persona)
        REFERENCES persona(id_persona)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX idx_foto_persona_id_persona
ON foto_persona(id_persona);

alter table CAJA_CUENTA
   add constraint FK_CAJA_CUE_CAJA_CAJA_CAJA foreign key (ID_CAJA)
      references CAJA (ID_CAJA)
      on delete restrict on update restrict;

alter table CAJA_CUENTA
   add constraint FK_CAJA_CUE_CUENTA_CA_CUENTA foreign key (ID_CUENTA)
      references CUENTA (ID_CUENTA)
      on delete restrict on update restrict;

alter table COMANDA
   add constraint FK_COMANDA_COMANDA_C_CUENTA foreign key (ID_CUENTA)
      references CUENTA (ID_CUENTA)
      on delete restrict on update restrict;

alter table DETALLE
   add constraint FK_DETALLE_DETALLE_C_COMANDA foreign key (ID_COMANDA)
      references COMANDA (ID_COMANDA)
      on delete restrict on update restrict;

alter table ESTADIA
   add constraint FK_ESTADIA_ESTADIA_C_CUENTA foreign key (ID_CUENTA)
      references CUENTA (ID_CUENTA)
      on delete restrict on update restrict;

alter table FLUJO
   add constraint FK_FLUJO_FLUJO_CAJ_CAJA foreign key (ID_CAJA)
      references CAJA (ID_CAJA)
      on delete restrict on update restrict;

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

alter table KARDEX
   add constraint FK_KARDEX_KARDEX_PR_PRODUCTO foreign key (ID_PRODUCTO)
      references PRODUCTO (ID_PRODUCTO)
      on delete restrict on update restrict;

alter table MOVIMIENTO
   add constraint FK_MOVIMIEN_MOVIMIENT_CUENTA foreign key (ID_CUENTA)
      references CUENTA (ID_CUENTA)
      on delete restrict on update restrict;

alter table MOVIMIENTO
   add constraint FK_MOVIMIEN_MOVIMIENT_KARDEX foreign key (ID_KARDEX)
      references KARDEX (ID_KARDEX)
      on delete restrict on update restrict;

alter table PAGO
   add constraint FK_PAGO_PAGO_RESE_RESERVA foreign key (ID_RESERVA)
      references RESERVA (ID_RESERVA)
      on delete restrict on update restrict;

alter table PASSWORD_RESETS
   add constraint FK_PASSWORD_RESET_USU_USUARIO foreign key (ID_USUARIO)
      references USUARIO (ID_USUARIO)
      on delete restrict on update restrict;

alter table REGISTRO
   add constraint FK_REGISTRO_CUENTA_RE_CUENTA foreign key (ID_CUENTA)
      references CUENTA (ID_CUENTA)
      on delete restrict on update restrict;

alter table REGISTRO
   add constraint FK_REGISTRO_REGISTRO__HABITACI foreign key (ID_HABITACION)
      references HABITACION (ID_HABITACION)
      on delete restrict on update restrict;

alter table REGISTRO
   add constraint FK_REGISTRO_REGISTRO__RESTRICC foreign key (ID_RESTRICCION)
      references RESTRICCION (ID_RESTRICCION)
      on delete restrict on update restrict;

alter table REGISTRO_PERSONA
   add constraint FK_REGISTRO_PERSONA_R_PERSONA foreign key (ID_PERSONA)
      references PERSONA (ID_PERSONA)
      on delete restrict on update restrict;

alter table REGISTRO_PERSONA
   add constraint FK_REGISTRO_REGISTRO__REGISTRO foreign key (ID_REGISTRO)
      references REGISTRO (ID_REGISTRO)
      on delete restrict on update restrict;

alter table REGISTRO_RESERVA
   add constraint FK_REGISTRO_REGISTRO__REGISTRO foreign key (ID_REGISTRO)
      references REGISTRO (ID_REGISTRO)
      on delete restrict on update restrict;

alter table REGISTRO_RESERVA
   add constraint FK_REGISTRO_RESERVA_R_RESERVA foreign key (ID_RESERVA)
      references RESERVA (ID_RESERVA)
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

alter table USUARIO_CAJA
   add constraint FK_USUARIO__CAJA_USUA_CAJA foreign key (ID_CAJA)
      references CAJA (ID_CAJA)
      on delete restrict on update restrict;

alter table USUARIO_CAJA
   add constraint FK_USUARIO__USUARIO_U_USUARIO foreign key (ID_USUARIO)
      references USUARIO (ID_USUARIO)
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



-- esto es el trigger para registrar una comanda con movimientos y la actualizacion del kardex
CREATE OR REPLACE FUNCTION fn_generar_kardex_salida()
RETURNS TRIGGER AS $$
DECLARE
  stock_actual NUMERIC;
  restante NUMERIC;
  salida NUMERIC;

  costo_kardex_var NUMERIC;
  precio_kardex_var NUMERIC;

  lote_row RECORD;
  producto_id INT;
BEGIN

  -- 🔥 obtener producto desde kardex base
  SELECT id_producto INTO producto_id
  FROM kardex
  WHERE id_kardex = NEW.id_kardex
  LIMIT 1;

  IF producto_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró producto para el kardex';
  END IF;

  -- 🔥 obtener stock actual (último kardex)
  SELECT stock_kardex INTO stock_actual
  FROM kardex
  WHERE id_producto = producto_id
  ORDER BY id_kardex DESC
  LIMIT 1;

  IF stock_actual IS NULL THEN
    stock_actual := 0;
  END IF;

  -- 🔒 validar stock suficiente
  IF stock_actual < NEW.cantidad_movimiento THEN
    RAISE EXCEPTION 'Stock insuficiente';
  END IF;

  restante := NEW.cantidad_movimiento;

  -- 🔥 recorrer lotes FIFO
  FOR lote_row IN
    SELECT DISTINCT ON (l.id_lote)
      l.id_lote,
      l.id_producto,
      k.stock_kardex AS stock
    FROM lote l
    JOIN kardex k ON k.id_lote = l.id_lote
    WHERE l.id_producto = producto_id
    ORDER BY l.id_lote, k.id_kardex DESC
  LOOP

    EXIT WHEN restante <= 0;

    IF lote_row.stock IS NULL OR lote_row.stock <= 0 THEN
      CONTINUE;
    END IF;

    -- 🔥 calcular salida
    salida := LEAST(restante, lote_row.stock);

    -- 🔥 obtener costo y precio desde la última ENTRADA del lote
    SELECT 
      k.costo_kardex,
      k.precio_kardex
    INTO 
      costo_kardex_var,
      precio_kardex_var
    FROM kardex k
    WHERE k.id_lote = lote_row.id_lote
      AND k.tipo_kardex = 'ENTRADA'
    ORDER BY k.id_kardex DESC
    LIMIT 1;

    -- 🔒 fallback por seguridad
    IF costo_kardex_var IS NULL THEN
      costo_kardex_var := 0;
    END IF;

    IF precio_kardex_var IS NULL THEN
      precio_kardex_var := 0;
    END IF;

    -- 🔥 actualizar stock global
    stock_actual := stock_actual - salida;

    IF stock_actual < 0 THEN
      RAISE EXCEPTION 'Stock negativo detectado';
    END IF;

    -- 🔥 insertar movimiento en kardex
    INSERT INTO kardex(
      id_producto,
      id_lote,
      fecha_kardex,
      tipo_kardex,
      cantidad_kardex,
      costo_kardex,
      precio_kardex,
      stock_kardex
    )
    VALUES (
      producto_id,
      lote_row.id_lote,
      NOW(),
      'SALIDA',
      salida,
      costo_kardex_var,
      precio_kardex_var,
      stock_actual
    );

    restante := restante - salida;

  END LOOP;

  -- 🔒 validación final
  IF restante > 0 THEN
    RAISE EXCEPTION 'No se pudo completar salida (FIFO)';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- la creacion del trigger
DROP TRIGGER IF EXISTS trg_kardex_salida ON movimiento;

CREATE TRIGGER trg_kardex_salida
AFTER INSERT ON movimiento
FOR EACH ROW
EXECUTE FUNCTION fn_generar_kardex_salida();