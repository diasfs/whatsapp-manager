import { Router } from 'express';
import {  Op } from 'sequelize';
import { Contact as ContactModel, Address as AddressModel, Tag as TagModel, WhatsappMessage as WhatsappMessageModel } from '../models/index.js';
import { Connections, getConnectionsByUserId } from '../connections.js';
import Message from 'whatsapp-web.js/src/structures/Message.js'

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

        /*
        try {
            for (let contact of contacts) {
                if (contact.WhatsappContact && (/^http/.exec(contact.WhatsappContact.profilePictureUrl) || contact.WhatsappContact.profilePictureUrl == '' || contact.WhatsappContact.profilePictureUrl === null)) {
                    await updateProfilePicUrl(contact.id, req.userId);
                }
            }

        } catch (err) {
            console.error(err);
        }
        */
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
        try {
            let messages = await WhatsappMessageModel.findAll({
                where: {
                    [Op.or]: [
                        {
                            to: contact.WhatsappContact.WhatsappId_serialized
                        },
                        {
                            from: contact.WhatsappContact.WhatsappId_serialized
                        },
                        {
                            author: contact.WhatsappContact.WhatsappId_serialized
                        },
                    ]
                }
            });
            contact.WhatsappMessages = messages;

        } catch (err) {

        }
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
        if (req.body.aniversario !== null && req.body.aniversario != '') {
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

router.get('/contatos/:id/mensagens', async (req, res) => {
    try {
        let contact = await ContactModel.findOne({
            where: {
                UserId: req.userId,
                id: req.params.id
            },
            include: ['WhatsappContact']
        });

        if (!contact) {
            throw new Error("Contato não encontrado.");
        }

        if (!contact.WhatsappContact) {
            throw new Error("Contato sem whatsapp");
        }
                
        let [connection] = Connections[req.userId];
        if (!connection) {
            throw new Error("Conexão não encontrada");
        }
        let client = connection.WhatsappClient;
        

        let WaContact = await client.getContactById(contact.WhatsappContact.WhatsappId_serialized);
        if (!WaContact) {
            throw new Error("WaContact não encontrado.");
        }

        let WaChat = await WaContact.getChat();
        if (!WaChat) {
            throw new Error("WaChat não encontrado.");
        }


        WaChat.loadCurrentMessages = async function () {
            let messages = await this.client.pupPage.evaluate(async (chatId) => {
                const msgFilter = m => !m.isNotification;
                const chat = window.Store.Chat.get(chatId);
                let msgs = chat.msgs.getModelsArray().filter(msgFilter);
                if (!msgs) {
                    msgs = []
                }
                return msgs.map(m => window.WWebJS.getMessageModel(m));

            }, this.id._serialized);
            return messages.map(m => new Message(this.client, m));;
        };
        WaChat.loadEarlierMessages = async function () {
            let messages = await this.client.pupPage.evaluate(async (chatId) => {
                const msgFilter = m => !m.isNotification;
                const chat = window.Store.Chat.get(chatId);
                let msgs = await window.Store.ConversationMsgs.loadEarlierMsgs(chat);
                if (!msgs || !msgs.length) {
                    msgs = [];
                }
                return msgs.filter(msgFilter).map(m => window.WWebJS.getMessageModel(m));

            }, this.id._serialized);
            return messages.map(m => new Message(this.client, m));;
        };


        let Messages = {
            async* [Symbol.asyncIterator]() {
                let messages = await WaChat.loadCurrentMessages();
                for(let msg of messages) {
                    yield msg
                }
                while(true) {
                    let messages = await WaChat.loadEarlierMessages();
                    if (!messages || !messages.length) {
                        break;
                    }
                    for (let msg of messages) {
                        yield msg
                    }
                }
            }
        }

        

        /*
        let messages = await WaChat.fetchMessages({
            limit: Number.MAX_SAFE_INTEGER
        });
        */
        let messages = [];
        let timestamp = new Date()
        timestamp.setDate(timestamp.getDate() -5);
        timestamp = Math.round(timestamp.getTime()/1000);
        
        for await (let msg of Messages) {
            if (null === msg) {
                return;
            }
            messages.push(msg);
            if (msg.timestamp < timestamp) {
                console.log(msg.timestamp, timestamp)
                break;
            }
        }

        res.json(messages);


    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message,
        });
    }
})

export default router;