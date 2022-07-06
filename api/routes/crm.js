import { Router } from 'express';
import { Contact as ContactModel, Address as AddressModel, Tag as TagModel } from '../models/index.js';
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
            include: [
                'WhatsappContact',
                {
                    model: TagModel,
                    through: {
                        attributes: []
                    }
                }
            ],
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
                if (contact.WhatsappContact && (/^http/.exec(contact.WhatsappContact.profilePictureUrl) || contact.WhatsappContact.profilePictureUrl == '' || contact.WhatsappContact.profilePictureUrl === null)) {
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
            include: ['WhatsappContact', 'Address', 'Tags'],
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

router.post('/contatos/save', async (req, res) => {
    try {
        let record;
        if (req.body.id) {
            record = await ContactModel.findByPk(req.body.id, {
                include: ['Tags', AddressModel]
            });
        } else {
            record = await ContactModel.create({
                UserId: req.userId,
            }, {
                include: ['Tags', AddressModel]
            });
        }

        if (req.body.nome !== null) {
            record.nome = req.body.nome;
        }
        if (req.body.sobrenome !== null) {
            record.sobrenome = req.body.sobrenome;
        }
        if (req.body.empresa !== null) {
            record.empresa = req.body.empresa;
        }
        if (req.body.cargo !== null) {
            record.cargo = req.body.cargo;
        }
        if (req.body.email !== null) {
            record.email = req.body.email;
        }
        if (req.body.facebook !== null) {
            record.facebook = req.body.facebook;
        }
        if (req.body.instagram !== null) {
            record.instagram = req.body.instagram;
        }
        if (req.body.celular !== null) {
            record.celular = req.body.celular;
        }
        if (req.body.telefone !== null) {
            record.telefone = req.body.telefone;
        }
        if (req.body.aniversario !== null) {
            record.aniversario = req.body.aniversario;
        }
        if (req.body.Address) {
            if (!record.Address) {
                await record.createAddress({
                    ...req.body.Address
                });
            } else {
                record.Address.set({
                    ...req.body.Address
                });
                await record.Address.save();
            }
        }

        if (req.body.Tags) {
            for(let row of req.body.Tags) {
                if (!!row.id) {
                    continue;
                }
                let tag = await TagModel.findOne({
                    where: {
                        UserId: req.userId,
                        name: row.name
                    }
                });
                console.log(tag, row.name)
                if (!tag) {
                    tag = await TagModel.create({
                        UserId: req.userId,
                        name: row.name
                    })
                    
                }
                if (tag) {
                    row.id = tag.id;
                }
            }
            let ids = req.body.Tags.map(({ id }) => id);
            ids = [...new Set(ids)];
            console.log({ ids })
            console.log(req.body.Tags)
            if (0 != ids.length) {
                let tags = await TagModel.findAll({
                    where: {
                        UserId: req.userId,
                        id: ids
                    }
                });
                await record.setTags(tags);
            }
        }

        await record.save();
        res.json(record);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
})

router.delete('/contatos/delete', async (req, res) => {
    try {
        let { ids = [] } = req.body;
        if (0 === ids.length) {
            throw new Error("Nenhum contato selecionado.");
        }

        ContactModel.destroy({
            where: {
                UserId: req.userId,
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