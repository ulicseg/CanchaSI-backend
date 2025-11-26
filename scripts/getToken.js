// scripts/getToken.js
// USO: 
//   - Token jugador (por defecto): node scripts/getToken.js
//   - Token dueño: node scripts/getToken.js dueno@test.com dueno123

// --- CONFIGURACIÓN ---
const API_KEY = "AIzaSyB-3VDg4HhPLcYaUcRJQ34WSC30j71xSGE"; // Corregida desde Firebase Console

// Opción 1: Valores por defecto (jugador)
const DEFAULT_EMAIL = "jugador@test.com";
const DEFAULT_PASSWORD = "password123";

// Opción 2: Argumentos desde línea de comandos
const EMAIL = process.argv[2] || DEFAULT_EMAIL;
const PASSWORD = process.argv[3] || DEFAULT_PASSWORD;

async function getIdToken() {
  console.log("🔄 Solicitando token a Firebase...");
  console.log(`📧 Email: ${EMAIL}\n`);
  
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
