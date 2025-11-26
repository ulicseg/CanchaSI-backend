import express from 'express';
import cors from 'cors';
import playerRoutes from './routes/player.routes.js';
import matchmakingRoutes from './routes/matchmaking.routes.js';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.use('/players', playerRoutes);
app.use('/matchmaking', matchmakingRoutes);

export default app;