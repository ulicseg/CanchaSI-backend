import { db } from '../../config/firebase.js';

const collection = db.collection('fields');

export const create = async (data) => {
    const docRef = await collection.add(data);
    return { id: docRef.id, ...data };
};

export const update = async (id, data) => {
    await collection.doc(id).update(data);
    return { id, ...data };
};

export const remove = async (id) => {
    await collection.doc(id).delete();
    return { id, deleted: true };
};