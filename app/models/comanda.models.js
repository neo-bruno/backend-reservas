const db = require('../../config/bd')

const getCommandsModel = async (id_cuenta) => {
  try {
    const query = {
      text: `
        SELECT 
            c.id_cuenta,

            COALESCE(
			  json_agg(
				json_build_object(
				  'id_comanda', co.id_comanda,
				  'numero_comanda', co.numero_comanda,
				  'codigo_comanda', co.codigo_comanda,
				  'fecha_comanda', co.fecha_comanda,
				  'tipo_comanda', co.tipo_comanda,
				  'total_comanda', co.total_comanda,
				  'estado_comanda', co.estado_comanda,
				  'seleccionar_comanda', 1,

				  -- DETALLE
				  'detalles', (
					SELECT COALESCE(json_agg(
					  json_build_object(
						'id_detalle', d.id_detalle,
						'concepto_detalle', d.concepto_detalle,
						'cantidad_detalle', d.cantidad_detalle,
						'precio_detalle', d.precio_detalle,
						'importe_detalle', d.importe_detalle
					  )
					), '[]'::json)
					FROM detalle d
					WHERE d.id_comanda = co.id_comanda
				  ),

				  -- MOVIMIENTOS
				  'movimientos', (
					SELECT COALESCE(json_agg(
					  json_build_object(
						'id_movimiento', m.id_movimiento,
						'fecha_movimiento', m.fecha_movimiento,
						'tipo_movimiento', m.tipo_movimiento,
						'cantidad_movimiento', m.cantidad_movimiento,
						'monto_movimiento', m.monto_movimiento,

						'kardex', json_build_object(
						  'id_kardex', k.id_kardex,
						  'cantidad_kardex', k.cantidad_kardex,
						  'precio_kardex', k.precio_kardex,

						  'producto', json_build_object(
							'id_producto', p.id_producto,
							'codigo_producto', p.codigo_producto,
							'nombre_producto', p.nombre_producto,
							'tipo_producto', p.tipo_producto
						  )
						)
					  )
					), '[]'::json)
					FROM movimiento m
					LEFT JOIN kardex k ON k.id_kardex = m.id_kardex
					LEFT JOIN producto p ON p.id_producto = k.id_producto
					WHERE m.id_comanda = co.id_comanda
				  )
				)
			  ) FILTER (WHERE co.id_comanda IS NOT NULL),
			  '[]'::json
			) AS comandas
        FROM cuenta c
        LEFT JOIN comanda co ON co.id_cuenta = c.id_cuenta

        WHERE c.id_cuenta = $1
        GROUP BY c.id_cuenta;
      `,
      values: [id_cuenta]
    }
    const { rows } = await db.query(query)
    return rows || [] // 👈 Devuelve un arreglo vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener las comandas:', error)
    throw error
  }
}

const getLastCommandModel = async () => {
  try {
    const query = {
      text: `
        SELECT * FROM comanda ORDER BY id_comanda DESC limit 1
      `
    }
    const { rows } = await db.query(query)
    return rows[0] || { numero_comanda: 0 } // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener la comanda:', error)
    throw error
  }
}

const saveCommandModel = async (data) => {
  const client = await db.connect()
  try {
    const { id_cuenta, numero_comanda, codigo_comanda, fecha_comanda, tipo_comanda, total_comanda, usuario_comanda, estado_comanda, detalles } = data
    await client.query('BEGIN')

    // 1. guardar en la base de datos la comanda
    const insertCommand = await client.query(
      `
      INSERT INTO public.comanda(
      id_cuenta, numero_comanda, codigo_comanda, fecha_comanda, tipo_comanda, total_comanda, usuario_comanda, estado_comanda)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
      `,
      [id_cuenta, numero_comanda, codigo_comanda, fecha_comanda, tipo_comanda, total_comanda, usuario_comanda, estado_comanda]
    )

    const id_comanda = insertCommand.rows[0].id_comanda

    // 2. guardar los detalles de la comanda
    for (const detalle of detalles) {
      await client.query(
        ` INSERT INTO public.detalle(
        id_comanda, concepto_detalle, cantidad_detalle, precio_detalle, importe_detalle)
        VALUES ($1, $2, $3, $4, $5);`,
        [
          id_comanda,
          detalle.concepto_detalle,
          detalle.cantidad_detalle,
          detalle.precio_detalle,
          detalle.importe_detalle
        ]
      )
    }

    await client.query('COMMIT')

    return {
      ...insertCommand.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const saveConsumptionModel = async (data) => {
  const client = await db.connect()
  try {
    const {
      id_cuenta,
      numero_comanda,
      codigo_comanda,
      fecha_comanda,
      tipo_comanda,
      total_comanda,
      usuario_comanda,
      estado_comanda,
      detalles } = data
    await client.query('BEGIN')

    // 1. guardar en la base de datos la comanda
    const insertCommand = await client.query(
      `
      INSERT INTO public.comanda(
      id_cuenta, numero_comanda, codigo_comanda, fecha_comanda, tipo_comanda, total_comanda, usuario_comanda, estado_comanda)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
      `,
      [id_cuenta, numero_comanda, codigo_comanda, fecha_comanda, tipo_comanda, total_comanda, usuario_comanda, estado_comanda]
    )

    const id_comanda = insertCommand.rows[0].id_comanda

    // 2. guardar los consumos de la comanda
    for (const detalle of detalles) {
      await client.query(
        ` INSERT INTO public.movimiento(
          id_kardex, id_comanda, fecha_movimiento, tipo_movimiento, cantidad_movimiento, monto_movimiento)
          VALUES ($1, $2, $3, $4, $5, $6);`,
        [
          detalle.id_kardex,
          id_comanda,
          detalle.fecha_movimiento,
          detalle.tipo_movimiento,
          detalle.cantidad_movimiento,
          detalle.monto_movimiento
        ]
      )
      // await client.query(
      //   `
      //   UPDATE public.kardex
      //   SET cantidad_kardex=$2
      //   WHERE id_kardex=$1;
      //   `,
      //   [detalle.id_kardex, detalle.cantidad_kardex]
      // )
    }

    await client.query('COMMIT')

    return {
      ...insertCommand.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const deleteCommandModel = async (id_comanda) => {
  const client = await db.connect()

  try {
    await client.query('BEGIN')

    // 🔥 1. obtener movimientos
    const { rows: movimientos } = await client.query(
      `SELECT id_kardex, cantidad_movimiento
       FROM movimiento
       WHERE id_comanda = $1`,
      [id_comanda]
    )

    // 🔥 2. devolver stock
    for (const mov of movimientos) {
      await client.query(
        `
        UPDATE kardex
        SET cantidad_kardex = cantidad_kardex + $1
        WHERE id_kardex = $2
        `,
        [mov.cantidad_movimiento, mov.id_kardex]
      )
    }

    // 🔥 3. eliminar movimientos
    await client.query(
      `DELETE FROM movimiento WHERE id_comanda = $1`,
      [id_comanda]
    )

    // 🔥 4. eliminar detalles
    await client.query(
      `DELETE FROM detalle WHERE id_comanda = $1`,
      [id_comanda]
    )

    // 🔥 5. eliminar comanda
    await client.query(
      `DELETE FROM comanda WHERE id_comanda = $1`,
      [id_comanda]
    )

    await client.query('COMMIT')

  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

module.exports = {
  getLastCommandModel,
  saveCommandModel,
  getCommandsModel,
  deleteCommandModel,
  saveConsumptionModel
}