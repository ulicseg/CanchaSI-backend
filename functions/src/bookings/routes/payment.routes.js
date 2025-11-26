import express from 'express';
import { createPreference } from '../controllers/payment.controller.js';
import { verifyToken } from '../../shared/middlewares/auth.middleware.js';

const router = express.Router();

// POST /mp/create-preference - Crear preferencia de pago (simulado)
router.post('/create-preference', verifyToken, createPreference);

export default router;