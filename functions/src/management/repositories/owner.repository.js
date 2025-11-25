import { db } from '../../config/firebase.js';

const collection = db.collection('owners');

export const createOrUpdate = async (uid, data) => {
    // Usamos 'merge' para actualizar sin borrar datos existentes
    await collection.doc(uid).set(data, { merge: true });
    return { uid, ...data };
};

export const findById = async (uid) => {
    const doc = await collection.doc(uid).get();
    return doc.exists ? { uid, ...doc.data() } : null;
};