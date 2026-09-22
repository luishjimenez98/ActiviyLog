import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { login, createUser } from './controllers/authController.js';
import { verifyToken, verifyAdmin } from './middlewares/authmiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ONLINE' }));
app.post('/auth/login', login);


// Retorna los datos del usuario autenticado según su token
app.get('/auth/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Ruta exclusiva de Administrador para crear usuarios
app.post('/admin/users', verifyAdmin, createUser);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});