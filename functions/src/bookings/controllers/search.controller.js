import * as searchService from '../services/search.service.js';

export const listComplexes = async (req, res) => {
  try {
    const { ownerId, name, limit } = req.query;
    const complexes = await searchService.listComplexes({ ownerId, name, limit });
    return res.status(200).json({ success: true, data: complexes });
  } catch (error) {
    console.error('Error listing complexes:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getComplexById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Complex ID is required' });
    }
    const complex = await searchService.getComplexById(id);
    if (!complex) {
      return res.status(404).json({ success: false, error: 'Complex not found' });
    }
    return res.status(200).json({ success: true, data: complex });
  } catch (error) {
    console.error('Error getting complex:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
