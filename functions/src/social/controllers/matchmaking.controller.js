import * as matchmakingService from '../services/matchmaking.service.js';

// POST /matchmaking/create - Publicar aviso buscando jugadores
export async function createMatch(req, res) {
  try {
    // El dueño del aviso es quien está logueado
    const uid = req.user.uid;
    
    // Datos del aviso
    const { 
      bookingId,      // Opcional: ID de reserva de Bookings (cuando esté integrado)
      complexName,    // TEMPORAL: Para testing sin bookingId
      date, 
      time, 
      fieldType,
      location,
      totalPlayers,
      missingPlayers, 
      description 
    } = req.body;

    // Validación básica
    if (!missingPlayers || missingPlayers < 1) {
      return res.status(400).json({ error: 'Debes indicar cuántos jugadores faltan (missingPlayers).' });
    }

    // Creo el aviso
    const result = await matchmakingService.publishRequest(uid, {
      bookingId,
      complexName,  // TEMPORAL
      date,
      time,
      fieldType,
      location,
      totalPlayers,
      missingPlayers,
      description
    });

    return res.status(201).json({ success: true, data: result });

  } catch (error) {
    console.error('Error creando match:', error);
    return res.status(500).json({ error: 'Error interno al crear la búsqueda.' });
  }
}

// GET /matchmaking/feed - Listar partidos disponibles
export async function getMatchFeed(req, res) {
  try {
    const feed = await matchmakingService.getFeed();
    
    return res.status(200).json({ success: true, data: feed });
  } catch (error) {
    console.error('Error getting feed:', error);
    return res.status(500).json({ error: 'Error al obtener el feed.' });
  }
}

// POST /matchmaking/:id/apply - Postularse a un partido
export async function applyToMatch(req, res) {
  try {
    const uid = req.user.uid;
    const { id } = req.params;

    const result = await matchmakingService.applyToMatch(uid, id);

    return res.status(200).json({ success: true, message: 'Solicitud enviada', data: result });
  } catch (error) {
    // Errores de negocio devuelven 400
    if (error.message.includes('partido') || error.message.includes('propio')) {
       return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
}

// GET /:id/applicants
export async function getApplicants(req, res) {
  try {
    const uid = req.user.uid;
    const { id } = req.params; // ID del partido

    const applicants = await matchmakingService.getMatchApplicants(uid, id);
    
    return res.status(200).json({ success: true, data: applicants });
  } catch (error) {
    // Si da error de permiso, devolvemos 403 Forbidden
    if (error.message.includes('permiso') || error.message.includes('autorizado')) {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
}

// PUT .../accept
export async function acceptPlayer(req, res) {
  try {
    const uid = req.user.uid;
    // La URL tiene dos parámetros: el ID del partido y el ID del postulante
    const { matchId, applicantId } = req.params;

    const result = await matchmakingService.acceptApplicant(uid, matchId, applicantId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

// PUT .../reject
export async function rejectPlayer(req, res) {
  try {
    const uid = req.user.uid;
    const { matchId, applicantId } = req.params;

    const result = await matchmakingService.rejectApplicant(uid, matchId, applicantId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
