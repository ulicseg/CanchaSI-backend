import * as reviewRepo from '../repositories/review.repository.js';

export async function addReview(userId, reviewData) {
  // 1. Validar estrellas
  const rating = Number(reviewData.rating);
  if (rating < 1 || rating > 5) {
    throw new Error('La calificación debe ser entre 1 y 5 estrellas.');
  }

  // 2. (Opcional) Verificar si ya calificó antes
  const existingReview = await reviewRepo.getUserReviewForComplex(userId, reviewData.complexId);
  if (existingReview) {
    throw new Error('Ya has calificado este complejo anteriormente.');
  }

  // 3. Preparar objeto
  const newReview = {
    userId: userId,
    complexId: reviewData.complexId,
    rating: rating,
    comment: reviewData.comment || '',
    createdAt: new Date()
  };

  // 4. Guardar
  return await reviewRepo.createReview(newReview);
}

export async function getComplexReviews(complexId) {
  return await reviewRepo.getReviewsByComplex(complexId);
}
