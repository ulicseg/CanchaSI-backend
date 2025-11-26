import * as holdService from '../services/hold.service.js';

const firebaseConfig = {
  apiKey: "AIzaSyB-3VUg4HnPLcYaUcRJQ34WSC30J71xsGE",
  authDomain: "canchasi-backend.firebaseapp.com",
  projectId: "canchasi-backend",
  storageBucket: "canchasi-backend.firebasestorage.app",
  messagingSenderId: "554627659470",
  appId: "1:554627659470:web:94baeeb808177e778e429f",
  measurementId: "G-7K9SGLD1CF"
};

export const createHold = async (req, res) => {
  try {
    // ⚠️ SEGURIDAD: El userId viene del token, NO del body
    const userId = req.user.uid;
    
    // Solo tomamos los otros datos del body
    const { fieldId, date, time } = req.body;

    // Validaciones
    if (!fieldId || !date || !time) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: fieldId, date, time' 
      });
    }

    // Crear el hold con el userId seguro del token
    const hold = await holdService.createHold({
      fieldId,
      date,
      time,
      userId // ✅ Este ID viene del token decodificado, es seguro
    });

    return res.status(201).json({ success: true, data: hold });
  } catch (error) {
    console.error('Error creating hold:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
