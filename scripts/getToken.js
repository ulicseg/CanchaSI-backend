// scripts/getToken.js
// USO: node scripts/getToken.js

import fs from 'fs';

// --- CONFIGURACIÓN (COMPLETAR ESTO) ---
const API_KEY = "AIzaSyB-3VDg4HhPLcYaUcRJQ34WSC30j71xSGE"; // Leer abajo dónde encontrarla
const EMAIL = "jugador@test.com"; // El usuario que creaste en Auth
const PASSWORD = "password123";   // La contraseña que le pusiste

async function getIdToken() {
  console.log("🔄 Solicitando token a Firebase...");

  // Endpoint de la API REST de Firebase Auth
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: EMAIL,
        password: PASSWORD,
        returnSecureToken: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message);
    }

    console.log("\n✅ ¡LOGIN EXITOSO! Copiá este token para Postman:\n");
    console.log(data.idToken);
    console.log("\n(Este token expira en 1 hora)");

  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    console.error("Revisá que el usuario exista en Firebase Authentication y la API KEY sea correcta.");
  }
}

getIdToken();
