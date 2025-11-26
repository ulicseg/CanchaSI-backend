import { db } from '../../config/firebase.js';

// Guarda una nueva solicitud de búsqueda en Firestore
export async function createMatchRequest(data) {
  const docRef = await db.collection('matchmaking').add(data);
  return { id: docRef.id, ...data };
}

// Obtiene todas las búsquedas activas (Feed)
export async function getActiveMatches() {
  const snapshot = await db.collection('matchmaking')
    .where('status', '==', 'OPEN')
    .orderBy('createdAt', 'desc')
    .get();

  const matches = [];
  snapshot.forEach(doc => {
    matches.push({ id: doc.id, ...doc.data() });
  });

  return matches;
}

// Buscar un partido por ID
export async function getMatchById(matchId) {
  const doc = await db.collection('matchmaking').doc(matchId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

// Guardar la postulación en la sub-colección 'applicants'
export async function addApplicant(matchId, userId) {
  await db.collection('matchmaking').doc(matchId)
    .collection('applicants')
    .doc(userId)
    .set({
      userId: userId,
      status: 'pending',
      appliedAt: new Date()
    });
    
  return { matchId, userId, status: 'pending' };
}
