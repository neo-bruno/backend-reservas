const bd = require('../../config/bd')

const saveBusinessModel = async (negocio) => {
  const client = await bd.connect();
  try {
    await client.query('BEGIN');

    const { id_usuario, rol_usuario_negocio, tipo_negocio, nombre_negocio, ubicacion_negocio, descripcion_negocio, telefono_negocio, estado_negocio, url_negocio, nombre_url_negocio, codigo_celular_negocio } = negocio;

    // 1️⃣ Crear el negocio
    const negocioResult = await client.query(
      `
      INSERT INTO public.negocio(
      tipo_negocio, nombre_negocio, ubicacion_negocio, descripcion_negocio, telefono_negocio, estado_negocio, url_negocio, nombre_url_negocio, codigo_celular_negocio)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_negocio      
      `,
      [tipo_negocio, nombre_negocio, ubicacion_negocio, descripcion_negocio, telefono_negocio, estado_negocio, url_negocio, nombre_url_negocio, codigo_celular_negocio]
    );

    const id_negocio = negocioResult.rows[0].id_negocio;

    // 2️⃣ Asociar el usuario creador al negocio
    await client.query(
      `      
      INSERT INTO public.usuario_negocio(
      id_negocio, id_usuario, rol_usuario_negocio)
      VALUES ($1, $2, $3);
      `,
      [id_negocio, id_usuario, rol_usuario_negocio]
    );

    const Negocio = negocioResult.rows[0]

    await client.query('COMMIT');
    return { Negocio };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error
  } finally {
    client.release();
  }
}

const modifyBusinessModel = async (negocio) => {
  const client = await bd.connect()
  try {
    await client.query('BEGIN')

    const { id_negocio, tipo_negocio, nombre_negocio, ubicacion_negocio, descripcion_negocio, telefono_negocio, estado_negocio, url_negocio, nombre_url_negocio, codigo_celular_negocio } = negocio;

    // 1. guardar en la base de datos el nivel
    const businessModify = await client.query(
      `
      UPDATE public.negocio
      SET tipo_negocio=$2, nombre_negocio=$3, ubicacion_negocio=$4, descripcion_negocio=$5, telefono_negocio=$6, estado_negocio=$7, url_negocio=$8, nombre_url_negocio=$9, codigo_celular_negocio=$10
      WHERE id_negocio=$1 RETURNING *;      
      `,
      [ id_negocio, tipo_negocio, nombre_negocio, ubicacion_negocio, descripcion_negocio, telefono_negocio, estado_negocio, url_negocio, nombre_url_negocio, codigo_celular_negocio ]
    )
    
    await client.query('COMMIT');
    return { businessModify };
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const getBusinessModel = async (tipo_negocio) => {
  try {
    const query = {
      text: `
      SELECT 
          n.id_negocio,
          n.tipo_negocio,
          n.nombre_negocio,
          n.ubicacion_negocio,
          n.descripcion_negocio,
          n.telefono_negocio,
          n.estado_negocio,
          n.url_negocio,
          n.nombre_url_negocio,
          n.codigo_celular_negocio,
                    
          -- Usuario que pertenece al negocio
          json_build_object(
              'id_usuario', u.id_usuario,
              'nombre_usuario', u.nombre_usuario,              
              'telefono_usuario', u.telefono_usuario,
              'verificado_usuario', u.verificado_usuario,
              'persona', json_build_object(
                  'id_persona', p.id_persona,
                  'nombre_persona', p.nombre_persona,
                  'documento_persona', p.documento_persona,
                  'telefono_persona', p.telefono_persona
              )
          ) AS usuario_negocio           
      -- Relación con usuario del negocio
	  FROM negocio n	  
      LEFT JOIN usuario_negocio un ON un.id_negocio = n.id_negocio
      LEFT JOIN usuario u ON u.id_usuario = un.id_usuario
      LEFT JOIN persona p ON p.id_persona = u.id_persona

      WHERE n.tipo_negocio = $1

      GROUP BY 
          n.id_negocio, n.tipo_negocio, n.nombre_negocio, n.ubicacion_negocio,
          n.telefono_negocio,
          u.id_usuario, p.id_persona;
    `,
      values: [tipo_negocio]
    }
    const { rows } = await bd.query(query)
    return rows
  } catch (error) {
    throw error
  }
}

module.exports = {
  saveBusinessModel,
  modifyBusinessModel,
  getBusinessModel
}