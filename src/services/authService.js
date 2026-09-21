import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import pg from 'pg';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
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

//Health Check
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
        const query = `
            SELECT Id_personal, Nombre, Apellido_paterno, Admin, Email, Constrasena
            FROM personal
            WHERE correo = $1;
        `;
        const resultado = await pool.query(query, [correo]);

        if (resultado.rows.length === 0) {
            return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
        }

        const personal = resultado.rows[0];
        if (personal.password !== passwordHash) {
            return res.status(401).json({ error: 'Email o contraseña incorrectos.' });
        }

        const { password: _, ...usuarioInfo } = personal;

        // Firmar JWT Token
        const token = jwt.sign(
            { Id_personal: usuarioInfo.Id_personal, Email: usuarioInfo.Email, Admin: usuarioInfo.Admin },
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

