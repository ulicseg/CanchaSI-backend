import { Router } from 'express';
import { createMatch } from '../controllers/matchmaking.controller.js';
import { verifyToken } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

// Solo usuarios logueados pueden crear búsquedas
router.post('/create', verifyToken, createMatch);

export default router;
