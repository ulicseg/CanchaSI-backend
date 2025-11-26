import * as ownerService from '../services/owner.service.js';

export const createManualBooking = async (req, res) => {
  try {
    const ownerId = req.user.uid;
    const { fieldId, date, time, customerName, customerPhone, customerEmail, notes } = req.body;

    // Validar campos requeridos
    if (!fieldId || !date || !time || !customerName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: fieldId, date, time, customerName'
      });
    }

    const booking = await ownerService.createManualBooking({
      ownerId,
      fieldId,
      date,
      time,
      customerName,
      customerPhone,
      customerEmail,
      notes
    });

    return res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error creating manual booking:', error);

    if (error.message === 'Field not found' || error.message === 'Complex not found') {
      return res.status(404).json({ success: false, error: error.message });
    }
    if (error.message === 'You are not the owner of this complex') {
      return res.status(403).json({ success: false, error: error.message });
    }
    if (error.message.includes('slot is not available')) {
      return res.status(409).json({ success: false, error: error.message });
    }

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const cancelBookingAsOwner = async (req, res) => {
  try {
    const ownerId = req.user.uid;
    const { id } = req.params;
    const { reason } = req.body;

    const result = await ownerService.cancelBookingAsOwner(id, ownerId, reason);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error canceling booking as owner:', error);

    if (error.message === 'Booking not found') {
      return res.status(404).json({ success: false, error: error.message });
    }
    if (error.message === 'You are not the owner of this complex') {
      return res.status(403).json({ success: false, error: error.message });
    }
    if (error.message === 'Booking is already cancelled') {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

//republicar horarios duenio
export const relistSlot = async (req, res) => {
  try {
    const ownerId = req.user.uid;
    const { bookingId } = req.body;

    // Validar campos requeridos
    if (!bookingId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: bookingId'
      });
    }

    const result = await ownerService.relistSlot(bookingId, ownerId);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error relisting slot:', error);

    if (error.message === 'Booking not found') {
      return res.status(404).json({ success: false, error: error.message });
    }
    if (error.message === 'You are not the owner of this complex') {
      return res.status(403).json({ success: false, error: error.message });
    }
    if (error.message === 'Only cancelled bookings can be relisted') {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};