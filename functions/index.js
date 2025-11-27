import cors from "cors";
import dotenv from 'dotenv';
import express from "express";
import { onRequest } from "firebase-functions/v2/https";

dotenv.config();

// ========== IMPORTAR APPS ==========
// DEV A - Management ✅
import managementRoutes from "./src/management/routes/routes.js";
import * as managementTriggers from "./src/management/triggers.js";

// DEV B - Bookings ✅
import bookingsApp from "./src/bookings/index.js";

// DEV C - Social ✅
import socialApp from "./src/social/index.js";

// ========== IMPORTAR TRIGGERS ==========
// Triggers de bookings (DEV B) ✅
import { cleanExpiredHolds } from "./src/bookings/triggers/hold.triggers.js";

// Triggers de social (DEV C) ✅
import * as socialTriggers from "./src/social/triggers.js";



// ========== MAIN API (Unified) ==========
const mainApp = express();
mainApp.use(cors({ origin: true }));
mainApp.use(express.json());

// Mount sub-apps
mainApp.use("/management", managementRoutes); // Note: managementRoutes is a Router, not an App, so this is correct
mainApp.use("/bookings", bookingsApp);
mainApp.use("/social", socialApp);

export const api = onRequest(mainApp);

// ========== TRIGGER FUNCTIONS (Background) ==========
// DEV A - Triggers de Management ✅
export const onComplexCreate = managementTriggers.onComplexCreate;
export const onComplexUpdate = managementTriggers.onComplexUpdate;

// DEV B - Limpiar holds expirados cada 5 minutos ✅
export { cleanExpiredHolds };

// DEV C - Triggers de Social ✅
// Notificaciones Realtime
export const notifyMatchCaptain = socialTriggers.notifyMatchCaptain;
export const notifyApplicantResolution = socialTriggers.notifyApplicantResolution;

// Calculadora de Estrellas
export const calculateComplexRating = socialTriggers.calculateComplexRating;
