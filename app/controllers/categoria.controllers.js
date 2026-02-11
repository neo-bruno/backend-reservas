const { httpError } = require('../helpers/error.helper')
const CategoryModel = require('../models/categoria.models')

module.exports = {
  async saveCategory(req, res) {
    try {
      try {
        const { nombre_categoria, descripcion_categoria, precio_ahora_categoria, precio_antes_categoria, descuento_categoria, cant_noches_categoria } = req.body
  
        const category = await CategoryModel.saveCategoryModel({ nombre_categoria, descripcion_categoria, precio_ahora_categoria, precio_antes_categoria, descuento_categoria, cant_noches_categoria })
  
        if (!category)
          return res.status(404).json({ message: 'no se ha encontrado el objeto CATEGORIA'})
        res.status(200).json({ message: 'Categoria Registrado correctamente!' })
      } catch (error) {
        res.status(500).json({message: 'error al registrar el objeto CATEGORIA!!!', error: error.message })
      }      
    } catch (error) {
      httpError(res, error)
    }
  },

  async getCategories(req, res) {
    try {
      try {
        const categories = await CategoryModel.getCategoriesModel()

        if(!categories)
          return res.status(404).json({ message: 'no se ha encontrado los registros de CATEGORIA'})
        res.status(201).json({ message: 'se ha obtenido las CATEGORIAS correctamente!!!', data: categories})
      } catch (error) {
        res.status(500).json({ message: 'error al obtener los CATEGORIAS', error: error.message})
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async getCategory(req, res) {
    try {
      const id_categoria = req.params.id_categoria
      try {
        const Category = await CategoryModel.getCategoryModel(id_categoria)

        if(!Category)
          return res.status(404).json({ message: 'no se ha encontrado el objeto CATEGORIA'})
        res.status(201).json({ message: 'se ha obtenido el CATEGORIA', data: Category})
      } catch (error) {
        res.status(500).json({ message: 'error al obtener el CATEGORIA', error: error.message})
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async modifyCategory(req, res) {
    try {
      try {
        const { id_categoria, nombre_categoria, descripcion_categoria, precio_ahora_categoria, precio_antes_categoria, descuento_categoria, cant_noches_categoria } = req.body
  
        const Category = await CategoryModel.modifyCategoryModel({ id_categoria, nombre_categoria, descripcion_categoria, precio_ahora_categoria, precio_antes_categoria, descuento_categoria, cant_noches_categoria })
  
        if (!Category)
          return res.status(404).json({ message: 'no se ha encontrado el objeto categoria'})
        res.status(200).json({ message: 'Categoria Modificado correctamente!' })
      } catch (error) {
        res.status(500).json({message: 'error al modificar el objeto categoria!!!', error: error.message })
      }      
    } catch (error) {
      httpError(res, error)
    }
  },
  
}
