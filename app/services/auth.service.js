const crypto = require('crypto')
const bcrypt = require('bcrypt')
const db = require('../../config/bd.js')
const { sendRecoveryEmail } = require('./mail.service.js')

const forgotPassword = async (email_usuario) => {
  const userRes = await db.query(`
    SELECT id_usuario, verificado_email_usuario
    FROM usuario
    WHERE email_usuario = $1
  `, [email_usuario])

  if (userRes.rowCount === 0) return

  const user = userRes.rows[0]
  
  if (!user.verificado_email_usuario) return

  await db.query(`
    UPDATE password_resets
    SET used = true
    WHERE id_usuario = $1
  `, [user.id_usuario])

  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  await db.query(`
    INSERT INTO password_resets (id_usuario, token_hash, expires_at)
    VALUES ($1, $2, NOW() + INTERVAL '30 minutes')
  `, [user.id_usuario, tokenHash])
    console.log(email_usuario, token)
  await sendRecoveryEmail(email_usuario, token)
}

const resetPassword = async (token, password) => {
  const tokenHash = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

  const res = await db.query(`
    SELECT id_reset, id_usuario
    FROM password_resets
    WHERE token_hash = $1
      AND used = false
      AND expires_at > NOW()
  `, [tokenHash])

  if (res.rowCount === 0) {
    throw new Error('Token inválido o expirado')
  }

  const { id_reset, id_usuario } = res.rows[0]

  const contrasena_usuario = await bcrypt.hash(password, 10)

  await db.query(`
    UPDATE usuario
    SET contrasena_usuario = $1
    WHERE id_usuario = $2
  `, [contrasena_usuario, id_usuario])

  await db.query(`
    UPDATE password_resets
    SET used = true
    WHERE id_reset = $1
  `, [id_reset])
}


module.exports = {
  forgotPassword,
  resetPassword
}
