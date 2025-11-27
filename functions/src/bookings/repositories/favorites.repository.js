import { db } from '../../config/firebase.js';

export const getComplexById = async (complexId) => {
  const doc = await db.collection('complexes').doc(complexId).get();
  
  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data()
  };
};

export const getFavoriteByUserAndComplex = async (userId, complexId) => {
  const snapshot = await db.collection('favorites')
    .where('userId', '==', userId)
    .where('complexId', '==', complexId)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  };
};

export const createFavorite = async (favoriteData) => {
  const favoriteRef = await db.collection('favorites').add(favoriteData);
  const favoriteDoc = await favoriteRef.get();
  return {
    id: favoriteDoc.id,
    ...favoriteDoc.data()
  };
};

export const deleteFavorite = async (favoriteId) => {
  await db.collection('favorites').doc(favoriteId).delete();
};

export const getFavoritesByUserId = async (userId) => {
  const snapshot = await db.collection('favorites')
    .where('userId', '==', userId)
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};