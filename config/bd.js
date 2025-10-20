const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const connect = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("🟢 Conexión a la base de datos exitosa:", result.rows[0].now);
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
    throw error;
  }
};

module.exports = { pool, connect };
