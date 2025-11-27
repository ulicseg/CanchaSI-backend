import { Router } from 'express';
// 1. IMPORTAR EL MIDDLEWARE DE SEGURIDAD
import { verifyToken } from '../../shared/middlewares/auth.middleware.js';

import * as ownerController from '../controllers/owner.controller.js';
import * as complexController from '../controllers/complex.controller.js';
import * as fieldController from '../controllers/field.controller.js';

const router = Router();

// --- DUEÑOS ---
// Agregamos verifyToken antes del controlador
router.post('/owners/register', verifyToken, ownerController.register);
router.get('/owners/profile', verifyToken, ownerController.getProfile);
router.put('/owners/profile', verifyToken, ownerController.updateProfile);

// --- COMPLEJOS ---
router.post('/complexes', verifyToken, complexController.create);
router.put('/complexes/:id', verifyToken, complexController.update);
router.get('/complexes/mine', verifyToken, complexController.listMine);
router.post('/complexes/:id/photos', verifyToken, complexController.addPhoto);
router.delete('/complexes/:id/photos/:index', verifyToken, complexController.deletePhoto);
router.get('/dashboard/stats', verifyToken, complexController.getStats);
router.get('/complexes/:id/reservations', verifyToken, complexController.getReservations);

// --- CANCHAS ---
router.post('/fields', verifyToken, fieldController.create);
router.put('/fields/:id', verifyToken, fieldController.update);
router.delete('/fields/:id', verifyToken, fieldController.remove);

export default router;