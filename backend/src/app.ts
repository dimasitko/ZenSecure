import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import discoverRoutes from './routes/discover.routes';
import interactionRoutes from './routes/interaction.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/interactions', interactionRoutes);

app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

export default app;