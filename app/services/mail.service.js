const nodemailer = require('nodemailer')

console.log('MAIL_USER:', process.env.MAIL_USER)
console.log('MAIL_PASS:', process.env.MAIL_PASS ? 'OK' : 'NO')


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

const sendRecoveryEmail = async (email, token) => {
  const link = `${process.env.FRONT_URL}/reset-password?token=${token}`

  await transporter.sendMail({
    from: '"Hotel Felipez - (RECUPERAR CONTRASEÑA)" <no-reply@tusitio.com>',
    to: email,
    subject: 'Recuperación de contraseña',
    html: `
      <p>Haz clic para crear una nueva contraseña:</p>
      <a href="${link}">Restablecer contraseña</a>
      <p>Este enlace expira en 30 minutos.</p>
    `
  })
}

module.exports = {
  sendRecoveryEmail
}
