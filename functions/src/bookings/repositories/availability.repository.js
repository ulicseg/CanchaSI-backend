import { db } from '../../config/firebase.js';

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

export const getBookingsByFieldAndDate = async (fieldId, date) => {
  const snapshot = await db.collection('bookings')
    .where('fieldId', '==', fieldId)
    .where('date', '==', date)
    .where('status', 'in', ['confirmed', 'pending'])
    .get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getActiveHoldsByFieldAndDate = async (fieldId, date) => {
  const now = new Date();
  
  const snapshot = await db.collection('holds')
    .where('fieldId', '==', fieldId)
    .where('date', '==', date)
    .get();
  
  // Filtrar holds que no hayan expirado
  const activeHolds = [];
  snapshot.docs.forEach(doc => {
    const holdData = doc.data();
    const expiresAt = holdData.expiresAt?.toDate();
    if (expiresAt && expiresAt > now) {
      activeHolds.push({ id: doc.id, ...holdData });
    }
  });
  
  return activeHolds;
};