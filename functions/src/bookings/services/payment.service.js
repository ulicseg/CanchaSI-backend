import * as paymentRepository from '../repositories/payment.repository.js';

export const createBookingFromHold = async (holdId) => {
  // 1. Buscar el hold
  const hold = await paymentRepository.getHoldById(holdId);
  
  if (!hold) {
    throw new Error('Hold not found');
  }

  // 2. Verificar que no haya expirado
  const now = new Date();
  const expiresAt = hold.expiresAt?.toDate ? hold.expiresAt.toDate() : new Date(hold.expiresAt);
  
  if (expiresAt < now) {
    throw new Error('Hold has expired');
  }

  // 3. Obtener información de la cancha y complejo
  const field = await paymentRepository.getFieldById(hold.fieldId);
  if (!field) {
    throw new Error('Field not found');
  }

  const complex = await paymentRepository.getComplexById(field.complexId);
  if (!complex) {
    throw new Error('Complex not found');
  }

  // 4. Calcular monto (precio por hora)
  const amount = field.pricePerHour || 5000;

  // 5. Crear la reserva (booking)
  const bookingData = {
    userId: hold.userId,
    fieldId: hold.fieldId,
    complexId: field.complexId,
    date: hold.date,
    time: hold.time,
    status: 'confirmed', // ✅ Confirmado directamente (simulación)
    amount: amount,
    paymentMethod: 'mercadopago_simulation',
    createdAt: new Date(),
    confirmedAt: new Date()
  };

  const booking = await paymentRepository.createBooking(bookingData);

  // 6. Eliminar el hold
  await paymentRepository.deleteHold(holdId);

  return {
    bookingId: booking.id,
    booking: booking
  };
};