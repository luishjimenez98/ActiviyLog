import { Router } from 'express';
import { createProject } from '../controllers/projectController.js';
import { verifyAdmin } from '../middlewares/authmiddleware.js';


const router = Router()

router.post('/proyectos',verifyAdmin,createProject)


export default router;

