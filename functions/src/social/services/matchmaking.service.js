import * as matchmakingRepo from '../repositories/matchmaking.repository.js';
import { db } from '../../config/firebase.js';

export async function publishRequest(uid, requestData) {
  // Armo el objeto con toda la info del aviso
  const newMatch = {
    ownerId: uid,
    date: requestData.date,
    time: requestData.time,
    fieldType: requestData.fieldType,
    location: requestData.location,
    totalPlayers: Number(requestData.totalPlayers),
    missingPlayers: Number(requestData.missingPlayers),
    description: requestData.description || "¡Faltan jugadores!",
    status: 'OPEN',
    createdAt: new Date(),
    applicants: []
  };

  // Si viene bookingId, obtener datos del complejo desde Management
  if (requestData.bookingId) {
    newMatch.bookingId = requestData.bookingId;
    
    try {
      const booking = await db.collection('reservations').doc(requestData.bookingId).get();
      if (booking.exists) {
        const bookingData = booking.data();
        const complex = await db.collection('complexes').doc(bookingData.complexId).get();
        newMatch.complexId = bookingData.complexId;
        newMatch.complexName = complex.exists ? complex.data().name : "Complejo";
        newMatch.fieldId = bookingData.fieldId;
      }
    } catch (error) {
      console.error('Error obteniendo datos de la reserva:', error);
      // Si falla, usar datos por defecto
      newMatch.complexName = "Complejo";
    }
  }

  // FALLBACK: Para testing sin bookingId o si falla la consulta
  if (!newMatch.complexName) {
    newMatch.complexName = requestData.complexName || "Cancha Sin Nombre";
  }

  // Guardo en la base de datos
  const createdMatch = await matchmakingRepo.createMatchRequest(newMatch);
  
  return createdMatch;
}

export async function getFeed() {
  return await matchmakingRepo.getActiveMatches();
}

export async function applyToMatch(uid, matchId) {
  // Verifico que el partido exista
  const match = await matchmakingRepo.getMatchById(matchId);
  if (!match) {
    throw new Error('El partido no existe.');
  }

  // Verifico que esté abierto
  if (match.status !== 'OPEN') {
    throw new Error('Este partido ya está cerrado o completo.');
  }

  // No puedo postularme a mi propio partido
  if (match.ownerId === uid) {
    throw new Error('No puedes postularte a tu propio partido.');
  }

  // Guardo la postulación
  return await matchmakingRepo.addApplicant(matchId, uid);
}

/**
 * Ver postulantes (Solo para el dueño).
 */
export async function getMatchApplicants(uid, matchId) {
  // 1. Buscamos el partido para ver quién es el dueño
  const match = await matchmakingRepo.getMatchById(matchId);
  
  if (!match) throw new Error('Partido no encontrado');
  
  // 2. Seguridad: ¿Sos el dueño?
  if (match.ownerId !== uid) {
    throw new Error('No tienes permiso para ver los postulantes de este partido.');
  }

  return await matchmakingRepo.getApplicants(matchId);
}

/**
 * Aceptar a un jugador.
 */
export async function acceptApplicant(uid, matchId, applicantId) {
  // 1. Verificaciones de dueño
  const match = await matchmakingRepo.getMatchById(matchId);
  if (!match) throw new Error('Partido no encontrado');
  if (match.ownerId !== uid) throw new Error('No autorizado');

  // 2. Verificamos si hay lugar
  if (match.missingPlayers <= 0) {
    throw new Error('¡El partido ya está lleno! No puedes aceptar más jugadores.');
  }

  // 3. Actualizamos estado a 'accepted'
  await matchmakingRepo.updateApplicantStatus(matchId, applicantId, 'accepted');

  // 4. Restamos un cupo al partido
  await matchmakingRepo.decrementMissingPlayers(matchId);

  return { matchId, applicantId, status: 'accepted' };
}

/**
 * Rechazar a un jugador.
 */
export async function rejectApplicant(uid, matchId, applicantId) {
  // 1. Verificaciones de dueño
  const match = await matchmakingRepo.getMatchById(matchId);
  if (!match) throw new Error('Partido no encontrado');
  if (match.ownerId !== uid) throw new Error('No autorizado');

  // 2. Actualizamos estado a 'rejected' (No restamos cupo)
  await matchmakingRepo.updateApplicantStatus(matchId, applicantId, 'rejected');

  return { matchId, applicantId, status: 'rejected' };
}
