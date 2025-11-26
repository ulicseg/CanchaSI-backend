import { Router } from 'express';
import { createMatch, getMatchFeed } from '../controllers/matchmaking.controller.js';
import { verifyToken } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

router.post('/create', verifyToken, createMatch);

// Ver el feed de partidos disponibles
router.get('/feed', verifyToken, getMatchFeed);

export default router;
