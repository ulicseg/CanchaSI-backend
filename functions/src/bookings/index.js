import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
import availabilityRoutes from './routes/availability.routes.js';
import bookingsRoutes from './routes/hold.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import searchRoutes from './routes/search.routes.js';

app.use('/bookings', bookingsRoutes);
app.use('/search', searchRoutes);
app.use('/availability', availabilityRoutes);
app.use('/mp', paymentRoutes);

export default app;
