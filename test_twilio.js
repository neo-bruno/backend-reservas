const twilio = require('twilio');
const client = twilio('TU_ACCOUNT_SID', 'TU_AUTH_TOKEN');

client.messages.create({
  from: 'whatsapp:+14155238886', // Sandbox Twilio
  to: 'whatsapp:+59171234567',   // tu número registrado
  body: 'Mensaje de prueba desde Twilio!'
}).then(msg => console.log(msg.sid))
  .catch(err => console.error(err));
