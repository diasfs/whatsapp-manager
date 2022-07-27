import { Router } from 'express';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import { subscribe, unsubscribe } from '../pubsub.js';

import { Contact as ContactModel, WhatsappContact as WhatsappContactModel, Transmission as TransmissionModel, ContactList as ContactListModel } from '../models/index.js';

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

router.get('/', async (req, res) => {
    try {
        let records = await TransmissionModel.findAll({
            where: {
                UserId: req.userId
            }
        });

        res.json(records);
    } catch (error) {
        res.status(500).json({
            error: err.message,
        });
    }
});

router.post('/create', async (req, res) => {
    try {
        let nome = req.body.nome || '';
        let contact_ids = req.body.contact_ids || null;
        let contact_list_ids = req.body.contact_list_ids || null;

        let transmission = await TransmissionModel.create({
            template: '',
            nome,
            UserId: req.userId
        });

        if (null !== contact_ids) {
            let contacts = await ContactModel.findAll({
                where: {
                    id: contact_ids,
                    UserId: req.userId
                }
            });
            await transmission.setContacts(contacts);
        }
        if (null !== contact_list_ids) {
            let lists = await ContactListModel.findAll({
                where: {
                    id: contact_list_ids,
                    UserId: req.userId
                }
            });
            await transmission.setContactLists(lists);
        }
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
                as: 'Contacts',
                //include: [WhatsappContactModel],
                attributes: ['id'],

                through: {
                    attributes: []
                }

            }, {
                model: ContactListModel,
                attributes: ['id'],
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

router.get('/:id/preview', async (req, res) => {
    try {
        let transmission = await TransmissionModel.findOne({
            where: {
                id: req.params.id,
                UserId: req.userId
            },
            include: [
                {
                    model: ContactModel,
                    as: 'Queue',
                    //attributes: ['id', 'nome', 'sobrenome', 'celular', 'telefone', 'email', 'instagram'],
                    attributes: ['id'],
                    /*
                    include: [{
                        model: WhatsappContactModel,
                        attributes: ['profilePictureUrl']
                    }],
                    through: {
                        attributes: ['status']
                    }
                    */
                }
            ],
            order: [
                [{model: ContactModel, as: 'Queue'}, 'nome', 'asc']
            ]
        });
        
        transmission = transmission.toJSON();

        

        
        

        res.json(transmission);
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
                {
                    model: ContactListModel,
                    through: {
                        attributes: []
                    }
                }
            ],
        });
        if (!transmission) {
            throw new Error("Mensagem não encontrada.");
        }
        if (req.body.template) {
            let template = req.body.template;
            transmission.template = template;
        }

        if (req.body.nome) {
            transmission.nome = req.body.nome;
        }


        let contact_ids = req.body.contact_ids || null;
        let queue = []
        let save_queue = false;
        if (null !== contact_ids) {
            let contacts = await ContactModel.findAll({
                where: {
                    id: contact_ids,
                    UserId: req.userId
                }
            });
            queue = [...contacts];
            await transmission.setContacts(contacts);
            save_queue = true;
        }



        let contact_list_ids = req.body.contact_list_ids || null;
        if (null !== contact_list_ids) {
            let lists = await ContactListModel.findAll({
                where: {
                    id: contact_list_ids,
                    UserId: req.userId
                },
                include: [
                    {
                        model: ContactModel,
                        through: {
                            attributes: []
                        }
                    }
                ]
            });
            await transmission.setContactLists(lists);
            let contacts = lists.map(l => l.Contacts).reduce((acc, contacts) => [...acc, ...contacts], []);
            queue = [...queue, ...contacts];
            save_queue = true;
        }

        if (save_queue) {
            let queue_ids = queue.map(({ id }) => id);
            queue_ids = [...new Set(queue_ids)];
            queue = queue_ids.map(id => queue.find(q => q.id == id));
            await transmission.setQueue(queue);
        }


       

        await transmission.save();
        res.json(transmission.toJSON());
    } catch (err) {
        res.status(500).json({
            error: err.message,
            err
        });
    }
});

router.post('/:id/upload', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), (req, res) => {
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

router.get('/:id/sse', async (req, res) => {
    const id = req.params.id;
    let transmission = await TransmissionModel.findByPk(id);
    

    if (!transmission) {
        return res.status(404).json({
            error: "Mensagem não encontrada",
        });
    }


    const headers = {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
    };

    res.writeHead(200, headers);


    const send = (event, data) => {
        res.write(`event:${event}\ndata: ${JSON.stringify(data)}\n\n`);
    }

    send('transmission.save', transmission);

    subscribe(`transmission.save[${id}]`, transmission => {
        send('transmission.save', transmission);
    });

    req.on("close", () => {
        unsubscribe(`transmission.save[${id}]`);
    });
})

router.delete('/', async (req, res, next) => {
    try {
        let UserId = req.userId;
        let { ids } = req.body;

        await TransmissionModel.destroy({
            UserId,
            id: ids
        });

        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        let UserId = req.userId;
        let { id } = req.params;

        await TransmissionModel.destroy({
            UserId,
            id
        });

        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

router.use(async (err, req, res, next) => {
    res.status(500).json({
        error: err.message
    })
})

export default router;