import * as complexRepo from '../repositories/complex.repository.js';

export const createComplex = async (data, ownerId) => {
    // Inicializamos el rating en 0 y la fecha de creación
    return await complexRepo.create({
        ...data,
        ownerId,
        rating: 0,
        createdAt: new Date()
    });
};

export const updateComplex = async (id, data) => complexRepo.update(id, data);
export const getMyComplexes = async (ownerId) => complexRepo.findByOwner(ownerId);

// Gestión de fotos
export const addPhoto = async (id, { photoUrl }) => complexRepo.addPhotoUrl(id, photoUrl);
export const deletePhoto = async (id, index) => complexRepo.removePhotoByIndex(id, Number(index));

// Agenda y Stats
export const getReservations = async (complexId) => complexRepo.getComplexReservations(complexId);
export const getStats = async (ownerId) => complexRepo.getOwnerStats(ownerId);