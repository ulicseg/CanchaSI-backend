import * as paymentService from '../services/payment.service.js';

export const createPreference = async (req, res) => {
  try {
    const { holdId } = req.body;

    if (!holdId) {
      return res.status(400).json({ 
        success: false, 
        error: 'holdId is required' 
      });
    }

    // Crear la reserva (simulación de pago exitoso)
    const result = await paymentService.createBookingFromHold(holdId);

    return res.status(200).json({ 
      success: true, 
      data: {
        bookingId: result.bookingId,
        initPoint: 'https://www.mercadopago.com.ar',
        message: 'Reserva confirmada (simulación - no se procesó pago real)'
      }
    });
  } catch (error) {
    console.error('Error creating preference:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};