import { onSchedule } from 'firebase-functions/v2/scheduler';
import { db } from '../../config/firebase.js';

// Se ejecuta cada 5 minutos
export const cleanExpiredHolds = onSchedule('every 5 minutes', async (event) => {
  console.log('🧹 Limpiando holds expirados...');

  const now = new Date();

  try {
    // 1. Buscar holds expirados que estén activos
    const expiredHoldsSnapshot = await db.collection('holds')
      .where('status', '==', 'active')
      .where('expiresAt', '<', now)
      .get();

    if (expiredHoldsSnapshot.empty) {
      console.log('✅ No hay holds expirados');
      return null;
    }

    // 2. Marcarlos como expirados
    const batch = db.batch();
    let count = 0;

    expiredHoldsSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        status: 'expired',
        expiredAt: now
      });
      count++;
    });

    await batch.commit();

    console.log(`✅ ${count} holds marcados como expirados`);
    return { expired: count };

  } catch (error) {
    console.error('❌ Error limpiando holds:', error);
    return null;
  }
});