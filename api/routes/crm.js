import { Router } from 'express';
import { Contact as ContactModel } from '../models/index.js';

const router = new Router();

router.get('/contatos', async (req, res) => {
    const contacts = await ContactModel.findAll({
        where: {
            UserId: req.userId
        },
        order: [['nome', 'ASC'],['sobrenome', 'asc']],
        include: 'WhatsappContact'
    });
    res.json(contacts);
});

export default router;