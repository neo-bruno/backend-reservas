const { httpError } = require('../helpers/error.helper')
const multer = require('multer')
const path = require('path')
const { DIR_HOST, PORT } = process.env


// ==============================
// CONFIG STORAGE
// ==============================
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    // Guardar en /img
    cb(null, path.join(process.cwd(), './img'))
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}${ext}`)
  }

})


// ==============================
// FILE FILTER
// ==============================
const fileFilter = function (req, file, cb) {

  const allowedTypes = [

    // IMAGENES
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/avif',
    'image/webp',

    // VIDEOS
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime', // .mov

  ]

  if (!allowedTypes.includes(file.mimetype)) {

    const error = new Error('Tipo de archivo no permitido')
    error.code = 'LIMIT_FILE_TYPES'

    return cb(error, false)
  }

  cb(null, true)
}


// ==============================
// MULTER CONFIG
// ==============================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
}).single('file')


// ==============================
// CONTROLLER
// ==============================
const saveFileImage = async (req, res) => {
  try {
    upload(req, res, (err) => {
      if (err) {
        err.message = 'Error al guardar el archivo'
        return httpError(res, err)
      }
      if (!req.file) {
        return res.status(400).json({
          error: 'No se envió ningún archivo'
        })
      }
      const { filename } = req.file
      const urlFile = `${DIR_HOST}:${PORT}/public/${filename}`
      return res.status(200).send(urlFile)
    })

  } catch (error) {
    return httpError(res, error)
  }
}

module.exports = { saveFileImage }