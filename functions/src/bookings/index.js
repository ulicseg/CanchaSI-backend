import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
import availabilityRoutes from './routes/availability.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import favoritesRoutes from './routes/favorites.routes.js';
import holdRoutes from './routes/hold.routes.js';
import ownerRoutes from './routes/owner.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import searchRoutes from './routes/search.routes.js';

app.use('/bookings/hold', holdRoutes);
app.use('/search', searchRoutes);
app.use('/availability', availabilityRoutes);
app.use('/mp', paymentRoutes);
app.use('/bookings', bookingRoutes);
app.use('/owner', ownerRoutes);
app.use('/favorites', favoritesRoutes);

export default app;
