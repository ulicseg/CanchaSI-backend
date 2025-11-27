import * as playerRepo from '../repositories/player.repository.js';

export async function registerOrLoginPlayer(uid, email, requestBody) {
  // 1. Definimos los datos base que SIEMPRE vienen del Token
  const playerData = {
    email: email,
    role: 'player', // Importante: Forzamos el rol para que nadie se haga admin
    lastLogin: new Date() // Guardamos cuándo fue la última vez que entró
  };

  // 2. Mapeamos los datos opcionales que vienen del Frontend (Body)
  // Solo los agregamos si existen, para no guardar "undefined" o borrar info vieja
  if (requestBody.name) playerData.name = requestBody.name;
  if (requestBody.photoUrl) playerData.photoUrl = requestBody.photoUrl;
  if (requestBody.phone) playerData.phone = requestBody.phone;
  if (requestBody.positionLevel) playerData.positionLevel = requestBody.positionLevel;

  // 3. Llamamos al repositorio para guardar
  const savedPlayer = await playerRepo.savePlayer(uid, playerData);
  
  return savedPlayer;
}

export async function getMyProfile(uid) {
  const player = await playerRepo.getPlayerById(uid);
  if (!player) {
    throw new Error('Perfil de jugador no encontrado.');
  }
  return player;
}
