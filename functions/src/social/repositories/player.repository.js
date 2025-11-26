import { db } from '../../config/firebase.js';

/**
 * Guarda o actualiza los datos de un jugador en Firestore.
 * Usamos { merge: true } para no borrar datos que ya existan si solo actualizamos uno.
 */
export async function savePlayer(uid, data) {
  await db.collection('users').doc(uid).set(data, { merge: true });
  return { uid, ...data }; // Devolvemos el objeto completo para confirmar
}

/**
 * Busca un jugador por su ID (para ver el perfil después).
 */
export async function getPlayerById(uid) {
  const doc = await db.collection('users').doc(uid).get();
  if (!doc.exists) {
    return null;
  }
  return { uid: doc.id, ...doc.data() };
}

