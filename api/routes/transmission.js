import { Router } from 'express';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

import { Contact as ContactModel, WhatsappContact as WhatsappContactModel, Transmission as TransmissionModel, TransmissionContacts as TransmissionContactsModel } from '../models/index.js';

//const upload = multer({ dest: 'uploads/' });
const storage = multer.diskStorage({
    destination(req, file, cb) {
        console.log(req.params);
        let folder = `uploads/transmission/${req.params.id}/`;
        fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);    
        
    }, 
    filename(req, file, cb) {
        let name = uuid() + '.' + file.originalname.split('.').pop();
        cb(null, name);
    }
})
const upload = multer({ storage });

//await TransmissionModel.sync({ alter: true})

const router = new Router();

router.post('/create', async (req, res) => {
    try {
        let contact_ids = req.body.contact_ids;
        let contacts = await ContactModel.findAll({
            where: {
                id: contact_ids,
                UserId: req.userId
            }
        });
        let transmission = await TransmissionModel.create({
            template: '',
            UserId: req.userId
        });

        await transmission.addContacts(contacts);
        await transmission.save();
        
        res.json(transmission.toJSON());
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        let transmission = await TransmissionModel.findOne({
            where: {
                id: req.params.id,
                UserId: req.userId
            },
            include: [{
                model: ContactModel,
                include: [WhatsappContactModel],
                through: {
                    attributes: []
                }
            }]
        });
        res.json(transmission.toJSON());
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.post('/:id/save', async (req, res) => {
    try {
        let transmission = await TransmissionModel.findOne({
            where: {
                id: req.params.id,
                UserId: req.userId,
            },
            include: [
                {
                    model: ContactModel,
                    include: [WhatsappContactModel],
                    through: {
                        attributes: [],
                    },
                },
            ],
        });
        if (!transmission) {
            throw new Error("Mensagem não encontrada.");
        }
        let template = req.body.template;
        transmission.template = template;
        await transmission.save();
        res.json(transmission.toJSON());
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});

router.post('/:id/upload', upload.fields([{name: 'image', maxCount: 1}, { name: 'file', maxCount: 1}]), (req, res) => {
    try {
        let file;
        if (req.files.file) {
            [file] = req.files.file
        }
        if (req.files.image) {
            [file] = req.files.image
        }
        
        res.json({
            success: 1,
            file: {
                ...file,
                //url: `${req.protocol}://${req.hostname}:${process.env.PORT}/${file.path}`,
                url: `${req.header('Origin')}/${file.path}`,
                title: file.originalname
            }
        })
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});


export default router;