import { onRequest } from "firebase-functions/v2/https";
import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

// Importamos TU trabajo (Dev A)
import managementRoutes from "./src/management/routes/routes.js";
import * as managementTriggers from "./src/management/triggers.js";

const managementApp = express();
managementApp.use(cors({ origin: true }));
managementApp.use(express.json());

// Conectamos tus rutas
managementApp.use("/", managementRoutes);

// --- EXPORTAR APIS (HTTP) ---
export const apiManagement = onRequest(managementApp);

// --- EXPORTAR TRIGGERS (BACKGROUND) ---
export const onComplexCreate = managementTriggers.onComplexCreate;
export const onComplexUpdate = managementTriggers.onComplexUpdate;