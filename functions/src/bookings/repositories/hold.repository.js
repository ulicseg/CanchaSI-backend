import { db } from '../../config/firebase.js';

export const createHold = async (holdData) => {
  const holdRef = await db.collection('holds').add(holdData);
  const holdDoc = await holdRef.get();
  return { id: holdDoc.id, ...holdDoc.data() };
};
