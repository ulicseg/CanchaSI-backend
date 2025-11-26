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
