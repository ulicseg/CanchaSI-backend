import express from 'express';
import { verifyToken } from '../../shared/middlewares/auth.middleware.js';
import { cancelBookingAsOwner, createManualBooking } from '../controllers/owner.controller.js';

const router = express.Router();

// POST /owner/bookings/manual - Crear reserva manual (dueño)
router.post('/bookings/manual', verifyToken, createManualBooking);

// POST /owner/bookings/:id/cancel - Cancelar reserva como dueño
router.post('/bookings/:id/cancel', verifyToken, cancelBookingAsOwner);

export default router;