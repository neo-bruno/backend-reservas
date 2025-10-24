const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Exportamos funciones útiles
module.exports = {
  query: (text, params) => pool.query(text, params),  // ahora db.query() funciona
  connect: () => pool.connect()                        // para transacciones si quieres
};
