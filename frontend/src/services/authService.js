import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro';

// Configuración del Pool para MariaDB / MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'itecor_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Health Check
app.get('/health', (req, res) => {
  res.json({ service: 'Auth Service', status: 'ONLINE', port: process.env.PORT || 3001 });
});

// Login pantalla principal
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
  }

  try {
    const passwordHash = hashPassword(password);

    // Consulta adaptada a MariaDB / MySQL
    const query = `
      SELECT Id_personal, Nombre, Apellido_paterno, Admin, Email, Constrasena
      FROM personal
      WHERE Email = ?;
    `;
    const [rows] = await pool.query(query, [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
    }

    const personal = rows[0];

    // Validación del hash de contraseña
    if (personal.Constrasena !== passwordHash) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
    }

    // Excluir la contraseña de la respuesta
    const { Constrasena, ...usuarioInfo } = personal;

    // Firmar JWT Token
    const token = jwt.sign(
      { 
        Id_personal: usuarioInfo.Id_personal, 
        Email: usuarioInfo.Email, 
        Admin: usuarioInfo.Admin 
      },
      JWT_SECRET,
      { expiresIn: '62h' }
    );

    res.json({
      ...usuarioInfo,
      token
    });
  } catch (error) {
    console.error('Error en Auth Service (Login):', error);
    res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[AUTH SERVICE] Corriendo en puerto http://localhost:${PORT}`);
});