const { httpError } = require('../helpers/error.helper')
const reportModel = require('../models/reporte.models')

module.exports = {

  async getYears(req, res) {
    try {
      try {
        const report = await reportModel.getYearsModel()

        if (!report)
          return res.status(404).json({ message: 'no se ha encontrado los registros del REPORTE' })
        res.status(201).json({ message: 'se ha obtenido los REPORTES correctamente!!!', data: report })
      } catch (error) {
        res.status(500).json({ message: 'error al obtener los REPORTES', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async getMonthsYear(req, res) {
    try {
      const ano = req.params.ano
      try {
        const Report = await reportModel.getMonthsYearModel(ano)

        if (!Report)
          return res.status(404).json({ message: 'no se ha encontrado el objeto REPORTE' })
        res.status(201).json({ message: 'se ha obtenido el REPORTE', data: Report })
      } catch (error) {
        res.status(500).json({ message: 'error al obtener el REPORTE', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async getMonthlyReport(req, res) {
    try {
      const { ano, mes } = req.params
      try {
        const Report = await reportModel.getMonthlyReportModel(ano, mes)

        if (!Report)
          return res.status(404).json({ message: 'no se ha encontrado el objeto REPORTE' })
        res.status(201).json({ message: 'se ha obtenido el REPORTE', data: Report })
      } catch (error) {
        res.status(500).json({ message: 'error al obtener el REPORTE', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async getReport(req, res) {
    try {
      const { ano, mes, tipo } = req.params
      try {
        const Report = await reportModel.getReportModel(ano, mes, tipo)

        if (!Report)
          return res.status(404).json({ message: 'no se ha encontrado el objeto REPORTE' })
        res.status(201).json({ message: 'se ha obtenido el REPORTE', data: Report })
      } catch (error) {
        res.status(500).json({ message: 'error al obtener el REPORTE', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async getReportGraphic(req, res) {
    try {
      const { ano, mes } = req.params
      try {
        const Report = await reportModel.getReportGraphicModel(ano, mes)

        if (!Report)
          return res.status(404).json({ message: 'no se ha encontrado el objeto REPORTE' })
        res.status(201).json({ message: 'se ha obtenido el REPORTE', data: Report })
      } catch (error) {
        res.status(500).json({ message: 'error al obtener el REPORTE', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async getReportMonth(req, res) {
    try {
      const { ano } = req.params
      try {
        const Report = await reportModel.getReportMonthModel(ano)

        if (!Report)
          return res.status(404).json({ message: 'no se ha encontrado el objeto REPORTE' })
        res.status(201).json({ message: 'se ha obtenido el REPORTE', data: Report })
      } catch (error) {
        res.status(500).json({ message: 'error al obtener el REPORTE', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  }
}
