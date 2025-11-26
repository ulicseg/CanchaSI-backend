import express from 'express';
import { getComplexById, listComplexes } from '../controllers/search.controller.js';

const router = express.Router();

// GET /search/complexes - Listar todos los complejos
router.get('/complexes', listComplexes);

// GET /search/complexes/:id - Obtener detalle de un complejo
router.get('/complexes/:id', getComplexById);

export default router;
