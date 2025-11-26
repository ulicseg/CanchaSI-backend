import admin from 'firebase-admin';

// Middleware de Autenticación
export async function verifyToken(req, res, next) {
  try {
    // 1. Buscamos el header "Authorization"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado. Falta el token.' });
    }

    // 2. Extraemos el token
    const idToken = authHeader.split('Bearer ')[1];

    // 3. Verificamos con Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // 4. Inyectamos el usuario seguro en el request
    req.user = decodedToken;

    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}
