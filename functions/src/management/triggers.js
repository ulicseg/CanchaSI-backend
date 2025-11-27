import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { db } from "../config/firebase.js";

// 1. Email de Bienvenida (Simulado)
export const onComplexCreate = onDocumentCreated("complexes/{complexId}", (event) => {
    if (!event.data) return;
    const data = event.data.data();
    console.log(`[EMAIL SIMULADO] Hola dueño! Tu complejo "${data.name}" ya está visible.`);
});

// 2. Auditoría de cambios (Log)
export const onComplexUpdate = onDocumentUpdated("complexes/{complexId}", async (event) => {
    const newValue = event.data.after.data();
    const previousValue = event.data.before.data();

    // Si cambió el nombre, guardamos un log
    if (newValue.name !== previousValue.name) {
        await db.collection('logs').add({
            message: `El complejo ${previousValue.name} cambió de nombre a ${newValue.name}`,
            complexId: event.params.complexId,
            timestamp: new Date()
        });
        console.log("Auditoría guardada para complejo:", event.params.complexId);
    }
});