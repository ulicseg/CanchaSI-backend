import express from 'express';
import { verifyToken } from '../../shared/middlewares/auth.middleware.js';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favorites.controller.js';

const router = express.Router();

// POST /favorites/:complexId - Agregar a favoritos
router.post('/:complexId', verifyToken, addFavorite);

// DELETE /favorites/:complexId - Quitar de favoritos
router.delete('/:complexId', verifyToken, removeFavorite);

// GET /favorites - Ver mis favoritos
router.get('/', verifyToken, getFavorites);

export default router;