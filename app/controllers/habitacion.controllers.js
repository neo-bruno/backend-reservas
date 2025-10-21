  const { httpError } = require('../helpers/error.helper')
const HabitacionModel = require('../models/habitacion.models')

const saveRoom = async (req, res) => {
  try {
    const habitacion = req.body
    try {
      const Room = await HabitacionModel.modifyRoomModel(habitacion)
      if(!Room){
        return res.status(404).json({message: 'Habitacion no encontrada'})
      }
      res.status(200).json({message: 'habitacion registrada correctamente', data: Room })
    } catch (error) { 
      res.status(500).json({ message: 'Error al guardar los datos de la habitacion', error: error.message})
    }
  } catch (error) {
    httpError(res, error)
  }
}

const modifyRoom = async (req, res) => {
  try {
    const habitacion = req.body
    try {
      const RoomModify = await HabitacionModel.modifyRoomModel(habitacion)
      if(!RoomModify){
        return res.status(404).json({ message: 'Habitacion no encontrada'})        
      }
      res.status(200).json({ message: 'Habitacion se ha modificado los datos correctamente!', data: RoomModify})
    } catch (error) {
      res.status(500).json({ message: 'Error al modificar los datos de la habitacion', error: error.message})
    }
  } catch (error) {
    httpError(res, error)
  }
}
 
const getRooms = async (req, res) => {
  try {
    const Rooms = await HabitacionModel.getRoomsModels()
    if(!Rooms){
      return res.status(404).json({ message: 'No se encontro ninguna Habitacion'})
    }
    res.status(201).send({ data: Rooms})
  } catch (error) {
    httpError(res, error)
  }
}

module.exports = {
  saveRoom,
  modifyRoom, 
  getRooms,
}