import { Router } from 'express';
import { createMatch, getMatchFeed, applyToMatch } from '../controllers/matchmaking.controller.js';
import { verifyToken } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

router.post('/create', verifyToken, createMatch);
router.get('/feed', verifyToken, getMatchFeed);

// Postularse a un partido
router.post('/:id/apply', verifyToken, applyToMatch);

export default router;
