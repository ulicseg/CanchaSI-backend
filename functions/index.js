import { onRequest } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";

// Importar las Apps de cada uno
import managementApp from "./src/management/index.js";
import bookingsApp from "./src/bookings/index.js";
import socialApp from "./src/social/index.js";

// Exportar las APIs (Endpoints)
export const apiManagement = onRequest(managementApp);
export const apiBookings = onRequest(bookingsApp);
export const apiSocial = onRequest(socialApp);

// Exportar los Triggers (Background)
// Acá importan las funciones sueltas de sus archivos triggers.js
// export const checkExpiredHolds = ...
// export const notifyOnApplicant = ...
