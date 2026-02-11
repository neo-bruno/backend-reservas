const { httpError } = require('../helpers/error.helper')
const payModel = require('../models/pago.models')

module.exports = {
  async savePay(req, res) {
    try {
      try {
        const { id_reserva, monto_pago, tipo_pago, metodo_pago, comision_pago, fecha_pago, estado_pago, url_pago } = req.body
  
        const pay = await payModel.savePayModel({ id_reserva, monto_pago, tipo_pago, metodo_pago, comision_pago, fecha_pago, estado_pago, url_pago })
  
        if (!pay)
          return res.status(404).json({ message: 'no se ha encontrado el objeto pago'})
        res.status(200).json({ message: 'Pago Registrado correctamente!' })
      } catch (error) {
        res.status(500).json({message: 'error al registrar el objeto pago!!!', error: error.message })
      }      
    } catch (error) {
      httpError(res, error)
    }
  },

  async getPayments(req, res) {
    try {
      try {
        const payments = await payModel.getPaymentsModel()

        if(!payments)
          return res.status(404).json({ message: 'no se ha encontrado los registros de PAGO'})
        res.status(201).json({ message: 'se ha obtenido los PAGOS correctamente!!!', data: payments})
      } catch (error) {
        res.status(500).json({ message: 'error al obtener los PAGOS', error: error.message})
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async getAllPaymentsBooking(req, res) {
    try {
      const id_reserva = req.params.id_reserva
      try {
        const Payments = await payModel.getAllPaymentsBookingModel(id_reserva)

        if(!Payments)
          return res.status(404).json({ message: 'no se ha encontrado el objeto PAGO'})
        res.status(201).json({ message: 'se ha obtenido el PAGO', data: Payments})
      } catch (error) {
        res.status(500).json({ message: 'error al obtener el PAGO', error: error.message})
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async modifyPay(req, res) {
    try {
      try {
        const { id_pago, id_reserva, monto_pago, tipo_pago, metodo_pago, comision_pago, fecha_pago, estado_pago, url_pago } = req.body
  
        const payments = await payModel.modifyPayModel({ id_pago, id_reserva, monto_pago, tipo_pago, metodo_pago, comision_pago, fecha_pago, estado_pago, url_pago })
  
        if (!payments)
          return res.status(404).json({ message: 'no se ha encontrado el objeto pago'})
        res.status(200).json({ message: 'PAGO Modificado correctamente!' })
      } catch (error) {
        res.status(500).json({message: 'error al modificar el objeto pago!!!', error: error.message })
      }      
    } catch (error) {
      httpError(res, error)
    }
  },
  
}
