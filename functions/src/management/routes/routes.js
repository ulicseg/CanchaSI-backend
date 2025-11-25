import { Router } from 'express';
import * as ownerController from '../controllers/owner.controller.js';
import * as complexController from '../controllers/complex.controller.js';
import * as fieldController from '../controllers/field.controller.js';

const router = Router();

// --- DUEÑOS ---
router.post('/owners/register', ownerController.register);
router.get('/owners/profile', ownerController.getProfile);
router.put('/owners/profile', ownerController.updateProfile);

// --- COMPLEJOS ---
router.post('/complexes', complexController.create);
router.put('/complexes/:id', complexController.update);
router.get('/complexes/mine', complexController.listMine);
router.post('/complexes/:id/photos', complexController.addPhoto);
router.delete('/complexes/:id/photos/:index', complexController.deletePhoto);
router.get('/dashboard/stats', complexController.getStats);
router.get('/complexes/:id/reservations', complexController.getReservations);

// --- CANCHAS ---
router.post('/fields', fieldController.create);
router.put('/fields/:id', fieldController.update);
router.delete('/fields/:id', fieldController.remove);

export default router;