import { db } from '../../config/firebase.js';

export const getBookingsByUserId = async (userId, options = {}) => {
  const { status, limit = 50 } = options;

  // Query simple sin orderBy para evitar necesidad de índices
  let query = db.collection('bookings')
    .where('userId', '==', userId)
    .limit(limit);

  const snapshot = await query.get();
  
  let bookings = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Filtrar por status en memoria si se especifica
  if (status) {
    bookings = bookings.filter(b => b.status === status);
  }

  // Ordenar en memoria por createdAt (más recientes primero)
  bookings.sort((a, b) => {
    const dateA = a.createdAt?._seconds || 0;
    const dateB = b.createdAt?._seconds || 0;
    return dateB - dateA;
  });

  return bookings;
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