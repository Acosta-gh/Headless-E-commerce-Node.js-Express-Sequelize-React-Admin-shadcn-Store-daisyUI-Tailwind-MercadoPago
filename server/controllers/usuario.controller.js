const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/email.service');

const LOGIN_SECRET = process.env.JWT_SECRET;
const LOGIN_EXP = process.env.JWT_EXPIRATION || '1h';

const EMAIL_VERIFY_SECRET = process.env.EMAIL_VERIFY_SECRET || LOGIN_SECRET;
const EMAIL_VERIFY_EXP = process.env.EMAIL_VERIFY_EXP || '24h';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

// Utilidad para quitar campos sensibles
function toPublicUser(usuarioInstance) {
  if (!usuarioInstance) return null;
  const { password, verificationToken, verificationTokenExpires, ...rest } =
    usuarioInstance.get({ plain: true });
  return rest;
}

// GET /api/usuario
exports.getAllUsuarios = async (_req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] }
    });
    return res.json(usuarios);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Error interno' });
  }
};

// GET /api/usuario/:id
exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.json(usuario);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Error interno' });
  }
};

// POST /api/usuario/register
exports.createUsuario = async (req, res) => {
  try {
    const { email, password, nombre, telefono, direccion } = req.body;
    if (!email || !password || !nombre) {
      return res.status(400).json({ message: 'Nombre, email y password son requeridos' });
    }

    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ message: 'El email ya está en uso' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      email,
      telefono: telefono || null,
      direccion: direccion || null,
      password: hashed,
      admin: false,
      repartidor: false,
      verificado: false
    });
    console.log('[createUsuario] Usuario creado:', usuario.id);
    const verificationToken = jwt.sign(
      { sub: usuario.id, purpose: 'email-verify' },
      EMAIL_VERIFY_SECRET,
      { expiresIn: EMAIL_VERIFY_EXP }
    );

    const verifyLink = `${APP_URL}/verificar?token=${verificationToken}`;
    console.log('[createUsuario] verifyLink =', verifyLink);

    const subject = 'Confirma tu cuenta';
    const html = `
      <p>Hola <b>${usuario.nombre}</b>, gracias por registrarte.</p>
      <p>Confirma tu cuenta (expira en ${EMAIL_VERIFY_EXP}):</p>
      <p><a href="${verifyLink}" target="_blank" rel="noopener noreferrer">Confirmar cuenta</a></p>
      <p>Si no solicitaste esta cuenta, ignora este correo.</p>
    `;

    sendEmail(email, subject, html)
      .then(() => console.log('[Email] Verificación enviado a', email))
      .catch(e => console.error('[Email verificación error]', e.message));

    return res.status(201).json({
      message: 'Usuario creado. Revisa tu email para confirmar la cuenta.',
      usuario: toPublicUser(usuario)
    });
  } catch (err) {
    return res.status(400).json({ message: err.message || 'Error al crear usuario' });
  }
};

// GET /api/usuario/verify?token=...
exports.verifyEmail = async (req, res) => {
  console.log('[verifyEmail] query =', req.query);
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: 'Token requerido' });
    }

    let payload;
    try {
      payload = jwt.verify(token, EMAIL_VERIFY_SECRET);
    } catch (e) {
      console.log('[verifyEmail] jwt error:', e.message);
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    console.log('[verifyEmail] payload =', payload);

    if (payload.purpose !== 'email-verify') {
      return res.status(400).json({ message: 'Token con propósito incorrecto' });
    }

    const usuario = await Usuario.findByPk(payload.sub);
    if (!usuario) {
      console.log('[verifyEmail] Usuario no existe id =', payload.sub);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (usuario.verificado) {
      return res.json({ message: 'La cuenta ya estaba verificada.' });
    }

    await usuario.update({ verificado: true });
    console.log('[verifyEmail] Usuario verificado id =', usuario.id);

    return res.json({ message: 'Cuenta verificada. Ya puedes iniciar sesión.' });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Error interno' });
  }
};

// POST /api/usuario/resend-verification
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email requerido' });

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (usuario.verificado) {
      return res.status(400).json({ message: 'La cuenta ya está verificada' });
    }

    const verificationToken = jwt.sign(
      { sub: usuario.id, purpose: 'email-verify' },
      EMAIL_VERIFY_SECRET,
      { expiresIn: EMAIL_VERIFY_EXP }
    );

    const verifyLink = `${APP_URL}/verificar?token=${verificationToken}`;
    console.log('[resendVerification] verifyLink =', verifyLink);

    const subject = 'Nuevo enlace de verificación';
    const html = `
      <p>Hola <b>${usuario.nombre}</b>, aquí tienes un nuevo enlace:</p>
      <p><a href="${verifyLink}" target="_blank" rel="noopener noreferrer">Verificar cuenta</a></p>
      <p>Expira en ${EMAIL_VERIFY_EXP}.</p>
    `;

    sendEmail(email, subject, html)
      .then(() => console.log('[Email] Reenvío verificación a', email))
      .catch(e => console.error('[Reenvío verificación error]', e.message));

    return res.json({ message: 'Correo de verificación reenviado.' });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Error interno' });
  }
};

// POST /api/usuario/login
exports.loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y password son requeridos' });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (!usuario.verificado) {
      return res.status(403).json({ message: 'Debes confirmar tu cuenta antes de iniciar sesión.' });
    }

    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const authToken = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        admin: usuario.admin,
        repartidor: usuario.repartidor
      },
      LOGIN_SECRET,
      { expiresIn: LOGIN_EXP }
    );

    return res.json({
      message: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        admin: usuario.admin,
        repartidor: usuario.repartidor,
        verificado: usuario.verificado
      },
      token: authToken
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Error interno' });
  }
};

// PUT /api/usuario/:id
exports.updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    if ('admin' in req.body) {
      delete req.body.admin;
    }

    await usuario.update(req.body);
    return res.json({
      message: 'Usuario actualizado exitosamente',
      usuario: toPublicUser(usuario)
    });
  } catch (err) {
    return res.status(400).json({ message: err.message || 'Error al actualizar usuario' });
  }
};

// DELETE /api/usuario/:id
exports.deleteUsuario = async (_req, res) => {
  return res.status(501).json({ message: 'Funcionalidad no implementada' });
};