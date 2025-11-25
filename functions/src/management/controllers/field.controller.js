import * as fieldService from '../services/field.service.js';

export const create = async (req, res) => {
    try {
        const result = await fieldService.createField(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await fieldService.updateField(id, req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await fieldService.removeField(id);
        res.json({ success: true, message: "Cancha eliminada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};