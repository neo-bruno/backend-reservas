const bd = require('../../config/bd')

const saveBusinessModel = async (negocio) => {
  const client = await bd.connect();
  try {
    await client.query('BEGIN');

    const { id_usuario, rol_usuario_negocio, id_estado, tipo_negocio, nombre_negocio, ubicacion_negocio, descripcion_negocio, telefono_negocio } = negocio;
    
    // 1️⃣ Crear el negocio
    const negocioResult = await client.query(
      `
      INSERT INTO negocio (id_estado, tipo_negocio, nombre_negocio, ubicacion_negocio, descripcion_negocio, telefono_negocio)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id_negocio
      `,
      [ id_estado, tipo_negocio, nombre_negocio, ubicacion_negocio, descripcion_negocio, telefono_negocio ]
    );

    const id_negocio = negocioResult.rows[0];

    // 2️⃣ Asociar el usuario creador al negocio
    await client.query(
      `
      INSERT INTO usuario_negocio (id_negocio, id_usuario, rol_usuario_negocio)
      VALUES ($1, $2, $3)
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

const getBusinessModel = async (tipo_negocio) => {
  try {
    const query = {
      text: `
      SELECT 
          n.id_negocio,
          n.tipo_negocio,
          n.nombre_negocio,
          n.ubicacion_negocio,
          n.telefono_negocio,
          n.fecha_creacion_negocio,

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
          ) AS usuario_negocio,

          -- Habitaciones del negocio
          COALESCE(
              json_agg(
                  DISTINCT jsonb_build_object(
                      'id_habitacion', h.id_habitacion,
                      'id_negocio', h.id_negocio,
                      'id_estado', h.id_estado,
                      'tipo_habitacion', h.tipo_habitacion,                      
                      'numero_habitacion', h.numero_habitacion,
					            'nombre_habitacion', h.nombre_habitacion,
                      'descripcion_habitacion', h.descripcion_habitacion,
                      'precio_habitacion', h.precio_habitacion,
                      'capacidad_habitacion', h.capacidad_habitacion,                      
                      'fecha_creacion_habitacion', h.fecha_creacion_habitacion
                  )
              ) FILTER (WHERE h.id_habitacion IS NOT NULL),
              '[]'::json
          ) AS habitaciones

      FROM negocio n
      -- Relación con habitaciones
      LEFT JOIN habitacion h ON h.id_negocio = n.id_negocio

      -- Relación con usuario del negocio
      LEFT JOIN usuario_negocio un ON un.id_negocio = n.id_negocio
      LEFT JOIN usuario u ON u.id_usuario = un.id_usuario
      LEFT JOIN persona p ON p.id_persona = u.id_persona

      WHERE n.tipo_negocio = $1

      GROUP BY 
          n.id_negocio, n.tipo_negocio, n.nombre_negocio, n.ubicacion_negocio,
          n.telefono_negocio, n.fecha_creacion_negocio,
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
  getBusinessModel
}