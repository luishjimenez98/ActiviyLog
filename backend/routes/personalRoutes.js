import { Router } from 'express';
import { createPersonal } from '../controllers/personalController.js';
import { verifyAdmin } from '../middlewares/authmiddleware.js';

const router = Router();

// Ruta exclusiva de Administrador para crear usuarios
router.post('/personal', verifyAdmin, createPersonal);

export default router;