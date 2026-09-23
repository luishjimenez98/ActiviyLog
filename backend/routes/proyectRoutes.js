import { Router } from 'express';
import { createProyect } from '../controllers/proyectController.js';
import { verifyAdmin } from '../middlewares/authmiddleware.js';


const router = Router()

router.post('/proyectos',verifyAdmin,createProyect)


export default router;

