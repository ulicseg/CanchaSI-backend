import * as matchmakingService from '../services/matchmaking.service.js';

// POST /matchmaking/create - Publicar aviso buscando jugadores
export async function createMatch(req, res) {
  try {
    // El dueño del aviso es quien está logueado
    const uid = req.user.uid;
    
    // Datos del aviso
    const { bookingId, complexName, date, time, missingPlayers, description } = req.body;

    // Validación básica
    if (!missingPlayers || missingPlayers < 1) {
      return res.status(400).json({ error: 'Debes indicar cuántos jugadores faltan (missingPlayers).' });
    }

    // Creo el aviso
    const result = await matchmakingService.publishRequest(uid, {
      bookingId,
      complexName,
      date,
      time,
      missingPlayers,
      description
    });

    return res.status(201).json({ success: true, data: result });

  } catch (error) {
    console.error('Error creando match:', error);
    return res.status(500).json({ error: 'Error interno al crear la búsqueda.' });
  }
}
