import { Router } from 'express';
import { ContactList as ContactListModel, Contact as ContactModel, WhatsappContact as WhatsappContactModel } from '../models/index.js';

const router = new Router();

router.get('/', async (req, res) => {
    try {
        let records = await ContactListModel.findAll({
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

router.get('/:id', async (req, res) => {
    try {
        let record = await ContactListModel.findOne({
            where: {
                id: req.params.id,
                UserId: req.userId
            },
            include: [{
                model: ContactModel,
                //include: [WhatsappContactModel],
                //attributes: ['id'],

                //through: {
                //    attributes: []
                //}

            }]
        });
        res.json(record.toJSON());
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

router.post('/save', async (req, res) => {
    try {
        let { id = '', nome = '', contact_count = 0, contact_ids = null } = req.body;
        let record;
        if (id) {
            record = await ContactListModel.findOne({
                where: {
                    id,
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
            if (!record) {
                throw new Error("Lista não encontrada.");
            }
        } else {
            console.log({ id })
            record = await ContactListModel.create({
                UserId: req.userId,
                contact_count: 0,
                nome
            })
            
        }
        
        if (nome) {
            record.nome = nome;
        }

        if (contact_count != 0) {
            record.contact_count = +contact_count;
        }

        if (contact_ids !== null) {
            let contacts = await ContactModel.findAll({
                where: {
                    id: contact_ids,
                    UserId: req.userId
                }
            });
            await record.setContacts(contacts);
            record.contact_count = await record.countContacts();
        }

        await record.save();
        res.json(record.toJSON());
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});

router.delete('/delete', async (req, res) => {
    try {
        let { ids = [] } = req.body;
        if (0 === ids.length) {
            throw new Error("Nenhum lista selecionada.");
        }

        ContactListModel.destroy({
            where: {
                id: ids
            }
        });

        res.json({
            success: true
        })
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
})

export default router;