import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Leer serviceAccountKey desde la raíz del proyecto
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, '..', 'serviceAccountKey.json'), 'utf8')
);

// Inicializar Firebase Admin
initializeApp({
  credential: credential.cert(serviceAccount)
});

const db = getFirestore();

async function checkOwner() {
  console.log('🔍 Verificando ownerId del complejo...\n');

  try {
    // Obtener el complejo
    const complexDoc = await db.collection('complexes').doc('complex_test_1').get();
    
    if (!complexDoc.exists) {
      console.log('❌ El complejo complex_test_1 no existe');
      return;
    }

    const complexData = complexDoc.data();
    console.log('📋 Datos del complejo:');
    console.log(`   ID: ${complexDoc.id}`);
    console.log(`   Name: ${complexData.name}`);
    console.log(`   Owner ID actual: ${complexData.ownerId}`);
    console.log('\n');

    console.log('🎯 UID esperado del token dueno@test.com:');
    console.log('   TqPGW1UXLsZfY66LptQdwnYhZAD3');
    console.log('\n');

    if (complexData.ownerId === 'TqPGW1UXLsZfY66LptQdwnYhZAD3') {
      console.log('✅ ¡Los IDs coinciden! El endpoint debería funcionar.');
    } else {
      console.log('❌ Los IDs NO coinciden. Actualizando...\n');
      
      await db.collection('complexes').doc('complex_test_1').update({
        ownerId: 'TqPGW1UXLsZfY66LptQdwnYhZAD3'
      });

      console.log('✅ ownerId actualizado correctamente.');
      console.log('   Ahora prueba el endpoint nuevamente.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  process.exit(0);
}

checkOwner();