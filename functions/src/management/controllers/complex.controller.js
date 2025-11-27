import * as complexService from '../services/complex.service.js';

// Helper para obtener ID seguro desde el token inyectado por el middleware
const getUserId = (req) => {
    return req.user && req.user.uid ? req.user.uid : null;
};

export const create = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ error: 'No autorizado' });
        const result = await complexService.createComplex(req.body, userId);
        res.status(201).json({ success: true, data: result });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const update = async (req, res) => {
    try {
        const result = await complexService.updateComplex(req.params.id, req.body);
        res.json({ success: true, data: result });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const listMine = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ error: 'No autorizado' });
        const result = await complexService.getMyComplexes(userId);
        res.json({ success: true, data: result });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const addPhoto = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ error: 'No autorizado' });
        const result = await complexService.addPhoto(req.params.id, req.body);
        res.json({ success: true, data: result });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const deletePhoto = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ error: 'No autorizado' });
        const result = await complexService.deletePhoto(req.params.id, req.params.index);
        res.json({ success: true, data: result });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getStats = async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ error: 'No autorizado' });
        const result = await complexService.getStats(userId);
        res.json({ success: true, data: result });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getReservations = async (req, res) => {
    try {
        const result = await complexService.getReservations(req.params.id);
        res.json({ success: true, data: result });
    } catch (e) { res.status(500).json({ error: e.message }); }
};