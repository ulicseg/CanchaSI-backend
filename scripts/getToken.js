// scripts/getToken.js
// USO: node scripts/getToken.js

// --- CONFIGURACIÓN ---
const API_KEY = "AIzaSyB-3VDg4HhPLcYaUcRJQ34WSC30j71xSGE"; // Corregida desde Firebase Console
const EMAIL = "jugador@test.com";
const PASSWORD = "password123";

async function getIdToken() {
  console.log("🔄 Solicitando token a Firebase...");
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: EMAIL,
        password: PASSWORD,
        returnSecureToken: true
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error al autenticar');
    }

    console.log("\n✅ Token obtenido exitosamente:\n");
    console.log("ID Token:");
    console.log(data.idToken);
    console.log("\n📋 Copia este header para Postman:");
    console.log(`Authorization: Bearer ${data.idToken}`);
    console.log("\n📝 Información adicional:");
    console.log(`- Email: ${data.email}`);
    console.log(`- UID: ${data.localId}`);
    console.log(`- Expira en: ${data.expiresIn} segundos\n`);

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.log("\n💡 Verifica que:");
    console.log("1. El email y password sean correctos");
    console.log("2. El usuario exista en Firebase Auth");
    console.log("3. La API Key sea válida\n");
  }
}

getIdToken();
