import * as playerService from '../services/player.service.js';

/**
 * Endpoint: POST /players/auth
 * Propósito: Crear o Sincronizar el usuario de Auth con Firestore.
 */
export async function authPlayer(req, res) {
  try {
    // 1. SEGURIDAD: El UID y Email vienen del Token verificado (gracias al middleware)
    // NO leemos el UID del body porque alguien podría mentir.
    const uid = req.user.uid;
    const email = req.user.email;
    
    // 2. El resto de datos (Nombre, Foto, Posición) sí vienen del formulario del body
    const incomingData = req.body;

    // 3. Llamamos al servicio
    const result = await playerService.registerOrLoginPlayer(uid, email, incomingData);

    // 4. Respondemos con éxito
    return res.status(200).json({ success: true, data: result });

  } catch (error) {
    console.error('Error en authPlayer:', error);
    return res.status(500).json({ error: 'Error interno al procesar el jugador.' });
  }
}

/**
 * Endpoint: GET /players/me
 * Propósito: Ver mi propio perfil.
 */
export async function getProfile(req, res) {
  try {
    const uid = req.user.uid; // El token me dice quién soy
    const profile = await playerService.getMyProfile(uid);
    
    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
