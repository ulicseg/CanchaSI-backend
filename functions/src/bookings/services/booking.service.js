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