import { db } from '../../config/firebase.js';

export const findComplexes = async ({ ownerId, name, limit = 50 }) => {
  let query = db.collection('complexes');
  
  if (ownerId) {
    query = query.where('ownerId', '==', ownerId);
  }
  
  if (name) {
    query = query.where('name', '>=', name).where('name', '<=', name + '\uf8ff');
  }
  
  query = query.limit(parseInt(limit, 10));
  
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const findComplexById = async (id) => {
  const doc = await db.collection('complexes').doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};
