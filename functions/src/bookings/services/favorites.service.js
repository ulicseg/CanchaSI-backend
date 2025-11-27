import * as favoritesRepository from '../repositories/favorites.repository.js';

export const addFavorite = async (userId, complexId) => {
  // 1. Verificar que el complejo existe
  const complex = await favoritesRepository.getComplexById(complexId);
  if (!complex) {
    throw new Error('Complex not found');
  }

  // 2. Verificar si ya está en favoritos
  const existingFavorite = await favoritesRepository.getFavoriteByUserAndComplex(userId, complexId);
  if (existingFavorite) {
    throw new Error('Complex already in favorites');
  }

  // 3. Agregar a favoritos
  const now = new Date();
  const favorite = {
    userId,
    complexId,
    createdAt: now
  };

  const createdFavorite = await favoritesRepository.createFavorite(favorite);

  return {
    id: createdFavorite.id,
    complexId,
    complex: {
      id: complex.id,
      name: complex.name,
      address: complex.address,
      photos: complex.photos || []
    }
  };
};

export const removeFavorite = async (userId, complexId) => {
  // 1. Buscar el favorito
  const favorite = await favoritesRepository.getFavoriteByUserAndComplex(userId, complexId);
  
  if (!favorite) {
    throw new Error('Favorite not found');
  }

  // 2. Eliminar
  await favoritesRepository.deleteFavorite(favorite.id);
};

export const getFavorites = async (userId) => {
  // 1. Obtener todos los favoritos del usuario
  const favorites = await favoritesRepository.getFavoritesByUserId(userId);

  // 2. Enriquecer con datos del complejo
  const enrichedFavorites = await Promise.all(
    favorites.map(async (favorite) => {
      const complex = await favoritesRepository.getComplexById(favorite.complexId);
      
      return {
        id: favorite.id,
        complexId: favorite.complexId,
        addedAt: favorite.createdAt,
        complex: complex ? {
          id: complex.id,
          name: complex.name,
          description: complex.description,
          address: complex.address,
          phone: complex.phone,
          geo: complex.geo,
          photos: complex.photos || [],
          openHour: complex.openHour,
          depositMinPct: complex.depositMinPct
        } : null
      };
    })
  );

  return enrichedFavorites.filter(f => f.complex !== null);
};