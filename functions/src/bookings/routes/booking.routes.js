import express from 'express';
import { getMyBookings, getBookingById } from '../controllers/booking.controller.js';
import { verifyToken } from '../../shared/middlewares/auth.middleware.js';

const router = express.Router();

// GET /bookings/my - Obtener mis reservas
router.get('/my', verifyToken, getMyBookings);

// GET /bookings/:id - Obtener detalle de una reserva
router.get('/:id', verifyToken, getBookingById);

export default router;