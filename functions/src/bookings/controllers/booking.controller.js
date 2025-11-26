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