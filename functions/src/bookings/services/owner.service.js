import * as ownerRepository from '../repositories/owner.repository.js';

export const createManualBooking = async (bookingData) => {
  const { ownerId, fieldId, date, time, customerName, customerPhone, customerEmail, notes } = bookingData;

  // 1. Obtener información de la cancha
  const field = await ownerRepository.getFieldById(fieldId);
  if (!field) {
    throw new Error('Field not found');
  }

  // 2. Obtener información del complejo
  const complex = await ownerRepository.getComplexById(field.complexId);
  if (!complex) {
    throw new Error('Complex not found');
  }

  // 3. Verificar que el usuario sea dueño del complejo
  if (complex.ownerId !== ownerId) {
    throw new Error('You are not the owner of this complex');
  }

  // 4. Verificar disponibilidad del horario
  const isAvailable = await ownerRepository.checkSlotAvailability(fieldId, date, time);
  if (!isAvailable) {
    throw new Error(`The slot ${date} at ${time} is not available`);
  }

  // 5. Crear la reserva manual
  const now = new Date();
  const booking = {
    fieldId,
    complexId: field.complexId,
    date,
    time,
    status: 'confirmed',
    bookingType: 'manual',
    createdBy: ownerId,
    customerInfo: {
      name: customerName,
      phone: customerPhone || null,
      email: customerEmail || null
    },
    notes: notes || null,
    amount: field.pricePerHour || 0,
    paymentMethod: 'manual',
    createdAt: now,
    confirmedAt: now
  };

  const createdBooking = await ownerRepository.createBooking(booking);

  return {
    id: createdBooking.id,
    ...createdBooking,
    field: {
      id: field.id,
      name: field.name,
      sport: field.sport
    },
    complex: {
      id: complex.id,
      name: complex.name
    }
  };
};

export const cancelBookingAsOwner = async (bookingId, ownerId, reason) => {
  // 1. Obtener el booking
  const booking = await ownerRepository.getBookingById(bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  // 2. Verificar que no esté ya cancelado
  if (booking.status === 'cancelled') {
    throw new Error('Booking is already cancelled');
  }

  // 3. Obtener la cancha y complejo
  const field = await ownerRepository.getFieldById(booking.fieldId);
  const complex = field ? await ownerRepository.getComplexById(field.complexId) : null;

  if (!complex) {
    throw new Error('Complex not found');
  }

  // 4. Verificar que sea el dueño del complejo
  if (complex.ownerId !== ownerId) {
    throw new Error('You are not the owner of this complex');
  }

  // 5. Cancelar la reserva (sin política de reembolso, el dueño decide)
  const now = new Date();
  const updatedBooking = await ownerRepository.updateBooking(bookingId, {
    status: 'cancelled',
    cancelledAt: now,
    cancelledBy: ownerId,
    cancellationReason: reason || 'Cancelled by owner',
    refundPercentage: 100,
    refundAmount: booking.amount,
    refundPolicy: 'Cancelled by complex owner - Full refund'
  });

  return {
    bookingId: updatedBooking.id,
    status: 'cancelled',
    message: 'Booking cancelled successfully by owner',
    refundAmount: booking.amount,
    reason: reason || 'Cancelled by owner'
  };
};