const { httpError } = require('../helpers/error.helper')
const productModel = require('../models/producto.models')

module.exports = {
  async getAllProducts(req, res) {
    try {
      try {
        const productos = await productModel.getAllProductsModel()

        if (!productos)
          return res.status(404).json({ message: 'no se ha encontrado los PRODUCTOS' })
        res.status(201).json({ message: 'se ha obtenido los PRODUCTOS', data: productos })
      } catch (error) {
        res.status(500).json({ message: 'error al obtener los PRODUCTOS', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async saveProduct(req, res) {
    try {
      const producto = req.body
      try {
        const Producto = await productModel.saveProductModel(producto)
        if (!Producto)
          return res.status(401).json({ message: 'No encuentra el Producto' })
        res.status(200).json({ message: 'se registro el Producto correctamente!', data: Producto })
      } catch (error) {
        res.status(500).json({ message: 'Error al guardar los datos del Producto', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async modifyProduct(req, res) {
    try {
      const producto = req.body
      try {
        const Producto = await productModel.modifyProductModel(producto)
        if (!Producto)
          return res.status(401).json({ message: 'No encuentra el Producto' })
        res.status(200).json({ message: 'se modifico el Producto correctamente!', data: Producto })
      } catch (error) {
        res.status(500).json({ message: 'Error al modificar los datos del Producto', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },
}