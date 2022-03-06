import { Router } from 'express';
import { Contact as ContactModel } from '../models/index.js';
import { Connections, getConnectionsByUserId } from '../connections.js';

const router = new Router();

router.get('/contatos', async (req, res) => {
    const contacts = await ContactModel.findAll({
        where: {
            UserId: req.userId
        },
        order: [['nome', 'ASC'],['sobrenome', 'asc']],
        include: 'WhatsappContact'
    });
    /*
    let [connection] = getConnectionsByUserId(req.userId);
    let client = connection.WhatsappClient;
    for (let contact of contacts) {
        let { nome, celular, WhatsappContact } = contact;
        if ('' == nome || !nome) {
            client.getNumberId(celular).then(async id => {
                
                if (null === id) {
                    return;
                }
                let wacontact = await client.getContactById(id._serialized);
                let { name, pushname, shortName, verifiedName} = wacontact;
                let nome;
                let sobrenome;
                try {
                    [nome, ...sobrenome] = (
                        name ||
                        pushname ||
                        shortName ||
                        verifiedName || 
                        ''
                    ).split(/\s+/gim);
                    if ('string' != typeof sobrenome) {
                        sobrenome = sobrenome.join(" ");
                    }
                    if (nome !== '') {
                        contact.nome = nome;
                        contact.sobrenome = sobrenome;
                        await contact.save();
                        WhatsappContact.name = name;
                        WhatsappContact.pushname = pushname
                        WhatsappContact.shortName = shortName,
                        WhatsappContact.verifiedName = verifiedName
                        await WhatsappContact.save();
                    }
                    
                    console.log(wacontact)
                } catch (err) {
                    console.log(err.message, {sobrenome}, typeof sobrenome);
                }
            });
        }
    }
    */
    res.json(contacts);
});

export default router;