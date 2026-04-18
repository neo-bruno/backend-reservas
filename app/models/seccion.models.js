const db = require('../../config/bd')

const getSectionByTypeModel = async (tipo) => {
  try {
    const query = {
      text: `
        SELECT
          s.id_seccion,
          s.id_negocio,
          s.tipo_seccion,
          s.nombre_seccion,
          s.titulo_seccion,
          s.subtitulo_seccion,
          s.detalle_seccion,
          s.descripcion_seccion,
          s.url_seccion,
          s.video_seccion,

          /* Fotos como arreglo */
          COALESCE(
              (
                  SELECT json_agg(
                      json_build_object(
                          'id_foto', f.id_foto,
                          'id_seccion', f.id_seccion,
                          'nombre_foto', f.nombre_foto,
                          'url_foto', f.url_foto
                      )
                  )
                  FROM foto f
                  WHERE f.id_seccion = s.id_seccion
              ),
              '[]'::json
          ) AS fotos,

          /* Iconos como arreglo */
          COALESCE(
              (
                  SELECT json_agg(
                      json_build_object(
                          'id_icono', i.id_icono,
                          'id_seccion', i.id_seccion,
                          'nombre_icono', i.nombre_icono,
                          'titulo_icono', i.titulo_icono,
                          'subtitulo_icono', i.subtitulo_icono,
                          'descripcion_icono', i.descripcion_icono
                      )
                      ORDER BY i.id_icono ASC
                  )
                  FROM icono i
                  WHERE i.id_seccion = s.id_seccion                  
              ),
              '[]'::json
          ) AS iconos

      FROM seccion s
      WHERE s.tipo_seccion = $1; -- 👈 aquí cambias el tipo      
      `,
      values: [tipo]
    }
    const { rows } = await db.query(query)
    return rows[0] || {} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener el nivel:', error)
    throw error
  }
}

const modifySectionModel = async ({
    id_seccion,
    id_negocio,
    tipo_seccion,
    nombre_seccion,
    titulo_seccion,
    subtitulo_seccion,
    detalle_seccion,
    descripcion_seccion,
    url_seccion,
    video_seccion,
    fotos = [],
    iconos = [],
    pie
  }) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')
    /* ========================
       1. UPDATE SECCION
    ======================== */
    const { rows } = await client.query(`
      UPDATE seccion
      SET
        id_negocio=$2,
        tipo_seccion=$3,
        nombre_seccion=$4,
        titulo_seccion=$5,
        subtitulo_seccion=$6,
        detalle_seccion=$7,
        descripcion_seccion=$8,
        url_seccion=$9,
        video_seccion=$10
      WHERE id_seccion=$1
      RETURNING *;
    `, [
      id_seccion,
      id_negocio,
      tipo_seccion,
      nombre_seccion,
      titulo_seccion,
      subtitulo_seccion,
      detalle_seccion,
      descripcion_seccion,
      url_seccion,
      video_seccion
    ])
    /* ========================
       2. SINCRONIZAR ICONOS
    ======================== */
    const iconoIds = iconos
      .filter(i => i.id_icono)
      .map(i => i.id_icono)

    // Borrar los que no llegaron
    if (iconoIds.length > 0) {
      await client.query(`
        DELETE FROM icono
        WHERE id_seccion=$1
        AND id_icono NOT IN (${iconoIds.join(',')})
      `, [id_seccion])
    } else {
      await client.query(`
        DELETE FROM icono WHERE id_seccion=$1
      `, [id_seccion])
    }

    // Update / Insert
    for (const icono of iconos) {
      if (icono.id_icono) {
        // UPDATE
        await client.query(`
          UPDATE icono
          SET
            nombre_icono=$2,
            titulo_icono=$3,
            subtitulo_icono=$4,
            descripcion_icono=$5
          WHERE id_icono=$1
        `, [
          icono.id_icono,
          icono.nombre_icono,
          icono.titulo_icono,
          icono.subtitulo_icono,
          icono.descripcion_icono
        ])
      } else {
        // INSERT
        await client.query(`
          INSERT INTO icono (
            id_seccion,
            nombre_icono,
            titulo_icono,
            subtitulo_icono,
            descripcion_icono
          )
          VALUES ($1,$2,$3,$4,$5)
        `, [
          id_seccion,
          icono.nombre_icono,
          icono.titulo_icono,
          icono.subtitulo_icono,
          icono.descripcion_icono
        ])
      }
    }
    /* ========================
       3. SINCRONIZAR FOTOS
    ======================== */
    const fotoIds = fotos
      .filter(f => f.id_foto)
      .map(f => f.id_foto)

    // Borrar faltantes
    if (fotoIds.length > 0) {
      await client.query(`
        DELETE FROM foto
        WHERE id_seccion=$1
        AND id_foto NOT IN (${fotoIds.join(',')})
      `, [id_seccion])
    } else {
      await client.query(`
        DELETE FROM foto WHERE id_seccion=$1
      `, [id_seccion])
    }

    // Update / Insert
    for (const foto of fotos) {
      if (foto.id_foto) {
        // UPDATE
        await client.query(`
          UPDATE foto
          SET
            nombre_foto=$2,
            url_foto=$3
          WHERE id_foto=$1
        `, [
          foto.id_foto,
          foto.nombre_foto,
          foto.url_foto
        ])
      } else {
        // INSERT
        await client.query(`
          INSERT INTO foto (
            id_seccion,
            nombre_foto,
            url_foto
          )
          VALUES ($1,$2,$3)
        `, [
          id_seccion,
          foto.nombre_foto,
          foto.url_foto
        ])
      }
    }
    /* ========================
       4. UPDATE PIE
    ======================== */
    if (pie?.id_pie) {
      await client.query(`
        UPDATE pie
        SET
          nombre_pie=$2,
          url_pie=$3,
          mapa_pie=$4
        WHERE id_pie=$1
      `, [
        pie.id_pie,
        pie.nombre_pie,
        pie.url_pie,
        pie.mapa_pie
      ])
    }

    await client.query('COMMIT')
    return rows[0]

  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const modifyIconSeccionModel = async ({id_icono, id_seccion, nombre_icono, titulo_icono, subtitulo_icono, descripcion_icono}) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    // 1. guardar en la base de datos el nivel
    const insertIcon = await client.query(
      `
      UPDATE public.icono
      SET id_seccion=$2, nombre_icono=$3, titulo_icono=$4, subtitulo_icono=$5, descripcion_icono=$6
      WHERE id_icono=$1 RETURNING *;
      `,
      [id_icono, id_seccion, nombre_icono, titulo_icono, subtitulo_icono, descripcion_icono]
    )

    await client.query('COMMIT')

    return {
      ...insertIcon.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

module.exports = {
  getSectionByTypeModel,
  modifySectionModel,
  modifyIconSeccionModel,
}