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

CREATE TABLE "cama" (
  "id_cama" integer PRIMARY KEY NOT NULL,
  "tipo_cama" "character varying(250)",
  "descripcion_cama" text,
  "costo_cama" numeric(8,2),
  "cant_persona_cama" integer,
  "tipo_persona_cama" "character varying(250)",
  "icono_persona_cama" "character varying(250)"
);

CREATE TABLE "categoria" (
  "id_categoria" integer PRIMARY KEY NOT NULL,
  "nombre_categoria" "character varying(250)" NOT NULL,
  "descripcion_categoria" text,
  "precio_ahora_categoria" numeric(8,2),
  "precio_antes_categoria" numeric(8,2),
  "descuento_categoria" numeric(8,2),
  "cant_noches_categoria" integer
);

CREATE TABLE "foto" (
  "id_foto" integer PRIMARY KEY NOT NULL,
  "id_seccion" integer NOT NULL,
  "nombre_foto" "character varying(250)",
  "url_foto" text
);

CREATE TABLE "habitacion" (
  "id_habitacion" integer PRIMARY KEY NOT NULL,
  "id_categoria" integer NOT NULL,
  "id_nivel" integer NOT NULL,
  "numero_habitacion" "character varying(100)" NOT NULL,
  "nombre_habitacion" "character varying(250)" NOT NULL,
  "adultos_habitacion" integer,
  "ninos_habitacion" integer,
  "descripcion_habitacion" text,
  "detalle_habitacion" text,
  "estado_habitacion" integer
);

CREATE TABLE "habitacion_cama" (
  "id_habitacion_cama" integer PRIMARY KEY NOT NULL,
  "id_habitacion" integer NOT NULL,
  "id_cama" integer NOT NULL,
  "cantidad_hab_cama" integer,
  "costo_hab_cama" numeric(8,2),
  "total_hab_cama" numeric(8,2)
);

CREATE TABLE "icono" (
  "id_icono" integer PRIMARY KEY NOT NULL,
  "id_seccion" integer NOT NULL,
  "nombre_icono" text,
  "titulo_icono" text,
  "subtitulo_icono" text,
  "descripcion_icono" text
);

CREATE TABLE "imagen" (
  "id_imagen" integer PRIMARY KEY NOT NULL,
  "id_habitacion" integer NOT NULL,
  "id_negocio" integer NOT NULL,
  "url_imagen" text NOT NULL,
  "nombre_imagen" text
);

CREATE TABLE "negocio" (
  "id_negocio" integer PRIMARY KEY NOT NULL,
  "tipo_negocio" integer NOT NULL,
  "nombre_negocio" "character varying(250)" NOT NULL,
  "ubicacion_negocio" text NOT NULL,
  "descripcion_negocio" text NOT NULL,
  "telefono_negocio" "character varying(20)" NOT NULL,
  "estado_negocio" integer,
  "url_negocio" text,
  "nombre_url_negocio" "character varying(250)",
  "codigo_celular_negocio" "character varying(200)"
);

CREATE TABLE "nivel" (
  "id_nivel" integer PRIMARY KEY NOT NULL,
  "nombre_nivel" "character varying(100)" NOT NULL,
  "descripcion_nivel" text,
  "icono_nivel" text
);

CREATE TABLE "otp" (
  "telefono_otp" "character varying(20)" PRIMARY KEY NOT NULL,
  "codigo_otp" "character varying(10)" NOT NULL,
  "fecha_creacion_otp" date DEFAULT ('2026-01-09'::date),
  "intentos_otp" integer,
  "usado_otp" boolean DEFAULT false
);

CREATE TABLE "pago" (
  "id_pago" integer PRIMARY KEY NOT NULL,
  "id_reserva" integer NOT NULL,
  "monto_pago" numeric(8,2),
  "tipo_pago" integer NOT NULL,
  "metodo_pago" integer NOT NULL,
  "comision_pago" numeric(8,2),
  "fecha_pago" timestamp NOT NULL,
  "estado_pago" integer NOT NULL,
  "url_pago" text
);

CREATE TABLE "password_resets" (
  "id_reset" integer PRIMARY KEY NOT NULL,
  "id_usuario" integer NOT NULL,
  "token_hash" "character varying(64)" NOT NULL,
  "expires_at" timestamp NOT NULL,
  "used" boolean DEFAULT false,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "persona" (
  "id_persona" integer PRIMARY KEY NOT NULL,
  "nombre_persona" "character varying(250)" NOT NULL,
  "documento_persona" "character varying(50)",
  "expedicion_persona" "character varying(10)",
  "fecha_nacimiento_persona" date,
  "nit_persona" "character varying(122)",
  "razon_social_persona" "character varying(250)",
  "telefono_persona" "character varying(1024)",
  "tipo_persona" integer
);

CREATE TABLE "pie" (
  "id_pie" integer PRIMARY KEY NOT NULL,
  "id_seccion" integer NOT NULL,
  "nombre_pie" text,
  "url_pie" text,
  "mapa_pie" text
);

CREATE TABLE "resena" (
  "id_resena" integer PRIMARY KEY NOT NULL,
  "id_habitacion" integer NOT NULL,
  "id_usuario" integer NOT NULL,
  "fecha_resena" date,
  "puntuacion_resena" integer,
  "comentario_resena" text,
  "estado_resena" boolean NOT NULL DEFAULT false
);

CREATE TABLE "reserva" (
  "id_reserva" integer PRIMARY KEY NOT NULL,
  "id_usuario" integer NOT NULL,
  "id_persona" integer NOT NULL,
  "id_habitacion" integer NOT NULL,
  "id_restriccion" integer NOT NULL,
  "codigo_reserva" "character varying(250)" NOT NULL,
  "fecha_reserva" timestamp,
  "check_in_reserva" date NOT NULL,
  "check_out_reserva" date NOT NULL,
  "hora_llegada_reserva" time,
  "total_estadia_reserva" numeric(8,2),
  "descuento_reserva" numeric(8,2),
  "servicio_reserva" numeric(8,2),
  "monto_total_reserva" numeric(8,2),
  "estado_reserva" integer,
  "observacion_reserva" text,
  "condicion_reserva" integer DEFAULT 2
);

CREATE TABLE "restriccion" (
  "id_restriccion" integer PRIMARY KEY NOT NULL,
  "id_habitacion" integer NOT NULL,
  "fecha_inicial_restriccion" date NOT NULL,
  "hora_inicial_restriccion" time NOT NULL,
  "fecha_final_restriccion" date NOT NULL,
  "hora_final_restriccion" time NOT NULL,
  "motivo_restriccion" text,
  "estado_restriccion" integer
);

CREATE TABLE "rol" (
  "id_rol" integer PRIMARY KEY NOT NULL,
  "nombre_rol" "character varying(250)" NOT NULL
);

CREATE TABLE "seccion" (
  "id_seccion" integer PRIMARY KEY NOT NULL,
  "id_negocio" integer,
  "tipo_seccion" integer,
  "nombre_seccion" text,
  "titulo_seccion" text,
  "subtitulo_seccion" text,
  "detalle_seccion" text,
  "descripcion_seccion" text,
  "url_seccion" text,
  "video_seccion" text
);

CREATE TABLE "servicio" (
  "id_servicio" integer PRIMARY KEY NOT NULL,
  "nombre_servicio" "character varying(250)" NOT NULL,
  "icono_servicio" "character varying(100)" NOT NULL
);

CREATE TABLE "servicio_hab" (
  "id_servicio_hab" integer PRIMARY KEY NOT NULL,
  "id_habitacion" integer NOT NULL,
  "id_servicio" integer NOT NULL
);

CREATE TABLE "usuario" (
  "id_usuario" integer PRIMARY KEY NOT NULL,
  "id_rol" integer NOT NULL,
  "id_persona" integer NOT NULL,
  "nombre_usuario" "character varying(250)",
  "telefono_usuario" "character varying(20)" NOT NULL,
  "codigo_pais_usuario" "character varying(10)" NOT NULL,
  "contrasena_usuario" "character varying(200)" NOT NULL,
  "verificado_usuario" boolean DEFAULT false,
  "email_usuario" "character varying(250)",
  "verificado_phone_usuario" boolean DEFAULT false,
  "verificado_email_usuario" boolean DEFAULT false,
  "metodo_registro_usuario" "character varying(250)"
);

CREATE TABLE "usuario_negocio" (
  "id_usuario_negocio" integer PRIMARY KEY NOT NULL,
  "id_negocio" integer NOT NULL,
  "id_usuario" integer NOT NULL,
  "rol_usuario_negocio" "character varying(250)" NOT NULL
);

CREATE UNIQUE INDEX "cama_pk" ON "cama" USING BTREE ("id_cama");

CREATE UNIQUE INDEX "categoria_pk" ON "categoria" USING BTREE ("id_categoria");

CREATE INDEX "categoria_habitacion_fk" ON "habitacion" USING BTREE ("id_categoria");

CREATE UNIQUE INDEX "habitacion_pk" ON "habitacion" USING BTREE ("id_habitacion");

CREATE INDEX "nivel_habitacion_fk" ON "habitacion" USING BTREE ("id_nivel");

CREATE INDEX "cama_habitacion_cama_fk" ON "habitacion_cama" USING BTREE ("id_cama");

CREATE INDEX "habitacion_cama_habitacion_fk" ON "habitacion_cama" USING BTREE ("id_habitacion");

CREATE UNIQUE INDEX "habitacion_cama_pk" ON "habitacion_cama" USING BTREE ("id_habitacion_cama");

CREATE INDEX "imagen_habitacion_fk" ON "imagen" USING BTREE ("id_habitacion");

CREATE INDEX "imagen_negocio_fk" ON "imagen" USING BTREE ("id_negocio");

CREATE UNIQUE INDEX "imagen_pk" ON "imagen" USING BTREE ("id_imagen");

CREATE UNIQUE INDEX "negocio_pk" ON "negocio" USING BTREE ("id_negocio");

CREATE UNIQUE INDEX "nivel_pk" ON "nivel" USING BTREE ("id_nivel");

CREATE UNIQUE INDEX "otp_pk" ON "otp" USING BTREE ("telefono_otp");

CREATE UNIQUE INDEX "pago_pk" ON "pago" USING BTREE ("id_pago");

CREATE INDEX "pago_reserva_fk" ON "pago" USING BTREE ("id_reserva");

CREATE UNIQUE INDEX "persona_pk" ON "persona" USING BTREE ("id_persona");

CREATE INDEX "resena_habitacion_fk" ON "resena" USING BTREE ("id_habitacion");

CREATE UNIQUE INDEX "resena_pk" ON "resena" USING BTREE ("id_resena");

CREATE INDEX "resena_usuario_fk" ON "resena" USING BTREE ("id_usuario");

CREATE INDEX "reserva_habitacion_fk" ON "reserva" USING BTREE ("id_habitacion");

CREATE INDEX "reserva_persona_fk" ON "reserva" USING BTREE ("id_persona");

CREATE UNIQUE INDEX "reserva_pk" ON "reserva" USING BTREE ("id_reserva");

CREATE INDEX "reserva_restriccion_fk" ON "reserva" USING BTREE ("id_restriccion");

CREATE INDEX "reserva_usuario_fk" ON "reserva" USING BTREE ("id_usuario");

CREATE INDEX "restriccion_habitacion_fk" ON "restriccion" USING BTREE ("id_habitacion");

CREATE UNIQUE INDEX "restriccion_pk" ON "restriccion" USING BTREE ("id_restriccion");

CREATE UNIQUE INDEX "rol_pk" ON "rol" USING BTREE ("id_rol");

CREATE UNIQUE INDEX "servicio_pk" ON "servicio" USING BTREE ("id_servicio");

CREATE INDEX "hab_serv_hab_fk" ON "servicio_hab" USING BTREE ("id_habitacion");

CREATE UNIQUE INDEX "servicio_habitacion_pk" ON "servicio_hab" USING BTREE ("id_servicio_hab");

CREATE INDEX "servicio_habitacion_servicio_fk" ON "servicio_hab" USING BTREE ("id_servicio");

CREATE INDEX "usuario_persona_fk" ON "usuario" USING BTREE ("id_persona");

CREATE UNIQUE INDEX "usuario_pk" ON "usuario" USING BTREE ("id_usuario");

CREATE INDEX "usuario_rol_fk" ON "usuario" USING BTREE ("id_rol");

CREATE INDEX "usuario_negocio_negocio_fk" ON "usuario_negocio" USING BTREE ("id_negocio");

CREATE UNIQUE INDEX "usuario_negocio_pk" ON "usuario_negocio" USING BTREE ("id_usuario_negocio");

CREATE INDEX "usuario_negocio_usuario_fk" ON "usuario_negocio" USING BTREE ("id_usuario");

ALTER TABLE "foto" ADD CONSTRAINT "fk_foto_seccion" FOREIGN KEY ("id_seccion") REFERENCES "seccion" ("id_seccion") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "habitacion_cama" ADD CONSTRAINT "fk_habitaci_cama_habi_cama" FOREIGN KEY ("id_cama") REFERENCES "cama" ("id_cama") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "habitacion" ADD CONSTRAINT "fk_habitaci_categoria_categori" FOREIGN KEY ("id_categoria") REFERENCES "categoria" ("id_categoria") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "habitacion_cama" ADD CONSTRAINT "fk_habitaci_habitacio_habitaci" FOREIGN KEY ("id_habitacion") REFERENCES "habitacion" ("id_habitacion") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "habitacion" ADD CONSTRAINT "fk_habitaci_nivel_hab_nivel" FOREIGN KEY ("id_nivel") REFERENCES "nivel" ("id_nivel") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "icono" ADD CONSTRAINT "fk_icono_seccion" FOREIGN KEY ("id_seccion") REFERENCES "seccion" ("id_seccion") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "imagen" ADD CONSTRAINT "fk_imagen_imagen_ha_habitaci" FOREIGN KEY ("id_habitacion") REFERENCES "habitacion" ("id_habitacion") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "imagen" ADD CONSTRAINT "fk_imagen_imagen_ne_negocio" FOREIGN KEY ("id_negocio") REFERENCES "negocio" ("id_negocio") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "pago" ADD CONSTRAINT "fk_pago_pago_rese_reserva" FOREIGN KEY ("id_reserva") REFERENCES "reserva" ("id_reserva") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "pie" ADD CONSTRAINT "fk_pie_seccion" FOREIGN KEY ("id_seccion") REFERENCES "seccion" ("id_seccion") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "resena" ADD CONSTRAINT "fk_resena_resena_ha_habitaci" FOREIGN KEY ("id_habitacion") REFERENCES "habitacion" ("id_habitacion") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "resena" ADD CONSTRAINT "fk_resena_resena_us_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "reserva" ADD CONSTRAINT "fk_reserva_reserva_h_habitaci" FOREIGN KEY ("id_habitacion") REFERENCES "habitacion" ("id_habitacion") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "reserva" ADD CONSTRAINT "fk_reserva_reserva_p_persona" FOREIGN KEY ("id_persona") REFERENCES "persona" ("id_persona") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "reserva" ADD CONSTRAINT "fk_reserva_reserva_r_restricc" FOREIGN KEY ("id_restriccion") REFERENCES "restriccion" ("id_restriccion") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "reserva" ADD CONSTRAINT "fk_reserva_reserva_u_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "restriccion" ADD CONSTRAINT "fk_restricc_restricci_habitaci" FOREIGN KEY ("id_habitacion") REFERENCES "habitacion" ("id_habitacion") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "seccion" ADD CONSTRAINT "fk_seccion_negocio" FOREIGN KEY ("id_negocio") REFERENCES "negocio" ("id_negocio") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "servicio_hab" ADD CONSTRAINT "fk_servicio_hab_serv__habitaci" FOREIGN KEY ("id_habitacion") REFERENCES "habitacion" ("id_habitacion") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "servicio_hab" ADD CONSTRAINT "fk_servicio_servicio__servicio" FOREIGN KEY ("id_servicio") REFERENCES "servicio" ("id_servicio") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "usuario_negocio" ADD CONSTRAINT "fk_usuario__usuario_n_negocio" FOREIGN KEY ("id_negocio") REFERENCES "negocio" ("id_negocio") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "usuario_negocio" ADD CONSTRAINT "fk_usuario__usuario_n_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "usuario" ADD CONSTRAINT "fk_usuario_usuario_p_persona" FOREIGN KEY ("id_persona") REFERENCES "persona" ("id_persona") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "usuario" ADD CONSTRAINT "fk_usuario_usuario_r_rol" FOREIGN KEY ("id_rol") REFERENCES "rol" ("id_rol") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario");



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