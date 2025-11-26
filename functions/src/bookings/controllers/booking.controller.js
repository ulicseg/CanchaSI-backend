import * as bookingService from '../services/booking.service.js';

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { status, limit = 50 } = req.query;

    const bookings = await bookingService.getUserBookings(userId, { status, limit: parseInt(limit) });

    return res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error getting user bookings:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const booking = await bookingService.getBookingById(id, userId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error getting booking:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// cancelar reserva

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const result = await bookingService.cancelBooking(id, userId);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error canceling booking:', error);
    
    // Errores específicos con códigos HTTP apropiados
    if (error.message === 'Booking not found') {
      return res.status(404).json({ success: false, error: error.message });
    }
    if (error.message === 'Unauthorized access to booking' || error.message === 'Cannot cancel booking of another user') {
      return res.status(403).json({ success: false, error: error.message });
    }
    if (error.message === 'Booking is already cancelled' || error.message.includes('Cannot cancel')) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};