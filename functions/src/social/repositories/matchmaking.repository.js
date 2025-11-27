import { db } from '../../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';

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

/**
 * Obtiene la lista de postulantes de un partido específico.
 */
export async function getApplicants(matchId) {
  const snapshot = await db.collection('matchmaking').doc(matchId)
    .collection('applicants').get();
    
  const list = [];
  snapshot.forEach(doc => {
    list.push(doc.data());
  });
  return list;
}

/**
 * Actualiza el estado de un postulante (aceptado/rechazado).
 */
export async function updateApplicantStatus(matchId, applicantId, newStatus) {
  await db.collection('matchmaking').doc(matchId)
    .collection('applicants').doc(applicantId)
    .update({ status: newStatus });
}

/**
 * Resta 1 a la cantidad de jugadores faltantes.
 * Usamos FieldValue.increment(-1) para evitar errores si dos personas aceptan a la vez.
 */
export async function decrementMissingPlayers(matchId) {
  await db.collection('matchmaking').doc(matchId).update({
    missingPlayers: FieldValue.increment(-1)
  });
}
