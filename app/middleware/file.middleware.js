const { httpError } = require('../helpers/error.helper')
const multer = require('multer')
const path = require('path')
const { DIR_HOST, PORT } = process.env

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // ../../../hotel_frontend/src/assets/
    cb(null, path.join(process.cwd(), './img'))
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop()
    cb(null, `${Date.now()}.${ext}`)
  }
})

const fileFilter = function (req, file, cb) {
  const allowedTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/avif"] //"application/pdf", "application/docx", "application/txt", "image/jpg", "image/jpeg", "image/png", "image/gif"
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("wrong file type");
    error.code = "LIMIT_FILE_TYPES";
    return cb(error, false);
  }
  cb(null, true);
}

const saveFileImage = async (req, res, next) => {
  try {
    const archivado = multer({ storage: storage, fileFilter: fileFilter }).single('file')
    archivado(req, res, async (err) => {
      if (err) {
        err.message = 'Error al guardar el archivo de imagen'
        return httpError(res, err)
      } else {
        const { filename } = req.file
        const urlFile = `${DIR_HOST}:${PORT}/public/${filename}`
        return res.status(200).send(urlFile) // 👈 Nada más, sin next()
      }
    })
  } catch (error) {
    return httpError(res, error)
  }
}



module.exports = { saveFileImage }