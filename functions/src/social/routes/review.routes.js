import { Router } from 'express';
import { createReview, getReviews } from '../controllers/review.controller.js';
import { verifyToken } from '../../shared/middlewares/auth.middleware.js';

const router = Router();

// POST: Crear review (Requiere login)
router.post('/', verifyToken, createReview);

// GET: Ver reviews (También le ponemos login por consistencia, aunque podría ser público)
router.get('/:complexId', verifyToken, getReviews);

export default router;
