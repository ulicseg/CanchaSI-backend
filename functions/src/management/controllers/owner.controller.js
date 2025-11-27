import * as ownerService from '../services/owner.service.js';

export const register = async (req, res) => {
    try {
        // Obtener el UID seguro desde el token inyectado por el middleware
        const uid = req.user && req.user.uid;
        if (!uid) return res.status(401).json({ error: 'No autorizado' });
        const result = await ownerService.registerOwner(uid, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

export const getProfile = async (req, res) => {
    try {
        const uid = req.user && req.user.uid;
        if (!uid) return res.status(401).json({ error: 'No autorizado' });
        const result = await ownerService.getProfile(uid);
        res.json({ success: true, data: result });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateProfile = async (req, res) => {
    try {
        const uid = req.user && req.user.uid;
        if (!uid) return res.status(401).json({ error: 'No autorizado' });
        const result = await ownerService.updateProfile(uid, req.body);
        res.json({ success: true, data: result });
    } catch (error) { res.status(500).json({ error: error.message }); }
};