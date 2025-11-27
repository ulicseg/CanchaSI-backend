import * as availabilityRepository from '../repositories/availability.repository.js';

export const getFieldAvailability = async (fieldId, date, time = null) => {
  // 1. Obtener información del field y su complejo
  const field = await availabilityRepository.getFieldById(fieldId);
  if (!field) {
    throw new Error('Field not found');
  }

  const complex = await availabilityRepository.getComplexById(field.complexId);
  if (!complex) {
    throw new Error('Complex not found');
  }

  // 2. Generar todos los slots del día basados en openHour y closeHour
  let allSlots = generateTimeSlots(complex.openHour, complex.closeHour, date);

  // Si se especifica una hora, filtrar solo esa hora
  if (time) {
    if (!allSlots.includes(time)) {
      // Si la hora solicitada no está dentro del horario de apertura
      allSlots = [time];
    } else {
      allSlots = [time];
    }
  }

  // 3. Obtener reservas y holds existentes para ese día
  const bookings = await availabilityRepository.getBookingsByFieldAndDate(fieldId, date);
  const holds = await availabilityRepository.getActiveHoldsByFieldAndDate(fieldId, date);

  // 4. Marcar slots como ocupados
  const occupiedTimes = new Set();

  bookings.forEach(booking => {
    occupiedTimes.add(booking.time);
  });

  holds.forEach(hold => {
    occupiedTimes.add(hold.time);
  });

  // 5. Retornar slots con estado de disponibilidad
  const availableSlots = allSlots.map(slot => {
    // Verificar si está dentro del horario de apertura si se pidió una hora específica fuera de rango
    const hour = parseInt(slot.split(':')[0]);
    const isOpen = hour >= complex.openHour && hour < complex.closeHour;

    return {
      time: slot,
      available: isOpen && !occupiedTimes.has(slot),
      price: field.pricePerHour,
      reason: !isOpen ? 'Closed' : (occupiedTimes.has(slot) ? 'Occupied' : 'Available')
    };
  });

  return {
    fieldId,
    fieldName: field.name,
    complexName: complex.name,
    date,
    slots: availableSlots
  };
};

// Generar slots de 1 hora entre openHour y closeHour
function generateTimeSlots(openHour, closeHour, date) {
  const slots = [];
  for (let hour = openHour; hour < closeHour; hour++) {
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    slots.push(timeStr);
  }
  return slots;
}