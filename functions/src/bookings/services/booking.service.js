import * as bookingRepository from '../repositories/booking.repository.js';

export const getUserBookings = async (userId, options = {}) => {
  const { status, limit = 50 } = options;

  // Obtener bookings del usuario
  const bookings = await bookingRepository.getBookingsByUserId(userId, { status, limit });

  // Enriquecer con datos de complejo y cancha
  const enrichedBookings = await Promise.all(
    bookings.map(async (booking) => {
      const field = await bookingRepository.getFieldById(booking.fieldId);
      const complex = field ? await bookingRepository.getComplexById(field.complexId) : null;

      return {
        ...booking,
        field: field ? {
          id: field.id,
          name: field.name,
          sport: field.sport,
          pricePerHour: field.pricePerHour
        } : null,
        complex: complex ? {
          id: complex.id,
          name: complex.name,
          address: complex.address,
          phone: complex.phone
        } : null
      };
    })
  );

  return enrichedBookings;
};

export const getBookingById = async (bookingId, userId) => {
  const booking = await bookingRepository.getBookingById(bookingId);

  if (!booking) {
    return null;
  }

  // Verificar que el booking pertenece al usuario
  if (booking.userId !== userId) {
    throw new Error('Unauthorized access to booking');
  }

  // Enriquecer con datos de complejo y cancha
  const field = await bookingRepository.getFieldById(booking.fieldId);
  const complex = field ? await bookingRepository.getComplexById(field.complexId) : null;

  return {
    ...booking,
    field: field ? {
      id: field.id,
      name: field.name,
      sport: field.sport,
      pricePerHour: field.pricePerHour,
      features: field.features
    } : null,
    complex: complex ? {
      id: complex.id,
      name: complex.name,
      address: complex.address,
      phone: complex.phone,
      geo: complex.geo
    } : null
  };
};

// cancelar reserva

export const cancelBooking = async (bookingId, userId) => {
  // 1. Obtener el booking
  const booking = await bookingRepository.getBookingById(bookingId);

  if (!booking) {
    throw new Error('Booking not found');
  }

  // 2. Verificar que pertenece al usuario
  if (booking.userId !== userId) {
    throw new Error('Cannot cancel booking of another user');
  }

  // 3. Verificar que no esté ya cancelado
  if (booking.status === 'cancelled') {
    throw new Error('Booking is already cancelled');
  }

  // 4. Verificar que esté confirmado (no se puede cancelar si no está confirmado)
  if (booking.status !== 'confirmed') {
    throw new Error('Cannot cancel booking with status: ' + booking.status);
  }

  // 5. Calcular tiempo restante hasta la reserva
  const now = new Date();
  const bookingDateTime = new Date(`${booking.date}T${booking.time}:00`);
  const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);

  // 6. Determinar reembolso según política
  let refundPercentage = 0;
  let refundAmount = 0;
  let refundPolicy = '';

  if (hoursUntilBooking >= 2) {
    // Más de 2 horas: 50% de reembolso
    refundPercentage = 50;
    refundAmount = booking.amount * 0.5;
    refundPolicy = 'Cancelación con más de 2 horas de anticipación: 50% de reembolso';
  } else if (hoursUntilBooking > 0) {
    // Menos de 2 horas pero aún no pasó: sin reembolso
    refundPercentage = 0;
    refundAmount = 0;
    refundPolicy = 'Cancelación con menos de 2 horas de anticipación: sin reembolso';
  } else {
    // Ya pasó la hora de la reserva
    throw new Error('Cannot cancel booking: reservation time has passed');
  }

  // 7. Actualizar el booking
  const cancelledBooking = await bookingRepository.updateBooking(bookingId, {
    status: 'cancelled',
    cancelledAt: now,
    refundPercentage,
    refundAmount,
    refundPolicy
  });

  // 8. Devolver resultado
  return {
    bookingId: cancelledBooking.id,
    status: 'cancelled',
    originalAmount: booking.amount,
    refundPercentage,
    refundAmount,
    refundPolicy,
    message: `Reserva cancelada. Reembolso: $${refundAmount} (${refundPercentage}%)`
  };
};