const db = require('../../config/bd')

// helper para mapear los campos de habitacion
const habitacionFields = (habitacion) => {
  const { id_negocio, id_estado, tipo_habitacion, numero_habitacion, nombre_habitacion, precio_habitacion, descripcion_habitacion, capacidad_habitacion } = habitacion
  return [id_negocio, id_estado, tipo_habitacion, numero_habitacion, nombre_habitacion, precio_habitacion, descripcion_habitacion, capacidad_habitacion]
}

const saveRoomModel = async (habitacion) => {
  const client = await db.connect()

  try {
    await client.query('BEGIN')

    // 1️⃣ HABITACION    
    const {
      numero_habitacion,
      nombre_habitacion,
      adultos_habitacion,
      ninos_habitacion,
      descripcion_habitacion,
      detalle_habitacion,
      estado_habitacion
    } = habitacion

    const roomResult = await client.query(
      `
      INSERT INTO habitacion (
        id_categoria,
        id_nivel,
        numero_habitacion,
        nombre_habitacion,
        adultos_habitacion,
        ninos_habitacion,
        descripcion_habitacion,
        detalle_habitacion,
        estado_habitacion
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id_habitacion
    `,
      [
        habitacion.categoria.id_categoria,
        habitacion.nivel.id_nivel,
        numero_habitacion,
        nombre_habitacion,
        adultos_habitacion,
        ninos_habitacion,
        descripcion_habitacion,
        detalle_habitacion,
        estado_habitacion
      ]
    )

    const id_habitacion = roomResult.rows[0].id_habitacion

    // 2️⃣ HABITACION_CAMA
    if (habitacion.habitacion_camas?.length) {
      for (const cama of habitacion.habitacion_camas) {
        await client.query(
          `
          INSERT INTO habitacion_cama (
            id_habitacion,
            id_cama,
            cantidad_hab_cama,
            costo_hab_cama,
            total_hab_cama
          )
          VALUES ($1,$2,$3,$4,$5)
          `,
          [
            id_habitacion,
            cama.id_cama,
            cama.cantidad_hab_cama,
            cama.costo_hab_cama,
            cama.total_hab_cama
          ]
        )
      }
    }

    // 3️⃣ SERVICIO_HAB
    if (habitacion.servicios_habitacion?.length) {
      for (const servicio of habitacion.servicios_habitacion) {
        await client.query(
          `
          INSERT INTO servicio_hab (id_habitacion, id_servicio)
          VALUES ($1, $2)
          `,
          [id_habitacion, servicio.id_servicio]
        )
      }
    }

    // 4️⃣ IMAGEN
    if (habitacion.imagenes?.length) {
      for (const img of habitacion.imagenes) {
        await client.query(
          `
          INSERT INTO imagen (
            id_habitacion,            
            url_imagen,
            nombre_imagen
          )
          VALUES ($1,$2,$3)
          `,
          [
            id_habitacion,
            img.url_imagen,
            img.nombre_imagen || null
          ]
        )
      }
    }

    await client.query('COMMIT')

    return {
      message: 'Habitación registrada correctamente',
      id_habitacion
    }

  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const modifyRoomModel = async (habitacion) => {
  const client = await db.connect()

  try {
    await client.query('BEGIN')

    const {
      id_habitacion,
      numero_habitacion,
      nombre_habitacion,
      adultos_habitacion,
      ninos_habitacion,
      descripcion_habitacion,
      detalle_habitacion,
      estado_habitacion
    } = habitacion

    // =============================
    // 1️⃣ UPDATE HABITACION
    // =============================
    await client.query(
      `
      UPDATE habitacion
      SET
        id_categoria = $1,
        id_nivel = $2,
        numero_habitacion = $3,
        nombre_habitacion = $4,
        adultos_habitacion = $5,
        ninos_habitacion = $6,
        descripcion_habitacion = $7,
        detalle_habitacion = $8,
        estado_habitacion = $9
      WHERE id_habitacion = $10
      `,
      [
        habitacion.categoria.id_categoria,
        habitacion.nivel.id_nivel,
        numero_habitacion,
        nombre_habitacion,
        adultos_habitacion,
        ninos_habitacion,
        descripcion_habitacion,
        detalle_habitacion,
        estado_habitacion,
        id_habitacion
      ]
    )

    // ======================================================
    // 2️⃣ SYNC IMAGENES  (INSERT / UPDATE / DELETE DIFERENCIAL)
    // ======================================================

    const { rows: imagenesDB } = await client.query(
      `SELECT id_imagen FROM imagen WHERE id_habitacion=$1`,
      [id_habitacion]
    )

    const idsDB = imagenesDB.map(i => i.id_imagen)

    const imagenes = habitacion.imagenes || []
    const nuevas = imagenes.filter(i => !i.id_imagen)
    const existentes = imagenes.filter(i => i.id_imagen)

    const idsFrontend = existentes.map(i => i.id_imagen)

    // DELETE
    const eliminar = idsDB.filter(id => !idsFrontend.includes(id))
    for (const id of eliminar) {
      await client.query(`DELETE FROM imagen WHERE id_imagen=$1`, [id])
    }

    // UPDATE
    for (const img of existentes) {
      await client.query(
        `
        UPDATE imagen SET
          url_imagen=$1,
          nombre_imagen=$2          
        WHERE id_imagen=$3
        `,
        [
          img.url_imagen,
          img.nombre_imagen || null,
          img.id_imagen
        ]
      )
    }

    // INSERT
    for (const img of nuevas) {
      if (!img.url_imagen) continue

      await client.query(
        `
        INSERT INTO imagen (
          id_habitacion,          
          url_imagen,
          nombre_imagen
        )
        VALUES ($1,$2,$3)
        `,
        [
          id_habitacion,
          img.url_imagen,
          img.nombre_imagen || null
        ]
      )
    }

    // ======================================
    // 3️⃣ SYNC SERVICIOS
    // ======================================

    const { rows: serviciosDB } = await client.query(
      `SELECT id_servicio FROM servicio_hab WHERE id_habitacion=$1`,
      [id_habitacion]
    )

    const idsServDB = serviciosDB.map(s => s.id_servicio)
    const serviciosFront = (habitacion.servicios || []).map(s => s.id_servicio)

    // DELETE
    for (const id of idsServDB.filter(id => !serviciosFront.includes(id))) {
      await client.query(
        `DELETE FROM servicio_hab WHERE id_habitacion=$1 AND id_servicio=$2`,
        [id_habitacion, id]
      )
    }

    // INSERT
    for (const id of serviciosFront.filter(id => !idsServDB.includes(id))) {
      await client.query(
        `INSERT INTO servicio_hab (id_habitacion,id_servicio) VALUES ($1,$2)`,
        [id_habitacion, id]
      )
    }

    // ======================================
    // 4️⃣ SYNC HABITACION_CAMA
    // ======================================

    const { rows: camasDB } = await client.query(
      `SELECT id_habitacion_cama FROM habitacion_cama WHERE id_habitacion=$1`,
      [id_habitacion]
    )

    const idsCamasDB = camasDB.map(c => c.id_habitacion_cama)

    const camasFront = habitacion.habitacion_camas || []
    const nuevasCamas = camasFront.filter(c => !c.id_habitacion_cama)
    const existentesCamas = camasFront.filter(c => c.id_habitacion_cama)

    const idsFront = existentesCamas.map(c => c.id_habitacion_cama)

    // DELETE
    for (const id of idsCamasDB.filter(id => !idsFront.includes(id))) {
      await client.query(
        `DELETE FROM habitacion_cama WHERE id_habitacion_cama=$1`,
        [id]
      )
    }

    // UPDATE
    for (const hc of existentesCamas) {
      await client.query(
        `
        UPDATE habitacion_cama SET
          id_cama=$1,
          cantidad_hab_cama=$2,
          costo_hab_cama=$3,
          total_hab_cama=$4
        WHERE id_habitacion_cama=$5
        `,
        [
          hc.cama.id_cama,
          hc.cantidad_hab_cama,
          hc.costo_hab_cama,
          hc.total_hab_cama,
          hc.id_habitacion_cama
        ]
      )
    }

    // INSERT
    for (const hc of nuevasCamas) {
      await client.query(
        `
        INSERT INTO habitacion_cama (
          id_habitacion,
          id_cama,
          cantidad_hab_cama,
          costo_hab_cama,
          total_hab_cama
        )
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
          id_habitacion,
          hc.cama.id_cama,
          hc.cantidad_hab_cama,
          hc.costo_hab_cama,
          hc.total_hab_cama
        ]
      )
    }

    await client.query('COMMIT')

    return {
      message: 'Habitación actualizada correctamente',
      id_habitacion
    }

  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}


const modifyOnlyRoomModel = async (habitacion) => {
  const client = await db.connect()

  try {
    await client.query('BEGIN')

    const {
      id_habitacion,
      id_categoria,
      id_nivel,
      numero_habitacion,
      nombre_habitacion,
      adultos_habitacion,
      ninos_habitacion,
      descripcion_habitacion,
      detalle_habitacion,
      estado_habitacion
    } = habitacion

    // 1️⃣ UPDATE HABITACION
    await client.query(
      `
      UPDATE habitacion
      SET
        id_categoria = $1,
        id_nivel = $2,
        numero_habitacion = $3,
        nombre_habitacion = $4,
        adultos_habitacion = $5,
        ninos_habitacion = $6,
        descripcion_habitacion = $7,
        detalle_habitacion = $8,
        estado_habitacion = $9
      WHERE id_habitacion = $10
      `,
      [
        id_categoria,
        id_nivel,
        numero_habitacion,
        nombre_habitacion,
        adultos_habitacion,
        ninos_habitacion,
        descripcion_habitacion,
        detalle_habitacion,
        estado_habitacion,
        id_habitacion
      ]
    )

    await client.query('COMMIT')

    return {
      message: 'Habitación actualizada correctamente',
      id_habitacion
    }

  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const getRoomsModel = async () => {
  try {
    const query = {
      text: `
        SELECT 
          h.id_habitacion,
          h.id_categoria,
          h.id_nivel,
          h.numero_habitacion,
          h.nombre_habitacion,
          h.adultos_habitacion,
          h.ninos_habitacion,
          h.descripcion_habitacion,
          h.detalle_habitacion,
          h.estado_habitacion,

          -- 🔹 Categoría
          json_build_object(
            'id_categoria', c.id_categoria,
            'nombre_categoria', c.nombre_categoria,
            'descripcion_categoria', c.descripcion_categoria,
            'precio_ahora_categoria', c.precio_ahora_categoria,
            'precio_antes_categoria', c.precio_antes_categoria,
            'descuento_categoria', c.descuento_categoria,
            'cant_noches_categoria', c.cant_noches_categoria
          ) AS categoria,

          -- 🔹 Nivel
          json_build_object(
            'id_nivel', n.id_nivel,
            'nombre_nivel', n.nombre_nivel,
            'descripcion_nivel', n.descripcion_nivel,
            'icono_nivel', n.icono_nivel
          ) AS nivel,

          -- 🔹 Imágenes
          (
            SELECT COALESCE(
              json_agg(
                json_build_object(
                  'id_imagen', i.id_imagen,
                  'url_imagen', i.url_imagen,
                  'nombre_imagen', i.nombre_imagen
                )
                ORDER BY i.id_imagen
              ),
              '[]'::json
            )
            FROM imagen i
            WHERE i.id_habitacion = h.id_habitacion
          ) AS imagenes,

          -- 🔹 Camas
          (
            SELECT COALESCE(
              json_agg(
                json_build_object(
                  'id_cama', ca.id_cama,
                  'tipo_cama', ca.tipo_cama,
                  'descripcion_cama', ca.descripcion_cama,
                  'cant_persona_cama', ca.cant_persona_cama,
                  'icono_persona_cama', ca.icono_persona_cama,
                  'cantidad', hc.cantidad_hab_cama,
                  'costo', hc.costo_hab_cama,
                  'total', hc.total_hab_cama
                )
              ),
              '[]'::json
            )
            FROM habitacion_cama hc
            JOIN cama ca ON ca.id_cama = hc.id_cama
            WHERE hc.id_habitacion = h.id_habitacion
          ) AS camas,

          -- 🔹 Servicios
          (
            SELECT COALESCE(
              json_agg(
                json_build_object(
                  'id_servicio', s.id_servicio,
                  'nombre_servicio', s.nombre_servicio,
                  'icono_servicio', s.icono_servicio
                )
              ),
              '[]'::json
            )
            FROM servicio_hab sh
            JOIN servicio s ON s.id_servicio = sh.id_servicio
            WHERE sh.id_habitacion = h.id_habitacion
          ) AS servicios,

          -- 🔥 🔹 RESTRICCIONES (con reserva, pago y persona)
(
  SELECT COALESCE(
    json_agg(
      json_build_object(
        'id_restriccion', r.id_restriccion,
        'id_habitacion', r.id_habitacion,
        'fecha_inicial_restriccion', r.fecha_inicial_restriccion,
        'hora_inicial_restriccion', r.hora_inicial_restriccion,
        'fecha_final_restriccion', r.fecha_final_restriccion,
        'hora_final_restriccion', r.hora_final_restriccion,
        'motivo_restriccion', r.motivo_restriccion,
        'estado_restriccion', r.estado_restriccion,

        'reserva',
        CASE
          WHEN res.id_reserva IS NULL THEN NULL
          ELSE json_build_object(
            'id_reserva', res.id_reserva,
            'id_usuario', res.id_usuario,
            'id_persona', res.id_persona,
            'id_restriccion', res.id_restriccion,
            'codigo_reserva', res.codigo_reserva,
            'fecha_reserva', res.fecha_reserva,
            'check_in_reserva', res.check_in_reserva,
            'check_out_reserva', res.check_out_reserva,
            'hora_llegada_reserva', res.hora_llegada_reserva,
            'total_estadia_reserva', res.total_estadia_reserva,
            'descuento_reserva', res.descuento_reserva,
            'servicio_reserva', res.servicio_reserva,
            'monto_total_reserva', res.monto_total_reserva,
            'estado_reserva', res.estado_reserva,
            'observacion_reserva', res.observacion_reserva,
            'precio_reserva', res.precio_reserva,

            -- 🔹 PERSONA QUE HIZO LA RESERVA
            'persona',
            CASE
              WHEN per.id_persona IS NULL THEN NULL
              ELSE json_build_object(
                'id_persona', per.id_persona,
                'nombre_persona', per.nombre_persona,
                'documento_persona', per.documento_persona,
                'expedicion_persona', per.expedicion_persona,
                'fecha_nacimiento_persona', per.fecha_nacimiento_persona,
                'nit_persona', per.nit_persona,
                'razon_social_persona', per.razon_social_persona,
                'telefono_persona', per.telefono_persona,
                'tipo_persona', per.tipo_persona
              )
            END,

            -- 🔹 PAGO
            'pago',
            CASE
              WHEN p.id_pago IS NULL THEN NULL
              ELSE json_build_object(
                'id_pago', p.id_pago,
                'monto_pago', p.monto_pago,
                'tipo_pago', p.tipo_pago,
                'metodo_pago', p.metodo_pago,
                'comision_pago', p.comision_pago,
                'fecha_pago', p.fecha_pago,
                'estado_pago', p.estado_pago,
                'url_pago', p.url_pago
              )
            END
          )
        END
      )
      ORDER BY r.fecha_inicial_restriccion
    ),
    '[]'::json
  )
  FROM restriccion r
  LEFT JOIN reserva res
    ON res.id_restriccion = r.id_restriccion
  LEFT JOIN persona per
    ON per.id_persona = res.id_persona
  LEFT JOIN pago p
    ON p.id_reserva = res.id_reserva
  WHERE r.id_habitacion = h.id_habitacion
    AND r.estado_restriccion = 1
) AS restricciones
        FROM habitacion h
        JOIN categoria c ON c.id_categoria = h.id_categoria
        JOIN nivel n ON n.id_nivel = h.id_nivel

        ORDER BY h.id_habitacion;
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error('❌ Error en getRoomsModel:', error)
    throw error
  }
}

const getRoomByIdModel = async (id_habitacion) => {
  const query = {

    text: `
      SELECT 
        h.id_habitacion,
        h.numero_habitacion,
        h.nombre_habitacion,
        h.descripcion_habitacion,
        h.detalle_habitacion,
        h.adultos_habitacion,
        h.ninos_habitacion,
        h.estado_habitacion,
  
        -- 🔹 Categoría (incluye precios)
        json_build_object(
          'id_categoria', c.id_categoria,
          'nombre_categoria', c.nombre_categoria,
          'descripcion_categoria', c.descripcion_categoria,
          'precio_ahora_categoria', c.precio_ahora_categoria,
          'precio_antes_categoria', c.precio_antes_categoria,
          'descuento_categoria', c.descuento_categoria,
          'cant_noches_categoria', c.cant_noches_categoria
        ) AS categoria,
  
        -- 🔹 Nivel
        json_build_object(
          'id_nivel', n.id_nivel,
          'nombre_nivel', n.nombre_nivel,
          'descripcion_nivel', n.descripcion_nivel,
          'icono_nivel', n.icono_nivel
        ) AS nivel,
  
        -- 🔹 Imágenes
        (
          SELECT COALESCE(
            json_agg(
              json_build_object(
                'id_imagen', i.id_imagen,
                'id_habitacion', i.id_habitacion,                
                'url_imagen', i.url_imagen,
                'nombre_imagen', i.nombre_imagen
              )
              ORDER BY i.id_imagen
            ),
            '[]'::json
          )
          FROM imagen i
          WHERE i.id_habitacion = h.id_habitacion
        ) AS imagenes,
        
        -- 🔹 Relación habitación - cama (con objeto cama embebido)
      (
        SELECT COALESCE(
        json_agg(
          json_build_object(
          'id_habitacion_cama', hc.id_habitacion_cama,
          'cantidad_hab_cama', hc.cantidad_hab_cama,
          'costo_hab_cama', hc.costo_hab_cama,
          'total_hab_cama', hc.total_hab_cama,
          'cama', json_build_object(
            'id_cama', ca.id_cama,
            'tipo_cama', ca.tipo_cama,
            'descripcion_cama', ca.descripcion_cama,
            'costo_cama', ca.costo_cama,
            'cant_persona_cama', ca.cant_persona_cama,
            'tipo_persona_cama', ca.tipo_persona_cama,
            'icono_persona_cama', ca.icono_persona_cama
          )
          )
        ),
        '[]'::json
        )
        FROM habitacion_cama hc
        JOIN cama ca ON ca.id_cama = hc.id_cama
        WHERE hc.id_habitacion = h.id_habitacion
      ) AS habitacion_camas,
  
  
        -- 🔹 Servicios
        (
          SELECT COALESCE(
            json_agg(
              json_build_object(
                'id_servicio', s.id_servicio,
                'nombre_servicio', s.nombre_servicio,
                'icono_servicio', s.icono_servicio
              )
            ),
            '[]'::json
          )
          FROM servicio_hab sh
          JOIN servicio s ON s.id_servicio = sh.id_servicio
          WHERE sh.id_habitacion = h.id_habitacion
        ) AS servicios,

        -- 🔹 Restricciones
        (
          SELECT COALESCE(
            json_agg(
              json_build_object(
                'id_restriccion', r.id_restriccion,
                'id_habitacion', r.id_habitacion,
                'fecha_inicial_restriccion', r.fecha_inicial_restriccion,
                'hora_inicial_restriccion', r.hora_inicial_restriccion,
                'fecha_final_restriccion', r.fecha_final_restriccion,
                'hora_final_restriccion', r.hora_final_restriccion,
                'motivo_restriccion', r.motivo_restriccion,
                'estado_restriccion', r.estado_restriccion
              )
              ORDER BY r.fecha_inicial_restriccion
            ),
            '[]'::json
          )
          FROM restriccion r
          WHERE r.id_habitacion = h.id_habitacion and r.estado_restriccion = 1
        ) AS restricciones
  
      FROM habitacion h
      JOIN categoria c ON c.id_categoria = h.id_categoria
      JOIN nivel n ON n.id_nivel = h.id_nivel
      WHERE h.id_habitacion = $1
      ORDER BY h.id_habitacion;
    `,
    values: [id_habitacion]
  }

  const result = await db.query(query, [id_habitacion]);
  return result.rows[0];
}


module.exports = {
  saveRoomModel,
  modifyRoomModel,
  modifyOnlyRoomModel,
  getRoomsModel,
  getRoomByIdModel,  
}