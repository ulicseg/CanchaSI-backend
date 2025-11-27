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

// DEV C - Social (Pendiente)
// import socialApp from "./src/social/index.js";

// ========== IMPORTAR TRIGGERS ==========
// Triggers de bookings (DEV B) ✅
import { cleanExpiredHolds } from "./src/bookings/triggers/hold.triggers.js";

// Triggers de social (DEV C) - Pendiente
// import { notifyOnApplicant } from "./src/social/triggers/...";

// ========== CONFIGURAR APP MANAGEMENT (DEV A) ==========
const managementApp = express();
managementApp.use(cors({ origin: true }));
managementApp.use(express.json());
managementApp.use("/", managementRoutes);

// ========== HTTP FUNCTIONS (APIs REST) ==========
// DEV A - Management ✅
export const apiManagement = onRequest(managementApp);

// DEV B - Bookings ✅
export const apiBookings = onRequest(bookingsApp);

// DEV C - Social (Pendiente)
// export const apiSocial = onRequest(socialApp);

// ========== TRIGGER FUNCTIONS (Background) ==========
// DEV A - Triggers de Management ✅
export const onComplexCreate = managementTriggers.onComplexCreate;
export const onComplexUpdate = managementTriggers.onComplexUpdate;

// DEV B - Limpiar holds expirados cada 5 minutos ✅
export { cleanExpiredHolds };

// DEV C - Triggers (Pendiente)
// export { notifyOnApplicant };
