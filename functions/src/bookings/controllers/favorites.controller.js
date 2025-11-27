import * as favoritesService from '../services/favorites.service.js';

export const addFavorite = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { complexId } = req.params;

    const result = await favoritesService.addFavorite(userId, complexId);

    return res.status(201).json({
      success: true,
      message: 'Complex added to favorites',
      data: result
    });
  } catch (error) {
    console.error('Error adding favorite:', error);

    if (error.message === 'Complex not found') {
      return res.status(404).json({ success: false, error: error.message });
    }
    if (error.message === 'Complex already in favorites') {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { complexId } = req.params;

    await favoritesService.removeFavorite(userId, complexId);

    return res.status(200).json({
      success: true,
      message: 'Complex removed from favorites'
    });
  } catch (error) {
    console.error('Error removing favorite:', error);

    if (error.message === 'Favorite not found') {
      return res.status(404).json({ success: false, error: error.message });
    }

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.uid;

    const favorites = await favoritesService.getFavorites(userId);

    return res.status(200).json({
      success: true,
      data: favorites
    });
  } catch (error) {
    console.error('Error getting favorites:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};