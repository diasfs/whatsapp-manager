import { Router } from 'express';
import { Contact as ContactModel } from '../models/index.js';
import { Connections, getConnectionsByUserId } from '../connections.js';

const router = new Router();

const updateProfile = async (contactId, user_id) => {
    try {
        let Contact = await ContactModel.findOne({
            where: {
                id: contactId,
            },
            include: "WhatsappContact",
        });
        if (!Contact) {
            throw new Error("Contact not found");
        }

        let [connection] = getConnectionsByUserId(user_id);
        let client = connection.WhatsappClient;
        if ("CONNECTED" !== connection.state) {
            await new Promise((resolve, reject) => {
                client.on("ready", resolve);
                client.on("disconnected", reject);
                client.on("auth_failure", reject);
            });
        }

        let celular = (await client.getFormattedNumber(Contact.celular)).replace(/\D+/igm, '');
        console.log({ celular });
        let id = await await client.getNumberId(celular);
        console.log({
            id,
            celular
        })
        if (null === id) {
            //throw new Error("WAContact not found")
            id = {
                _serialized: celular + '@c.us'
            }
            //id = celular
        }
        let is_registred_user = await client.isRegisteredUser(id._serialized);
        console.log({ is_registred_user });
        let contact = await client.getContactById(id._serialized);
        if (!contact) {
            console.log({
                id,
                celular
            })
        }
        return contact;



    } catch (error) {
        console.error(error);
    }
    return null;
}

const updateProfilePicUrl = async (contactId, user_id) => {
    try {
        let Contact = await ContactModel.findOne({
            where: {
                id: contactId,
            },
            include: "WhatsappContact",
        });
        if (!Contact) {
            return;
        }

        let [connection] = getConnectionsByUserId(user_id);
        let client = connection.WhatsappClient;
        if ("CONNECTED" !== connection.state) {
            await new Promise((resolve, reject) => {
                client.on("ready", resolve);
                client.on("disconnected", reject);
                client.on("auth_failure", reject);
            });
        }

        let id = await client.getNumberId(Contact.celular);
        if (null === id) {
            return;
        }
        let contact = await client.getContactById(id._serialized);
        let profilePictureUrl = await contact.getProfilePicUrl();
        if (profilePictureUrl) {
            Contact.WhatsappContact.profilePictureUrl = profilePictureUrl;
            await Contact.WhatsappContact.save();
        }



    } catch (error) {
        console.error(error);
    }
};

router.get('/contatos', async (req, res) => {
    try {

        const contacts = await ContactModel.findAll({
            where: {
                UserId: req.userId
            },
            order: [['nome', 'ASC'], ['sobrenome', 'asc']],
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

        try {
            for (let contact of contacts) {
                if (/^http/.exec(contact.WhatsappContact.profilePictureUrl) || contact.WhatsappContact.profilePictureUrl == '' || contact.WhatsappContact.profilePictureUrl === null) {
                    await updateProfilePicUrl(contact.id, req.userId);
                }
            }

        } catch (err) {
            console.error(err);
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/contatos/:id', async (req, res) => {

    
    try {
        let contact = await ContactModel.findOne({
            //logging: console.log,
            //attributes: ['id','nome','sobrenome'],
            where: {

                id: req.params.id,
                UserId: req.userId,
            },
            include: 'WhatsappContact'
        });
        contact = contact.toJSON();
        //contact.wa = await updateProfile(contact.id, req.userId);
        //console.log(contact.wa);
        res.json(contact);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
    
});

export default router;