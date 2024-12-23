import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';
import authRoutes from './routes/authRoutes.js';
import './config/passportConfig.js';
import stripeWebhook from './routes/stripeWebhook.js';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
app.use(express.json({ limit: '50mb' }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);
app.use('/api/v1/assistant', assistantRoutes);
app.use('/api/v1/auth', authRoutes);

app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello Helicon',
  });
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.set('socketio', io); // Guardar la instancia de socket.io en el objeto app

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    server.listen(8080, () => console.log('Server started on port 8080'));
  } catch (error) {
    console.log(error);
  }
};

startServer();
