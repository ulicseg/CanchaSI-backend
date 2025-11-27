# 📋 Instrucciones para Dev C - Módulo Social

## ✅ Estado Actual del Proyecto

**INTEGRADO EN MAIN:**
- ✅ **Dev A - Management:** Todos los endpoints de gestión de dueños y complejos
- ✅ **Dev B - Bookings:** Todos los endpoints de reservas, pagos y favoritos

**PENDIENTE:**
- ⏳ **Dev C - Social:** Tu módulo está preparado para ser integrado

---

## 🎯 Tu Misión

Implementar el módulo Social siguiendo la misma estructura que ya usamos Dev A y Dev B.

### Estructura ya creada para ti:
```
functions/src/social/
├── index.js              (Ya existe - base)
├── controllers/          (Crear tus controladores aquí)
├── services/             (Crear tus servicios aquí)
├── repositories/         (Crear tus repositorios aquí)
├── routes/               (Crear tus rutas aquí)
└── triggers/             (Crear tus triggers aquí)
```

---

## 📝 Tus 13 Endpoints a Implementar

Según "La Biblia del Backend":

1. `POST /players/auth` - Guardar usuario en Firestore al registrarse
2. `GET /players/me` - Mi perfil
3. `PUT /players/me` - Actualizar posición/foto
4. `POST /matchmaking/create` - Publicar "Me faltan X jugadores"
5. `GET /matchmaking/feed` - Ver lista de partidos buscando gente
6. `POST /matchmaking/:id/apply` - Postularse para jugar
7. `GET /matchmaking/:id/applicants` - Ver postulantes (solo creador)
8. `PUT /matchmaking/applicant/:id/accept` - Aceptar jugador
9. `PUT /matchmaking/applicant/:id/reject` - Rechazar jugador
10. `POST /reviews` - Calificar complejo (1-5 estrellas)
11. `GET /reviews/:complexId` - Ver reviews de un lugar
12. `GET /notifications` - Leer notificaciones (Histórico)
13. `PUT /notifications/:id/read` - Marcar como leída

---

## 🔧 Cómo Integrar tu Trabajo

### Paso 1: Crear tu rama
```bash
git checkout main
git pull origin main
git checkout -b feat/social
```

### Paso 2: Implementar tu módulo
Sigue el patrón que usamos:
- **Rutas** → **Controladores** → **Servicios** → **Repositorios**

### Paso 3: Actualizar `functions/src/social/index.js`
```javascript
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Importa tus rutas
import playerRoutes from './routes/player.routes.js';
import matchmakingRoutes from './routes/matchmaking.routes.js';
import reviewRoutes from './routes/review.routes.js';
import notificationRoutes from './routes/notification.routes.js';

// Úsalas
app.use('/players', playerRoutes);
app.use('/matchmaking', matchmakingRoutes);
app.use('/reviews', reviewRoutes);
app.use('/notifications', notificationRoutes);

export default app;
```

### Paso 4: Actualizar `functions/index.js`
Descomenta estas líneas:
```javascript
// Línea ~17: Descomentar
import socialApp from "./src/social/index.js";

// Línea ~22: Descomentar
import { notifyOnApplicant, calculateRating } from "./src/social/triggers/social.triggers.js";

// Línea ~38: Descomentar
export const apiSocial = onRequest(socialApp);

// Línea ~49: Descomentar
export { notifyOnApplicant, calculateRating };
```

### Paso 5: Crear tus Triggers
Archivo: `functions/src/social/triggers/social.triggers.js`

```javascript
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
// Importa tus servicios

export const notifyOnApplicant = onDocumentCreated("matchmaking/{docId}", async (event) => {
  // Tu lógica: escribir en Realtime Database cuando alguien se postula
});

export const calculateRating = onDocumentCreated("reviews/{reviewId}", async (event) => {
  // Tu lógica: actualizar promedio del complejo
});
```

### Paso 6: Mergear a main
```bash
git add .
git commit -m "feat(social): Implementar módulo completo con endpoints y triggers"
git push origin feat/social

# Luego desde main:
git checkout main
git merge feat/social
git push origin main
```

---

## 🗄️ Bases de Datos que usarás

### Firestore:
- `users` (Ya tiene jugadores y dueños - Dev A y B lo usan)
- `matchmaking` (Crear esta colección)
- `reviews` (Crear esta colección)

### Realtime Database:
- `/notifications/{userId}/{notificationId}` (Crear esta estructura)

Ejemplo de notificación:
```json
{
  "notifications": {
    "user_player_test": {
      "notif_1": {
        "message": "Nuevo jugador se postuló a tu partido",
        "read": false,
        "timestamp": 1234567890
      }
    }
  }
}
```

---

## 🔥 Comandos Útiles

```bash
# Ver las 3 APIs funcionando
npm run serve

# Probar tus endpoints
# Management: http://localhost:5010/apiManagement/...
# Bookings:   http://localhost:5010/apiBookings/...
# Social:     http://localhost:5010/apiSocial/...

# Obtener token para Postman
node scripts/getToken.js
```

---

## ✨ Referencias

- Mira cómo Dev B estructuró `src/bookings/` como ejemplo
- Usa el middleware de autenticación en `src/shared/middlewares/auth.middleware.js`
- Revisa `contexto.txt` para la documentación completa

---

## 🎉 Al Finalizar

Cuando termines y hagas merge a main, el proyecto estará **100% completo** con las 3 APIs funcionando:

✅ `apiManagement` (Dev A)  
✅ `apiBookings` (Dev B)  
✅ `apiSocial` (Dev C - Tú)

**¡Éxito! 🚀**
