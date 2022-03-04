import express from 'express';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { connection } from './models/index.js'
import cors from 'cors';
import AuthMiddleware from './middlewares/auth.js';

import UserRouter from './routes/user.js';
import WhatsappRouter from './routes/whatsapp.js';
import CRMRouter from './routes/crm.js';
import TransmissionRouter from './routes/transmission.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const __rootdir = dirname(__dirname);
const __publicdir = path.join(__rootdir,'public');
const __uploaddir = path.join(__rootdir,'uploads');

console.log(__uploaddir)

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__publicdir));
app.use('/uploads',express.static(__uploaddir));

app.get('/api', (req, res) => {
    res.json({
        message: "Hello World"
    });
});

app.use('/api/user', UserRouter);
app.use('/api/whatsapp', AuthMiddleware, WhatsappRouter);
app.use('/api/crm', AuthMiddleware, CRMRouter);
app.use('/api/transmission', AuthMiddleware, TransmissionRouter);

const PORT = process.env.PORT||3000
const HOST = process.env.HOST||'0.0.0.0'
app.listen(PORT, HOST, () => {
    console.log(`Server listen to ${HOST}:${PORT}`)
});

