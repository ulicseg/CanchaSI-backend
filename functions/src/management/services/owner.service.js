import * as ownerRepo from '../repositories/owner.repository.js';

export const registerOwner = async (uid, data) => {
    return await ownerRepo.createOrUpdate(uid, {
        ...data,
        role: 'owner',
        createdAt: new Date()
    });
};

export const getProfile = async (uid) => {
    return await ownerRepo.findById(uid);
};

export const updateProfile = async (uid, data) => {
    return await ownerRepo.createOrUpdate(uid, data);
};