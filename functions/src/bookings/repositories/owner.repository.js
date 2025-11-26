import { db } from '../../config/firebase.js';

export const getFieldById = async (fieldId) => {
  const doc = await db.collection('fields').doc(fieldId).get();
  
  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data()
  };
};

export const getComplexById = async (complexId) => {
  const doc = await db.collection('complexes').doc(complexId).get();
  
  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data()
  };
};

export const checkSlotAvailability = async (fieldId, date, time) => {
  // Verificar si ya existe un booking confirmado o hold activo para ese slot
  const bookingsSnapshot = await db.collection('bookings')
    .where('fieldId', '==', fieldId)
    .where('date', '==', date)
    .where('time', '==', time)
    .where('status', 'in', ['confirmed', 'pending'])
    .get();

  if (!bookingsSnapshot.empty) {
    return false; // Ya hay una reserva
  }

  // Verificar holds activos (no expirados)
  const now = new Date();
  const holdsSnapshot = await db.collection('holds')
    .where('fieldId', '==', fieldId)
    .where('date', '==', date)
    .where('time', '==', time)
    .get();

  // Filtrar holds no expirados
  const activeHolds = holdsSnapshot.docs.filter(doc => {
    const holdData = doc.data();
    const expiresAt = holdData.expiresAt?.toDate ? holdData.expiresAt.toDate() : new Date(holdData.expiresAt);
    return expiresAt > now;
  });

  if (activeHolds.length > 0) {
    return false; // Hay un hold activo
  }

  return true; // Disponible
};

export const createBooking = async (bookingData) => {
  const bookingRef = await db.collection('bookings').add(bookingData);
  const bookingDoc = await bookingRef.get();
  return {
    id: bookingDoc.id,
    ...bookingDoc.data()
  };
};

export const getBookingById = async (bookingId) => {
  const doc = await db.collection('bookings').doc(bookingId).get();
  
  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data()
  };
};

export const updateBooking = async (bookingId, updateData) => {
  await db.collection('bookings').doc(bookingId).update(updateData);
  
  const updatedDoc = await db.collection('bookings').doc(bookingId).get();
  return {
    id: updatedDoc.id,
    ...updatedDoc.data()
  };
};