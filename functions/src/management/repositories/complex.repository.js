import { db } from '../../config/firebase.js';

const collection = db.collection('complexes');
const reservationsCollection = db.collection('reservations');

// Crear complejo (inicia con array de fotos vacío)
export const create = async (data) => {
    const docRef = await collection.add({ ...data, photos: [] });
    return { id: docRef.id, ...data };
};

export const update = async (id, data) => {
    await collection.doc(id).update(data);
    return { id, ...data };
};

export const findByOwner = async (ownerId) => {
    const snapshot = await collection.where('ownerId', '==', ownerId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Lógica para agregar URL de foto al array
export const addPhotoUrl = async (id, photoUrl) => {
    const docRef = collection.doc(id);
    const doc = await docRef.get();
    const photos = doc.data().photos || [];
    photos.push(photoUrl);
    await docRef.update({ photos });
    return photos;
};

// Eliminar foto por su posición en el array
export const removePhotoByIndex = async (id, index) => {
    const docRef = collection.doc(id);
    const doc = await docRef.get();
    const photos = doc.data().photos || [];
    if (index < 0 || index >= photos.length) throw new Error("Índice inválido");
    photos.splice(index, 1);
    await docRef.update({ photos });
    return photos;
};

// Obtener reservas de un complejo (Agenda)
export const getComplexReservations = async (complexId) => {
    const snapshot = await reservationsCollection.where('complexId', '==', complexId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Calcular estadísticas (Reservas e Ingresos)
export const getOwnerStats = async (ownerId) => {
    const complexes = await findByOwner(ownerId);
    const complexIds = complexes.map(c => c.id);
    
    if (complexIds.length === 0) return { revenue: 0, totalReservations: 0 };

    // Nota: Firestore limita 'in' a 10 items. Para MVP funciona bien.
    const snapshot = await reservationsCollection.where('complexId', 'in', complexIds).get();
    
    let totalReservations = 0;
    let revenue = 0;

    snapshot.docs.forEach(doc => {
        totalReservations++;
        if (doc.data().price) revenue += doc.data().price;
    });

    return { totalReservations, revenue };
};