import admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar las credenciales desde el archivo serviceAccountKey.json
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, 'src', 'config', 'serviceAccountKey.json'), 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
});

const db = admin.firestore();

const seedDatabase = async () => {
  console.log('Iniciando la creación de datos de prueba...');

  try {
    // --- Users Collection ---
    console.log('Creando usuarios...');
    const userAdminRef = db.collection('users').doc('user_admin_test');
    await userAdminRef.set({
      uid: 'user_admin_test',
      email: 'dueno@test.com',
      role: 'owner',
      name: 'Dueño Pepe',
      createdAt: Timestamp.now()
    });

    const userPlayerRef = db.collection('users').doc('user_player_test');
    await userPlayerRef.set({
      uid: 'user_player_test',
      email: 'jugador@test.com',
      role: 'player',
      name: 'Lionel Messi',
      phone: '+5491112345678',
      positionLevel: 'Delantero / Experto',
      createdAt: Timestamp.now()
    });
    console.log('Usuarios creados.');

    // --- Complexes Collection ---
    console.log('Creando complejos...');
    const complexRef = db.collection('complexes').doc('complex_test_1');
    await complexRef.set({
      ownerId: 'user_admin_test',
      name: 'Complejo El Monumental',
      description: 'El mejor complejo de la zona',
      addressText: 'Av. Figueroa Alcorta 7597',
      phone: '1112345678',
      geo: { lat: -34.54, lng: -58.44 },
      photos: ['https://via.placeholder.com/150'],
      openHour: 9,
      closeHour: 23,
      depositMinPct: 10,
      createdAt: Timestamp.now()
    });
    console.log('Complejos creados.');

    // --- Fields Collection ---
    console.log('Creando canchas...');
    const fieldRef = db.collection('fields').doc('field_test_1');
    await fieldRef.set({
      complexId: 'complex_test_1',
      label: 'Cancha 1 - Techada',
      type: 'Futbol 5',
      indoor: true,
      surface: 'Sintético',
      priceHourNoLight: 10000,
      priceHourWithLight: 12000,
      createdAt: Timestamp.now()
    });
    console.log('Canchas creadas.');

    // --- Reservations Collection ---
    console.log('Creando reservas...');
    const reservationRef = db.collection('reservations').doc('reserva_test_1');
    await reservationRef.set({
      status: 'paid',
      userId: 'user_player_test',
      complexId: 'complex_test_1',
      fieldId: 'field_test_1',
      date: '2025-12-01',
      startTime: '20:00',
      durationMin: 60,
      depositAmount: 1000,
      paymentId: 'mock_mp_123'
    });
    console.log('Reservas creadas.');

    console.log('✅ ¡Datos de prueba creados exitosamente!');
  } catch (error) {
    console.error('❌ Error al crear los datos de prueba:', error);
  } finally {
    // Cierra la conexión para que el script termine
    admin.app().delete();
  }
};

seedDatabase();
