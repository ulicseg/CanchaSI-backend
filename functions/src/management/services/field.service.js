import * as fieldRepo from '../repositories/field.repository.js';

export const createField = async (data) => {
    // Aquí podrías validar que el complexId exista si quisieras
    return await fieldRepo.create({
        ...data,
        available: true // Por defecto habilitada
    });
};

export const updateField = async (id, data) => {
    return await fieldRepo.update(id, data);
};

export const removeField = async (id) => {
    // Opcional: Validar si tiene reservas futuras antes de borrar
    return await fieldRepo.remove(id);
};