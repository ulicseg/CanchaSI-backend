import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors({ origin: true }));

// Aquí irán las rutas de bookings

export default app;
