import { Router } from 'express';
import { createProject } from '../controllers/projectController.js';
import { verifyAdmin } from '../middlewares/authmiddleware.js';
import { verifyToken } from '../middlewares/authmiddleware.js';
import {getProject} from '../controllers/projectController.js';
import { joinProject } from '../controllers/projectController.js';
const router = Router()

router.post('/proyectos',verifyAdmin,createProject)
router.get('/proyectos', getProject)
router.post('/proyectos/unirse',verifyToken, joinProject)

export default router;

