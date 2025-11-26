import express from 'express';
import { verifyToken } from '../../shared/middlewares/auth.middleware.js';
import { getAvailability } from '../controllers/availability.controller.js';

const router = express.Router();

// GET /availability/:fieldId?date=YYYY-MM-DD (requiere autenticación)
router.get('/:fieldId', verifyToken, getAvailability);

export default router;