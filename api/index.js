import express from 'express';
import 'dotenv/config';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { connection } from './models/index.js'
import cors from 'cors';
import AuthMiddleware from './middlewares/auth.js';

import UserRouter from './routes/user.js';
import WhatsappRouter from './routes/whatsapp.js';
import CRMRouter from './routes/crm.js';
import TransmissionRouter from './routes/transmission.js';
import BackupRouter from './routes/backup.js';
import ContactListRouter from './routes/contact-list.js';
import TagsRouter from './routes/tags.js';
import { router as ConfigRouter } from './routes/config/index.js';


const __dirname = dirname(fileURLToPath(import.meta.url));
const __rootdir = dirname(__dirname);
const __publicdir = path.join(__rootdir, 'public');
const __uploaddir = process.env.UPLOAD_DIR || path.join(__rootdir, 'uploads');


const app = express();

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
})

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__publicdir));
app.use('/uploads', express.static(__uploaddir));

app.get('/api', (req, res) => {
    res.json({
        message: "Hello World"
    });
});

app.use('/api/user', UserRouter);
app.use('/api/whatsapp', AuthMiddleware, WhatsappRouter);
app.use('/api/crm', AuthMiddleware, CRMRouter);
app.use('/api/transmission', AuthMiddleware, TransmissionRouter);
app.use('/api/contact-list', AuthMiddleware, ContactListRouter);
app.use('/api/tags', AuthMiddleware, TagsRouter);
app.use('/api/backup', BackupRouter);
app.use('/api/config', ConfigRouter);

app.use((err, req, res, next) => {
    res.status(500).json({
        error: err.message
    })
})

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0'
app.listen(PORT, HOST, () => {
    console.log(`Server listen to ${HOST}:${PORT}`)
});

