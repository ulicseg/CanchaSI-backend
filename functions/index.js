import { onRequest } from "firebase-functions/v2/https";
// import { onDocumentCreated } from "firebase-functions/v2/firestore";  // DEV A y C lo usarán

// ========== IMPORTAR APPS ==========
// DEV A - Management (Pendiente - comentado por ahora)
// import managementApp from "./src/management/index.js";

// DEV B - Bookings (TÚ) ✅
import bookingsApp from "./src/bookings/index.js";

// DEV C - Social (Pendiente - comentado por ahora)
// import socialApp from "./src/social/index.js";

// ========== IMPORTAR TRIGGERS ==========
// Triggers de bookings (DEV B) ✅
import { cleanExpiredHolds } from "./src/bookings/triggers/hold.triggers.js";

// Triggers de management (DEV A) - Pendiente
// import { checkExpiredHolds } from "./src/management/triggers/...";

// Triggers de social (DEV C) - Pendiente
// import { notifyOnApplicant } from "./src/social/triggers/...";

// ========== HTTP FUNCTIONS (APIs REST) ==========
// DEV A - Management (comentado hasta que lo implementen)
// export const apiManagement = onRequest(managementApp);

// DEV B - Bookings (TÚ) ✅
export const apiBookings = onRequest(bookingsApp);

// DEV C - Social (comentado hasta que lo implementen)
// export const apiSocial = onRequest(socialApp);

// ========== TRIGGER FUNCTIONS (Background) ==========
// DEV B - Limpiar holds expirados cada 5 minutos ✅
export { cleanExpiredHolds };

// DEV A - Triggers (los agregarán cuando implementen management)
// export { checkExpiredHolds };

// DEV C - Triggers (los agregarán cuando implementen social)
// export { notifyOnApplicant };
