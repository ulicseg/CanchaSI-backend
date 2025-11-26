import * as matchmakingRepo from '../repositories/matchmaking.repository.js';

export async function publishRequest(uid, requestData) {
  // Armo el objeto con toda la info del aviso
  const newMatch = {
    ownerId: uid,
    bookingId: requestData.bookingId,
    complexName: requestData.complexName || "Cancha Sin Nombre",
    date: requestData.date,
    time: requestData.time,
    missingPlayers: Number(requestData.missingPlayers),
    description: requestData.description || "¡Faltan jugadores!",
    status: 'OPEN',
    createdAt: new Date(),
    applicants: []
  };

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
