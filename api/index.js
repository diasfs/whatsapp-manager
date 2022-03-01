import express from 'express';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { connection } from './models/index.js'
import AuthMiddleware from './middlewares/auth.js';

import UserRouter from './routes/user.js';
import WhatsappRouter from './routes/whatsapp.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const __rootdir = dirname(__dirname);
const __publicdir = path.join(__rootdir,'public');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__publicdir));

app.get('/api', (req, res) => {
    res.json({
        message: "Hello World"
    });
});

app.use('/api/user', UserRouter);
app.use('/api/whatsapp', AuthMiddleware, WhatsappRouter);

const PORT = process.env.PORT||3000
const HOST = process.env.HOST||'0.0.0.0'
app.listen(PORT, HOST, () => {
    console.log(`Server listen to ${HOST}:${PORT}`)
});
