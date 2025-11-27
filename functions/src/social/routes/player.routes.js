import { Router } from 'express';
import { authPlayer, getProfile } from '../controllers/player.controller.js';
import { updateProfile } from '../controllers/player.controller.js';
// Importamos el middleware que hiciste (asegurate que la ruta sea correcta)
import { verifyToken } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

// Aplicamos el middleware "verifyToken" a todas las rutas de este archivo
// Así nos aseguramos que nadie entre sin estar logueado en Firebase.
router.post('/auth', verifyToken, authPlayer);
router.get('/me', verifyToken, getProfile);
router.put('/me', verifyToken, updateProfile);

export default router;
