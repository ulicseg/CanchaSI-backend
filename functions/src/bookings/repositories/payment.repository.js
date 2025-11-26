import { db } from '../../config/firebase.js';

export const getHoldById = async (holdId) => {
  const doc = await db.collection('holds').doc(holdId).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};

export const getFieldById = async (fieldId) => {
  const doc = await db.collection('fields').doc(fieldId).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};

export const getComplexById = async (complexId) => {
  const doc = await db.collection('complexes').doc(complexId).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};

export const createBooking = async (bookingData) => {
  const bookingRef = await db.collection('bookings').add(bookingData);
  const bookingDoc = await bookingRef.get();
  return { id: bookingDoc.id, ...bookingDoc.data() };
};

export const deleteHold = async (holdId) => {
  await db.collection('holds').doc(holdId).delete();
};