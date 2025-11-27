import { db } from '../config/firebase.js';
import { logger } from 'firebase-functions/v2';

/**
 * Trigger que se ejecuta cuando se crea un nuevo usuario en Firebase Auth.
 * Crea automáticamente un documento en Firestore con rol 'player'.
 * 
 * Este trigger se ejecuta de forma asíncrona después de que el usuario se crea.
 */
export async function handleUserCreate(event) {
    const user = event.data;
    const { uid, email } = user;

    try {
        // Crear documento en la colección 'users' con rol 'player' por defecto
        await db.collection('users').doc(uid).set({
            email: email || null,
            role: 'player',
            createdAt: new Date(),
            lastLogin: new Date()
        });

        logger.info(`Usuario creado en Firestore: ${uid} con rol 'player'`);
    } catch (error) {
        logger.error('Error creando usuario en Firestore:', error);
        // No lanzar error para no bloquear otros procesos
    }
}
