import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const login = async (req, res) => {
  const { Email, Contrasena } = req.body;

  if (!Email || !Contrasena) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT Id_personal, Nombre, Apellido_paterno, Admin, Email, Contrasena FROM personal WHERE Email = ?',
      [Email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const usuario = rows[0];

    const passwordValida = await bcrypt.compare(Contrasena, usuario.Contrasena);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    // Separar la contraseña del resto de los datos
    const { Constrasena, ...usuarioPayload } = usuario;

    // AQUÍ VA EL BLOQUE:
    const isAdmin = Boolean(usuario.Admin);

    const token = jwt.sign(
      { 
        id: usuario.Id_personal, 
        email: usuario.Email, 
        admin: isAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: '62h' }
    );

    return res.json({
      user: {
        ...usuarioPayload,
        Admin: isAdmin
      },
      token
    });

  } catch (error) {
    console.error('Error en Login:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Crear un nuevo usuario (Solo Admin)
export const createUser = async (req, res) => {
  const { Nombre, Apellido_paterno, Apellido_materno,Telefono,Admin,Email, Constrasena } = req.body;

  if (!Nombre || !Apellido_paterno || !Email || !Constrasena) {
    return res.status(400).json({ error: 'Los campos obligatorios deben ser completados.' });
  }

  try {
    // 1. Verificar si el email ya existe
    const [existingUser] = await pool.query(
      'SELECT Id_personal FROM personal WHERE Email = ?',
      [Email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // 2. Encriptar la contraseña con bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(Constrasena, saltRounds);

    // 3. Insertar el nuevo usuario en la base de datos
    // Aseguramos que Admin sea 1 o 0
    const isAdmin = Admin ? 1 : 0;

    const [result] = await pool.query(
      'INSERT INTO personal (Id_personal,Nombre, Apellido_paterno,Apellido_materno, Telefono,Admin,Email, Contrasena) VALUES (?,?, ?, ?, ?, ?,?,?)',
      [null,Nombre, Apellido_paterno, Apellido_materno,Telefono,isAdmin,Email, passwordHash]
    );

    return res.status(201).json({
      message: 'Usuario creado exitosamente.',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    return res.status(500).json({ error: 'Error al registrar el usuario en la base de datos.' });
  }
};