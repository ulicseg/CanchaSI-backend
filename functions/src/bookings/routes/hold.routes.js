import express from 'express';
import { verifyToken } from '../../shared/middlewares/auth.middleware.js';
import { createHold } from '../controllers/hold.controller.js';

const router = express.Router();

// POST /bookings/hold - Crear hold temporal (requiere autenticación)
router.post('/hold', verifyToken, createHold);

export default router;
