import { db } from '../../config/firebase.js';

// Guarda una nueva solicitud de búsqueda en Firestore
export async function createMatchRequest(data) {
  const docRef = await db.collection('matchmaking').add(data);
  return { id: docRef.id, ...data };
}
