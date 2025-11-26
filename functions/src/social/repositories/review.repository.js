import { db } from '../../config/firebase.js';

// Guardar una nueva review
export async function createReview(data) {
  const docRef = await db.collection('reviews').add(data);
  return { id: docRef.id, ...data };
}

// Obtener todas las reviews de un complejo
export async function getReviewsByComplex(complexId) {
  const snapshot = await db.collection('reviews')
    .where('complexId', '==', complexId)
    .orderBy('createdAt', 'desc') // Las más nuevas primero
    .get();

  const reviews = [];
  snapshot.forEach(doc => {
    reviews.push({ id: doc.id, ...doc.data() });
  });
  
  return reviews;
}

// (Extra) Verificar si el usuario ya calificó este complejo (para evitar spam)
export async function getUserReviewForComplex(userId, complexId) {
  const snapshot = await db.collection('reviews')
    .where('userId', '==', userId)
    .where('complexId', '==', complexId)
    .limit(1)
    .get();
    
  return snapshot.empty ? null : snapshot.docs[0].data();
}
