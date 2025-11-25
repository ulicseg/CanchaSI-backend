import * as ownerService from '../services/owner.service.js';

export const register = async (req, res) => {
    try {
        // En MVP usamos el body o un ID test si no hay auth real aún
        const uid = req.body.uid || 'user_admin_test'; 
        const result = await ownerService.registerOwner(uid, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

export const getProfile = async (req, res) => {
    try {
        const uid = req.user ? req.user.uid : 'user_admin_test';
        const result = await ownerService.getProfile(uid);
        res.json({ success: true, data: result });
    } catch (error) { res.status(500).json({ error: error.message }); }
};

export const updateProfile = async (req, res) => {
    try {
        const uid = req.user ? req.user.uid : 'user_admin_test';
        const result = await ownerService.updateProfile(uid, req.body);
        res.json({ success: true, data: result });
    } catch (error) { res.status(500).json({ error: error.message }); }
};