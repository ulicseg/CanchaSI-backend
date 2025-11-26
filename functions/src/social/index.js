import express from 'express';
import cors from 'cors';

// Importamos tus rutas
import playerRoutes from './routes/player.routes.js';

// import matchmakingRoutes from './routes/matchmaking.routes.js'; // Descomentar luego

const app = express();

// Configuración básica
app.use(cors({ origin: true }));
app.use(express.json());

// Definimos tus rutas base
app.use('/players', playerRoutes);

// Futuro: app.use('/matchmaking', matchmakingRoutes);

export default app;