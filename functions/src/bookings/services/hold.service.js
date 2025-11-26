import * as holdRepository from '../repositories/hold.repository.js';

export const createHold = async ({ fieldId, date, time, userId }) => {
  // Validar que el slot no esté ocupado
  // TODO: Implementar validación de disponibilidad

  // Crear el hold con expiración de 15 minutos
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutos

  const holdData = {
    fieldId,
    date,
    time,
    userId,
    createdAt: now,
    expiresAt
  };

  return await holdRepository.createHold(holdData);
};
