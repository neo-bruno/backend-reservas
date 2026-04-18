const db = require('../../config/bd')

const getAllProductsModel = async () => {
  try {
    const query = {
      text: `
        SELECT 
          p.id_producto,
          p.codigo_producto,
          p.tipo_producto,
          p.nombre_producto,
          p.fecha_caducidad_producto,
          p.cant_minima_producto,
          p.estado_producto,
              
          -- 🔥 último kardex (resumen)		
          k.id_kardex,  -- ✅ AQUÍ LO AGREGAS
          COALESCE(k.stock_kardex, 0) AS stock_kardex,		  
          k.precio_kardex,
          k.costo_kardex,

          f.id_foto_producto,
          f.url_foto_producto,

          -- 🔥 historial completo del kardex en JSON
          COALESCE(
            json_agg(
              json_build_object(
                'id_kardex', kd.id_kardex,
                'tipo', kd.tipo_kardex,
                'cantidad', kd.cantidad_kardex,
                'precio', kd.precio_kardex,
                'costo', kd.costo_kardex,
                'stock', kd.stock_kardex,
                'fecha', kd.fecha_kardex,
                'lote', json_build_object(
                  'id_lote', l.id_lote,
                  'fecha_caducidad', l.fecha_caducidad_lote
                )
              )
              ORDER BY kd.id_kardex ASC
            ) FILTER (WHERE kd.id_kardex IS NOT NULL),
            '[]'
          ) AS kardexs

        FROM producto p

        -- 🔥 último kardex (solo 1 fila)
        LEFT JOIN (
          SELECT DISTINCT ON (id_producto)
            id_producto,
            id_kardex,  -- ✅ IMPORTANTE
            stock_kardex,
            precio_kardex,
            costo_kardex
          FROM kardex
          ORDER BY id_producto, id_kardex DESC
        ) k ON p.id_producto = k.id_producto

        -- 🔥 historial completo
        LEFT JOIN kardex kd 
          ON p.id_producto = kd.id_producto

        LEFT JOIN lote l 
          ON kd.id_lote = l.id_lote

        LEFT JOIN foto_producto f 
          ON p.id_producto = f.id_producto

        GROUP BY 
          p.id_producto,		  
          k.id_kardex,  -- ✅ agregar al GROUP BY
          k.stock_kardex,
          k.precio_kardex,
          k.costo_kardex,
          f.id_foto_producto,
          f.url_foto_producto

        ORDER BY 
          p.tipo_producto,
          p.id_producto ASC;
      `,
    }
    const { rows } = await db.query(query)
    return rows || [] // 👈 Devuelve un arreglo vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener los productos:', error)
    throw error
  }
}

const saveProductModel = async (data) => {
  const client = await db.connect()
  try {
    const { codigo_producto, tipo_producto, nombre_producto, fecha_caducidad_producto, cant_minima_producto, estado_producto, foto_producto } = data

    await client.query('BEGIN')

    // 1. guardar en la base de datos el nivel
    const insertProduct = await client.query(
      `
      INSERT INTO public.producto(
      codigo_producto, tipo_producto, nombre_producto, fecha_caducidad_producto, cant_minima_producto, estado_producto)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
      `,
      [codigo_producto, tipo_producto, nombre_producto, fecha_caducidad_producto, cant_minima_producto, estado_producto]
    )
    const id_producto = insertProduct.rows[0].id_producto

    // 2. guardar la foto del producto
    await client.query(
      `INSERT INTO public.foto_producto(
      id_producto, nombre_foto_producto, url_foto_producto)
      VALUES ($1, $2, $3);`,
      [id_producto, foto_producto.nombre_foto_producto, foto_producto.url_foto_producto]
    )

    await client.query('COMMIT')

    return {
      ...insertProduct.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const modifyProductModel = async (data) => {
  const client = await db.connect()
  try {
    const {
      id_producto,
      codigo_producto,
      tipo_producto,
      nombre_producto,
      fecha_caducidad_producto,
      cant_minima_producto,
      id_foto_producto,
      nombre_foto_producto,
      url_foto_producto,
      estado_producto
    } = data

    await client.query('BEGIN')
    const updateProduct = await client.query(
      `
      UPDATE public.producto
      SET
        codigo_producto = $1,
        tipo_producto = $2,
        nombre_producto = $3,
        fecha_caducidad_producto = $4,
        cant_minima_producto = $5,
        estado_producto = $6
      WHERE id_producto = $7
      RETURNING *;
      `,
      [
        codigo_producto,
        tipo_producto,
        nombre_producto,
        fecha_caducidad_producto,
        cant_minima_producto,
        estado_producto,
        id_producto
      ]
    )

    if(id_foto_producto){
      await client.query(
        `UPDATE public.foto_producto
        SET id_producto=$2, nombre_foto_producto=$3, url_foto_producto=$4
        WHERE id_foto_producto=$1;`,
        [id_foto_producto, id_producto, nombre_foto_producto, url_foto_producto]
      )
    }else{
      await client.query(
        `INSERT INTO public.foto_producto(
        id_producto, nombre_foto_producto, url_foto_producto)
        VALUES ($1, $2, $3);`,
        [id_producto, nombre_foto_producto, url_foto_producto]
      )
    }

    await client.query('COMMIT')

    return {
      ...updateProduct.rows[0]
    }

  } catch (error) {

    await client.query('ROLLBACK')
    throw error

  } finally {
    client.release()
  }
}

module.exports = {
  getAllProductsModel,
  saveProductModel,
  modifyProductModel,
}