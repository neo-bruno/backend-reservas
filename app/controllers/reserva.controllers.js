const { httpError } = require('../helpers/error.helper')
const BookingModel = require('../models/reserva.models')

const saveBookingManual = async (req, res) => {
  try {
    const reserva = req.body

    const Reserva = await BookingModel.saveBookingManualModel(reserva)    
    
    if (!Reserva) {
      return res.status(404).json({ message: 'No se encontró la reserva' })
    }
    return res.status(200).json({
      message: 'Se ha guardado correctamente la reserva',
      data: Reserva
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Error en guardar los datos de la reserva',
      error: error.message
    })
  }
}
const saveBooking = async (req, res) => {
  try {
    const reserva = req.body

    const Reserva = await BookingModel.saveBookingModel(reserva)    
    
    if (!Reserva) {
      return res.status(404).json({ message: 'No se encontró la reserva' })
    }
    return res.status(200).json({
      message: 'Se ha guardado correctamente la reserva',
      data: Reserva
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Error en guardar los datos de la reserva',
      error: error.message
    })
  }
}

const getReservations = async (req, res) => {
  try {
    try {
      const Reservas = await BookingModel.getAllBooking()
      if (!Reservas) {
        res.status(404).json({ message: 'no se encontro las Reservas' })
      }
      res.status(201).json({ message: 'se ha obtenido las reservas', data: Reservas })
    } catch (error) {
      res.status(500).json({ message: 'error al obtener las reservas', error: error.message })
    }
  } catch (error) {
    httpError(res, error)
  }
}

const reservasActivasInactivas = async (req, res) => {
  try {
    const {id_usuario, tipo} = req.params
    try {      
      const Reservas = await BookingModel.reservasActivasInactivasModel(id_usuario, tipo)
      if (!Reservas) {
        res.status(404).json({ message: 'no se encontro las Reservas' })
      }
      res.status(201).json({ message: 'se ha obtenido las reservas', data: Reservas })
    } catch (error) {
      res.status(500).json({ message: 'error al obtener las reservas', error: error.message })
    }
  } catch (error) {
    httpError(res, error)
  }
}

const getReservationsType = async (req, res) => {
  try {
    const {id_usuario, tipo} = req.params
    
    try {      
      const Reservas = await BookingModel.getReservationsTypeModel(id_usuario, tipo)
      if (!Reservas) {
        res.status(404).json({ message: 'no se encontro las Reservas' })
      }
      res.status(201).json({ message: 'se ha obtenido las reservas', data: Reservas })
    } catch (error) {
      res.status(500).json({ message: 'error al obtener las reservas', error: error.message })
    }
  } catch (error) {
    httpError(res, error)
  }
}

const modifyBooking = async (req, res) => {
  const reserva = req.body
  try {
    try {
      const Reserva = await BookingModel.modifyBookingModel(reserva)
      if (!Reserva)
        return res.status(404).json({ message: 'no se ha encontrado la Reserva' })
      res.status(200).json({ message: 'se ha modificado los datos de la reserva correctamente!!!', data: Reserva })
    } catch (error) {
      res.status(500).json({ message: 'error al modificar los datos de la reserva', error: error.message })
    }
  } catch (error) {
    httpError(res, error)
  }
}

module.exports = {
  saveBooking,
  saveBookingManual,
  getReservations,
  modifyBooking,
  reservasActivasInactivas,
  getReservationsType,
}