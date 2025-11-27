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

    // 5. Auto-crear usuario en Firestore si no existe (primera vez que se loguea)
    try {
      const { db } = await import('../../config/firebase.js');
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();

      if (!userDoc.exists) {
        // Crear usuario con rol 'player' por defecto
        await db.collection('users').doc(decodedToken.uid).set({
          email: decodedToken.email || null,
          role: 'player',
          createdAt: new Date(),
          lastLogin: new Date()
        });
        console.log(`Usuario auto-creado en Firestore: ${decodedToken.uid}`);
      }
    } catch (dbError) {
      // No bloqueamos la autenticación si falla la creación del usuario
      console.error('Error auto-creando usuario:', dbError);
    }

    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}
