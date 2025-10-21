const client  = require('../whatsapp/index')

// Endpoint para enviar un mensaje
const sendMessage = async (req, res, next) => {

    try {
        const { telefono, mensaje } = req.body

        if (!telefono || !mensaje) {
            return res.status(400).json({ mensaje: 'Número de destino y mensaje son requeridos' });
        }

        const chatId = `${telefono}@c.us`;
        const response = await client.sendMessage(chatId, mensaje);
        // res.json({ message: 'Mensaje enviado', response });
        if(response){
            console.log('se ha realizado la notificacion')
            next()
        }
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({ error: 'Error al enviar mensaje' });
    }
}

module.exports = { sendMessage }
