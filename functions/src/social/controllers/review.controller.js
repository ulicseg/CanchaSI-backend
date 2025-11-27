import * as reviewService from '../services/review.service.js';

// POST /reviews
export async function createReview(req, res) {
  try {
    const uid = req.user.uid;
    const { complexId, rating, comment } = req.body;

    if (!complexId || !rating) {
      return res.status(400).json({ error: 'Faltan datos (complexId, rating).' });
    }

    const result = await reviewService.addReview(uid, { complexId, rating, comment });
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

// GET /reviews/:complexId
export async function getReviews(req, res) {
  try {
    const { complexId } = req.params;
    const reviews = await reviewService.getComplexReviews(complexId);
    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
