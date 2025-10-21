const { client, isClientReady } = require('../whatsapp/index'); // Importar el cliente y el estado

// Middleware para verificar si el número está registrado en WhatsApp
const verifyNumberWhatsApp = async (req, res, next) => {
    try {
        const telefono = req.params.numero_telefono;

        // Verificar que el número fue proporcionado
        if (!telefono) {
            return res.status(400).json({ error: 'El número de teléfono es requerido.' });
        }

        // Verificar si el cliente está listo antes de intentar verificar el número
        if (!isClientReady) {
            return res.status(503).json({
                error: 'El cliente de WhatsApp no está listo. Por favor, espera un momento.'
            });
        }

        // Validar si el número está registrado en WhatsApp
        const isRegistered = await client.isRegisteredUser(telefono + '@c.us');

        if (isRegistered) {
            console.log(`${telefono} está registrado en WhatsApp.`);
            return res.status(200).json({
                respuesta: true,
                mensaje: 'El número de teléfono es válido y está registrado en WhatsApp.'
            });
        } else {
            console.log(`${telefono} NO está registrado en WhatsApp.`);
            return res.status(404).json({
                respuesta: false,
                mensaje: 'El número de teléfono NO está registrado en WhatsApp.'
            });
        }

    } catch (error) {
        console.error('Error al verificar el número:', error);
        return res.status(500).json({ error: 'Error al verificar el número.' });
    }
};

module.exports = { verifyNumberWhatsApp };
