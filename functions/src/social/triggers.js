import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { db, rtdb } from "../config/firebase.js";

// ==================================================================
// 1. Notificar al CAPITÁN cuando hay un nuevo postulante
// ==================================================================
// Se dispara cuando se crea un documento en la subcolección 'applicants'
export const notifyMatchCaptain = onDocumentCreated("matchmaking/{matchId}/applicants/{applicantId}", async (event) => {
    try {
        const matchId = event.params.matchId;
        const applicantId = event.params.applicantId;

        // Buscamos el partido para saber quién es el dueño (Capitán)
        const matchDoc = await db.collection('matchmaking').doc(matchId).get();
        if (!matchDoc.exists) return;

        const matchData = matchDoc.data();
        const captainId = matchData.ownerId; 

        // Si el capitán se postula a sí mismo, ignoramos
        if (captainId === applicantId) return;

        console.log(`🔔 Nuevo Postulante: Avisando al Capitán ${captainId}`);

        // Escribimos en Realtime Database (Buzón del Capitán)
        const notificationRef = rtdb.ref(`notifications/${captainId}`).push();
        
        console.log(`📝 Intentando escribir en: notifications/${captainId}`);
        
        await notificationRef.set({
            type: 'NEW_APPLICANT',
            message: '¡Alguien quiere unirse a tu partido!',
            matchId: matchId,
            applicantId: applicantId,
            read: false,
            timestamp: Date.now()
        });

        console.log(`✅ Notificación escrita exitosamente`);

    } catch (error) {
        console.error("❌ Error en notifyMatchCaptain:", error);
        console.error("Stack:", error.stack);
    }
});

// ==================================================================
// 2. Notificar al POSTULANTE cuando lo Aceptan o Rechazan
// ==================================================================
// Se dispara cuando cambia el estado en la subcolección 'applicants'
export const notifyApplicantResolution = onDocumentUpdated("matchmaking/{matchId}/applicants/{applicantId}", async (event) => {
    try {
        const applicantId = event.params.applicantId;
        const matchId = event.params.matchId;

        const oldData = event.data.before.data();
        const newData = event.data.after.data();

        // Si el estado no cambió, no hacemos nada
        if (oldData.status === newData.status) return;

        const newStatus = newData.status;
        let messageText = '';

        if (newStatus === 'accepted') {
            messageText = '¡Te aceptaron en el partido! Prepará los botines ⚽';
        } else if (newStatus === 'rejected') {
            messageText = 'El capitán rechazó tu solicitud ❌';
        } else {
            return; 
        }

        console.log(`🔔 Resolución: Avisando al Postulante ${applicantId}`);

        // Escribimos en Realtime Database (Buzón del Postulante)
        const notificationRef = rtdb.ref(`notifications/${applicantId}`).push();

        console.log(`📝 Intentando escribir en: notifications/${applicantId}`);

        await notificationRef.set({
            type: 'APPLICATION_STATUS',
            message: messageText,
            matchId: matchId,
            status: newStatus,
            read: false,
            timestamp: Date.now()
        });

        console.log(`✅ Notificación de resolución escrita exitosamente`);

    } catch (error) {
        console.error("❌ Error en notifyApplicantResolution:", error);
        console.error("Stack:", error.stack);
    }
});

// ==================================================================
// 3. Calcular Promedio de Estrellas (Reviews)
// ==================================================================
// Se dispara cuando se crea una nueva review
export const calculateComplexRating = onDocumentCreated("reviews/{reviewId}", async (event) => {
    try {
        const newReview = event.data.data();
        const complexId = newReview.complexId;

        console.log(`⭐ Calculando rating para complejo: ${complexId}`);

        // Traemos TODAS las reviews de ese complejo para promediar
        const snapshot = await db.collection('reviews').where('complexId', '==', complexId).get();

        if (snapshot.empty) return;

        let totalStars = 0;
        let count = 0;

        snapshot.forEach(doc => {
            totalStars += Number(doc.data().rating);
            count++;
        });

        // Promedio matemático
        const average = totalStars / count;
        const finalRating = Math.round(average * 10) / 10; // Redondeo a 1 decimal

        // Actualizamos el complejo (o lo creamos si no existe)
        await db.collection('complexes').doc(complexId).set({
            rating: finalRating,
            ratingCount: count
        }, { merge: true });
        
        console.log(`✅ Rating actualizado: ${finalRating} (${count} votos)`);

    } catch (error) {
        console.error("Error en calculateComplexRating:", error);
    }
});
