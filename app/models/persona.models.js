const db = require('../../config/bd')

const savePersonModel = async (dato) => {
  const client = await db.connect()
  try {
    const { nombre_persona, documento_persona, expedicion_persona, fecha_nacimiento_persona, nit_persona, razon_social_persona, telefono_persona, tipo_persona, id_registro, nacionalidad_persona, profesion_persona, procedencia_persona, razon_visita_persona, fotos_persona } = dato
    await client.query('BEGIN')

    // 1. guardar en la base de datos el nivel
    const insertPerson = await client.query(
      `
      INSERT INTO public.persona(
      nombre_persona, documento_persona, expedicion_persona, fecha_nacimiento_persona, nit_persona, razon_social_persona, telefono_persona, tipo_persona, nacionalidad_persona, profesion_persona, procedencia_persona, razon_visita_persona)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;
      `,
      [nombre_persona, documento_persona, expedicion_persona, fecha_nacimiento_persona, nit_persona, razon_social_persona, telefono_persona, tipo_persona, nacionalidad_persona, profesion_persona, procedencia_persona, razon_visita_persona]
    )
    const id_persona = insertPerson.rows[0].id_persona

    await client.query(
      `
        INSERT INTO public.registro_persona(
        id_persona, id_registro)
        VALUES ($1, $2);
      `,
      [id_persona, id_registro]
    )

    if(fotos_persona.length > 0){
      for (const foto of fotos_persona) {
        await client.query(
          `
            INSERT INTO public.foto_persona(
            id_persona, tipo_foto_persona, nombre_foto_persona, url_foto_persona)
            VALUES ($1, $2, $3, $4);
          `,
          [id_persona, foto.tipo_foto_persona, foto.nombre_foto_persona, foto.url_foto_persona]
        )   
      }
    }

    await client.query('COMMIT')

    return {
      ...insertPerson.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const saveOnlyPersonModel = async (dato) => {
  const client = await db.connect()
  try {
    const { nombre_persona, documento_persona, expedicion_persona, fecha_nacimiento_persona, nit_persona, razon_social_persona, telefono_persona, tipo_persona, nacionalidad_persona, profesion_persona, procedencia_persona, razon_visita_persona, fotos_persona } = dato
    await client.query('BEGIN')

    // 1. guardar en la base de datos el nivel
    const insertPerson = await client.query(
      `
      INSERT INTO public.persona(
      nombre_persona, documento_persona, expedicion_persona, fecha_nacimiento_persona, nit_persona, razon_social_persona, telefono_persona, tipo_persona, nacionalidad_persona, profesion_persona, procedencia_persona, razon_visita_persona)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;
      `,
      [nombre_persona, documento_persona, expedicion_persona, fecha_nacimiento_persona, nit_persona, razon_social_persona, telefono_persona, tipo_persona, nacionalidad_persona, profesion_persona, procedencia_persona, razon_visita_persona]
    )
    const id_persona = insertPerson.rows[0].id_persona
    
    if(fotos_persona.length > 0){
      for (const foto of fotos_persona) {
        await client.query(
          `
            INSERT INTO public.foto_persona(
            id_persona, tipo_foto_persona, nombre_foto_persona, url_foto_persona)
            VALUES ($1, $2, $3, $4);
          `,
          [id_persona, foto.tipo_foto_persona, foto.nombre_foto_persona, foto.url_foto_persona]
        )   
      }
    }

    await client.query('COMMIT')

    return {
      ...insertPerson.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const saveRegisterPersonModel = async (dato) => {
  const client = await db.connect()
  try {
    const { id_persona, id_registro } = dato
    await client.query('BEGIN')

    // 1. guardar en la base de datos el nivel
    const insertRegisterPerson = await client.query(
      `
      INSERT INTO public.registro_persona(
      id_persona, id_registro)
      VALUES ($1, $2) RETURNING *;
      `,
      [id_persona, id_registro]
    )

    await client.query('COMMIT')

    return {
      ...insertRegisterPerson.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const getPersonsModel = async (id_registro) => {
  try {
    const query = {
      text: `
        SELECT 
          p.*,
          COALESCE(
              json_agg(
                  json_build_object(
                      'id_foto_persona', fp.id_foto_persona,
                      'tipo_foto_persona', fp.tipo_foto_persona,
                      'nombre_foto_persona', fp.nombre_foto_persona,
                      'url_foto_persona', fp.url_foto_persona
                  )
              ) FILTER (WHERE fp.id_foto_persona IS NOT NULL),
              '[]'
          ) AS fotos_persona

      FROM registro_persona rp

      JOIN persona p 
          ON p.id_persona = rp.id_persona

      LEFT JOIN foto_persona fp 
          ON fp.id_persona = p.id_persona

      WHERE rp.id_registro = $1

      GROUP BY p.id_persona;
      `,
      values: [id_registro]
    }
    const { rows } = await db.query(query)
    return rows || {} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener todas las personas:', error)
    throw error
  }
}

const deletePersonRegisterModel = async (data) => {
  const client = await db.connect()

  try {
    const { id_persona, id_registro } = data

    await client.query('BEGIN')

    const result = await client.query(
      `DELETE FROM public.registro_persona
       WHERE id_persona = $1 AND id_registro = $2`,
      [id_persona, id_registro]
    )

    if (result.rowCount === 0) {
      throw new Error('No se encontró el registro para eliminar')
    }

    await client.query('COMMIT')

    return { success: true }

  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const getAllPersonsModel = async () => {
  try {
    const query = {
      text: `
        SELECT 
            p.*,
            COALESCE(
                json_agg(
                    json_build_object(
                        'id_foto_persona', fp.id_foto_persona,
                        'tipo_foto_persona', fp.tipo_foto_persona,
                        'nombre_foto_persona', fp.nombre_foto_persona,
                        'url_foto_persona', fp.url_foto_persona
                    )
                ) FILTER (WHERE fp.id_foto_persona IS NOT NULL),
                '[]'
            ) AS fotos_persona
        FROM persona p
        LEFT JOIN foto_persona fp 
            ON fp.id_persona = p.id_persona
        GROUP BY p.id_persona;
      `
    }
    const { rows } = await db.query(query)
    return rows || {} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener todas las personas:', error)
    throw error
  }
}

const getPhotosPersonModel = async (id_persona) => {
  try {
    const query = {
      text: `
        select * from foto_persona where id_persona = $1;
      `,
      values: [id_persona]
    }
    const { rows } = await db.query(query)
    return rows || {} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener todas las personas:', error)
    throw error
  }
}
const modifyPersonModel = async (data) => {
  const client = await db.connect()

  try {
    const {
      id_persona,
      nombre_persona,
      documento_persona,
      expedicion_persona,
      fecha_nacimiento_persona,
      nit_persona,
      razon_social_persona,
      telefono_persona,
      tipo_persona,
      nacionalidad_persona,
      profesion_persona,
      procedencia_persona,
      razon_visita_persona,
      fotos_persona = []
    } = data

    await client.query('BEGIN')

    // 🔹 1. UPDATE PERSONA
    const result = await client.query(
      `
      UPDATE persona
      SET nombre_persona=$2,
          documento_persona=$3,
          expedicion_persona=$4,
          fecha_nacimiento_persona=$5,
          nit_persona=$6,
          razon_social_persona=$7,
          telefono_persona=$8,
          tipo_persona=$9,
          nacionalidad_persona=$10,
          profesion_persona=$11,
          procedencia_persona=$12,
          razon_visita_persona=$13  
      WHERE id_persona=$1
      RETURNING *;
      `,
      [
        id_persona,
        nombre_persona,
        documento_persona,
        expedicion_persona,
        fecha_nacimiento_persona,
        nit_persona,
        razon_social_persona,
        telefono_persona,
        tipo_persona,
        nacionalidad_persona,
        profesion_persona,
        procedencia_persona,
        razon_visita_persona
      ]
    )

    // 🔹 2. FOTOS ACTUALES EN BD
    const { rows: fotosDB } = await client.query(
      `SELECT * FROM foto_persona WHERE id_persona = $1`,
      [id_persona]
    )

    const idsDB = fotosDB.map(f => f.id_foto_persona)

    // 🔥 3. ELIMINACIÓN CORRECTA (INCLUYE CASO ARRAY VACÍO)
    let fotosEliminar = []

    if (fotos_persona.length === 0) {
      // 🚨 CASO IMPORTANTE: borrar todo
      fotosEliminar = idsDB
    } else {
      // 🔹 fotos que ya existen en frontend
      const idsFrontend = fotos_persona
        .filter(f => f.id_foto_persona)
        .map(f => f.id_foto_persona)

      fotosEliminar = idsDB.filter(id => !idsFrontend.includes(id))
    }

    console.log('🗑️ FOTOS A ELIMINAR:', fotosEliminar)

    if (fotosEliminar.length > 0) {
      await client.query(
        `DELETE FROM foto_persona WHERE id_foto_persona = ANY($1)`,
        [fotosEliminar]
      )
    }

    // 🔹 4. INSERTAR NUEVAS FOTOS
    const fotosNuevas = fotos_persona.filter(f =>
      !f.id_foto_persona && f.url_foto_persona
    )

    console.log('🆕 FOTOS NUEVAS:', fotosNuevas)

    for (const foto of fotosNuevas) {
      await client.query(
        `
        INSERT INTO foto_persona (
          id_persona,
          tipo_foto_persona,
          nombre_foto_persona,
          url_foto_persona
        )
        VALUES ($1, $2, $3, $4)
        `,
        [
          id_persona,
          foto.tipo_foto_persona || 1,
          foto.nombre_foto_persona,
          foto.url_foto_persona
        ]
      )
    }

    // 🔹 5. COMMIT
    await client.query('COMMIT')
    console.log('✅ COMMIT HECHO')

    // 🔥 6. DEVOLVER DATOS ACTUALIZADOS
    const { rows: fotosFinal } = await client.query(
      `SELECT * FROM foto_persona WHERE id_persona = $1`,
      [id_persona]
    )

    return {
      ...result.rows[0],
      fotos_persona: fotosFinal
    }

  } catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ ROLLBACK:', error)
    throw error
  } finally {
    client.release()
  }
}

module.exports = {
  savePersonModel,
  saveRegisterPersonModel,
  saveOnlyPersonModel,
  getPersonsModel,
  getPhotosPersonModel,
  getAllPersonsModel,
  deletePersonRegisterModel,
  modifyPersonModel,
}