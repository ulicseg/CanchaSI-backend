import express from 'express';
import { verifyToken } from '../../shared/middlewares/auth.middleware.js';
import { cancelBooking, getBookingById, getMyBookings } from '../controllers/booking.controller.js';

const router = express.Router();

// GET /bookings/my - Obtener mis reservas
router.get('/my', verifyToken, getMyBookings);

// GET /bookings/:id - Obtener detalle de una reserva
router.get('/:id', verifyToken, getBookingById);

// DELETE /bookings/:id - Cancelar reserva
router.delete('/:id', verifyToken, cancelBooking);

export default router;