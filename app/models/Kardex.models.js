const db = require('../../config/bd')

const getAllKardexsModel = async () => {
  try {
    const query = {
      text: `
        SELECT *
        FROM kardex
        ORDER BY id_kardex ASC;
      `,
    }
    const { rows } = await db.query(query)
    return rows || [] // 👈 Devuelve un arreglo vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener los kardex:', error)
    throw error
  }
}

const saveKardexModel = async (data) => {
  const client = await db.connect()

  try {
    const {
      id_producto,
      tipo_kardex,
      cantidad_kardex,
      precio_kardex,
      costo_kardex,
      estado_producto,
      lote
    } = data

    await client.query('BEGIN')

    // 🔒 1. BLOQUEAR PRODUCTO (control total de concurrencia)
    await client.query(
      `SELECT id_producto FROM producto WHERE id_producto = $1 FOR UPDATE;`,
      [id_producto]
    )

    // 🧮 2. OBTENER ÚLTIMO STOCK (NO SUM)
    const stockActualRes = await client.query(
      `
      SELECT stock_kardex
      FROM kardex
      WHERE id_producto = $1
      ORDER BY id_kardex DESC
      LIMIT 1;
      `,
      [id_producto]
    )

    const stockActual = stockActualRes.rows.length
      ? Number(stockActualRes.rows[0].stock_kardex)
      : 0

    // 🔐 VALIDACIÓN GENERAL
    if (cantidad_kardex <= 0) {
      throw new Error('Cantidad inválida')
    }

    // ============================
    // 🟢 ENTRADA
    // ============================
    if (tipo_kardex === 'ENTRADA') {
      const nuevoStock = stockActual + cantidad_kardex

      const insertLote = await client.query(
        `
        INSERT INTO lote(
          id_producto,
          fecha_ingreso_lote,
          fecha_caducidad_lote,
          cantidad_inicial_lote,
          estado_lote
        )
        VALUES ($1, now(), $2, $3, $4)
        RETURNING id_lote;
        `,
        [
          id_producto,
          lote.fecha_caducidad_lote,
          cantidad_kardex,
          lote.estado_lote
        ]
      )

      const id_lote = insertLote.rows[0].id_lote

      const insertKardex = await client.query(
        `
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
        VALUES ($1, $2, now(), $3, $4, $5, $6, $7)
        RETURNING *;
        `,
        [
          id_producto,
          id_lote,
          tipo_kardex,
          cantidad_kardex,
          costo_kardex,
          precio_kardex,
          nuevoStock
        ]
      )

      await client.query(
        `
        UPDATE producto
        SET estado_producto = $2
        WHERE id_producto = $1;
        `,
        [id_producto, estado_producto]
      )

      await client.query('COMMIT')
      return insertKardex.rows[0]
    }

    // ============================
    // 🔴 SALIDA (FIFO REAL)
    // ============================
    if (tipo_kardex === 'SALIDA') {
      if (stockActual < cantidad_kardex) {
        throw new Error('Stock insuficiente')
      }

      let restante = cantidad_kardex
      let stockTemp = stockActual

      // 🔒 BLOQUEAR LOTES
      await client.query(
        `SELECT id_lote FROM lote WHERE id_producto = $1 FOR UPDATE;`,
        [id_producto]
      )

      // 🔥 OBTENER ÚLTIMO STOCK POR LOTE (SIN SUM)
      const lotesRes = await client.query(
        `
        SELECT DISTINCT ON (l.id_lote)
          l.id_lote,
          l.fecha_caducidad_lote,
          k.stock_kardex AS stock
        FROM lote l
        JOIN kardex k ON k.id_lote = l.id_lote
        WHERE l.id_producto = $1
        ORDER BY l.id_lote, k.id_kardex DESC;
        `,
        [id_producto]
      )

      // 🔥 solo lotes con stock
      const lotes = lotesRes.rows
        .map(l => ({
          ...l,
          stock: Number(l.stock || 0)
        }))
        .filter(l => l.stock > 0)
        .sort((a, b) => new Date(a.fecha_caducidad_lote) - new Date(b.fecha_caducidad_lote))

      const movimientos = []

      for (const loteRow of lotes) {
        if (restante <= 0) break

        const salida = Math.min(restante, loteRow.stock)

        stockTemp -= salida

        // 🔒 VALIDACIÓN CRÍTICA
        if (stockTemp < 0) {
          throw new Error('Stock negativo detectado')
        }

        const insert = await client.query(
          `
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
          VALUES ($1, $2, now(), 'SALIDA', $3, $4, $5, $6)
          RETURNING *;
          `,
          [
            id_producto,
            loteRow.id_lote,
            salida,
            costo_kardex,
            precio_kardex,
            stockTemp
          ]
        )

        movimientos.push(insert.rows[0])
        restante -= salida
      }

      if (restante > 0) {
        throw new Error('No se pudo completar la venta (lotes insuficientes)')
      }

      await client.query(
        `
        UPDATE producto
        SET estado_producto = $2
        WHERE id_producto = $1;
        `,
        [id_producto, estado_producto]
      )

      await client.query('COMMIT')
      return movimientos
    }

  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const modifyKardexModel = async (data) => {
  const client = await db.connect()
  try {
    const {
      id_kardex, id_producto, cantidad_kardex, precio_kardex, costo_kardex
    } = data

    await client.query('BEGIN')
    const updateKardex = await client.query(
      `
      UPDATE public.kardex
      SET id_producto=$2, cantidad_kardex=$3, precio_kardex=$4, costo_kardex=$5
      WHERE id_kardex=$1
      RETURNING *;
      `,
      [
        id_kardex, id_producto, cantidad_kardex, precio_kardex, costo_kardex
      ]
    )

    await client.query('COMMIT')

    return {
      ...updateKardex.rows[0]
    }

  } catch (error) {

    await client.query('ROLLBACK')
    throw error

  } finally {
    client.release()
  }
}

module.exports = {
  getAllKardexsModel,
  saveKardexModel,
  modifyKardexModel,
}