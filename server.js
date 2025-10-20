require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const db = require('./config/bd');
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/1.0', require('./app/routes'))
app.use('/public', express.static(`${__dirname}/img`))

// Manejador global de errores (antes del listen)
app.use((err, req, res, next) => {
  console.error('Error global:', err)
  if (!res.headersSent) {
    res.status(500).json({ error: 'Error interno del servidor' })
  } else {
    next(err)
  }
})

;(async () => {
  try {
    await db.connect();
    app.listen(PORT, () => {
      console.log(`✅ Servidor RESERVAS conectado en puerto ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar el servidor:', err);
  }
})();

