import { Router } from 'express';
import { 
  createMatch, 
  getMatchFeed, 
  applyToMatch, 
  getApplicants, 
  acceptPlayer, 
  rejectPlayer 
} from '../controllers/matchmaking.controller.js';
import { verifyToken } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

router.post('/create', verifyToken, createMatch);
router.get('/feed', verifyToken, getMatchFeed);

// Postularse a un partido
router.post('/:id/apply', verifyToken, applyToMatch);

// --- NUEVAS RUTAS ---

// 1. Ver postulantes (Solo dueño)
router.get('/:id/applicants', verifyToken, getApplicants);

// 2. Aceptar jugador (Necesitamos ID partido y ID postulante)
router.put('/applicant/:matchId/:applicantId/accept', verifyToken, acceptPlayer);

// 3. Rechazar jugador
router.put('/applicant/:matchId/:applicantId/reject', verifyToken, rejectPlayer);

export default router;
