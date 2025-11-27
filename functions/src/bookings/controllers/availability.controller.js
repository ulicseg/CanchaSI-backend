import * as availabilityService from '../services/availability.service.js';

export const getAvailability = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const { date, time } = req.query;

    if (!fieldId) {
      return res.status(400).json({ success: false, error: 'Field ID is required' });
    }

    if (!date) {
      return res.status(400).json({ success: false, error: 'Date query parameter is required (format: YYYY-MM-DD)' });
    }

    // Validar formato de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ success: false, error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const availability = await availabilityService.getFieldAvailability(fieldId, date, time);

    return res.status(200).json({ success: true, data: availability });
  } catch (error) {
    console.error('Error getting availability:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};