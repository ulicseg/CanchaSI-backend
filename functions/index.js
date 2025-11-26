import { onRequest } from "firebase-functions/v2/https";


// Importar las Apps de cada uno
import managementApp from "./src/management/index.js";
import bookingsApp from "./src/bookings/index.js";
import socialApp from "./src/social/index.js";

// 1. IMPORTAMOS LOS TRIGGERS
import * as socialTriggers from "./src/social/triggers.js";

// Exportar las APIs (Endpoints)
export const apiManagement = onRequest(managementApp);
export const apiBookings = onRequest(bookingsApp);
export const apiSocial = onRequest(socialApp);

// --- CLOUD FUNCTIONS BACKGROUND (Triggers) ---

// Notificaciones Realtime
export const notifyMatchCaptain = socialTriggers.notifyMatchCaptain;
export const notifyApplicantResolution = socialTriggers.notifyApplicantResolution;

// Calculadora de Estrellas
export const calculateComplexRating = socialTriggers.calculateComplexRating;
