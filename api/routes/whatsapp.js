import { Router } from "express";
import { v4 as uuid } from "uuid";
import MessageMedia from "whatsapp-web.js/src/structures/MessageMedia.js";
import { Connections, Events as ConnectionsEvents } from '../connections.js';

import {
    WhatsappConnection as WhatsappConnectionModel,
    WhatsappContact as WhatsappContactModel,
    Contact as ContactModel,
    Transmission as TransmissionModel,
} from "../models/index.js";

const router = new Router();


WhatsappConnectionModel.findAll({
    include: "WhatsappContact",
}).then((connections) => {
    for (let connection of connections) {
        if ("undefined" === typeof Connections[connection.UserId]) {
            Connections[connection.UserId] = [];
        }
        connection.state = "OPENING";
        let client = connection.WhatsappClient;
        client.on("ready", async () => {
            connection.state = await client.getState();            
        });
        client.on("auth_failure", (msg) => {
            connection.state = "DISCONNECTED";
        });
        client.on("qr", () => {
            connection.disconnect();
        });

        Connections[connection.UserId].push(connection);
    }
    console.log(Connections);
    ConnectionsEvents.emit('updated');
});

router.get("/conexoes", async (req, res) => {
    console.log(req.userId)
    if ("undefined" === typeof Connections[req.userId]) {
        return res.json([]);
    }

    let connections = [];
    for (let connection of Connections[req.userId]) {
        let c = connection.toJSON();
        c.state = connection.state;
        c.importing = connection.importing;
        c.import_percentual = 0;

        if (connection.WhatsappContact) {
            c.Contact = connection.WhatsappContact.toJSON();
        } else {
            let Contact = await connection.getWhatsappContact();
            if (!Contact) {
                let client = connection.WhatsappClient;
                let contact = await client.getContactById(
                    connection.wid._serialized
                );
                let about = await contact.getAbout();
                let profilePictureUrl = await contact.getProfilePicUrl();

                let number = await contact.getFormattedNumber();

                Contact = await WhatsappContactModel.create({
                    WhatsappConnectionId: connection.id,
                    WhatsappId: contact.id,
                    businessProfile: contact.businessProfile,
                    isBlocked: contact.isBlocked,
                    isBusiness: contact.isBusiness,
                    isEnterprise: contact.isEnterprise,
                    isGroup: contact.isGroup,
                    isUser: contact.isUser,
                    isWAContact: contact.isWAContact,
                    name: contact.name,
                    number: number,
                    pushname: contact.pushname,
                    shortName: contact.shortName,
                    verifiedName: contact.verifiedName,
                    about,
                    profilePictureUrl,
                });
            }
            c.Contact = Contact.toJSON();
        }
        connections.push(c);
    }
    console.log(connections)
    return res.json(connections);
});

router.get("/conexao/:id", async (req, res) => {
    let connection_id = req.params.id;
    if ("undefined" === typeof Connections[req.userId]) {
        return res.status(404).json({
            error: "Conexão não encontrada.",
        });
    }
    let connection = Connections[req.userId].find(
        (c) => c.id === connection_id
    );
    if (!connection) {
        return res.status(404).json({
            error: "Conexão não encontrada.",
        });
    }

    let c = connection.toJSON();
    c.state = connection.state;
    c.importing = connection.importing;
    c.import_percentual = connection.import_percentual;
    if (connection.WhatsappContact) {
        c.Contact = connection.WhatsappContact.toJSON();
    } else {
        let Contact = await connection.getWhatsappContact();
        if (!Contact) {
            let client = connection.WhatsappClient;
            let contact = await client.getContactById(
                connection.wid._serialized
            );
            let about = await contact.getAbout();
            let profilePictureUrl = await contact.getProfilePicUrl();

            let number = await contact.getFormattedNumber();

            Contact = await WhatsappContactModel.create({
                WhatsappConnectionId: connection.id,
                WhatsappId: contact.id,
                businessProfile: contact.businessProfile,
                isBlocked: contact.isBlocked,
                isBusiness: contact.isBusiness,
                isEnterprise: contact.isEnterprise,
                isGroup: contact.isGroup,
                isUser: contact.isUser,
                isWAContact: contact.isWAContact,
                name: contact.name,
                number: number,
                pushname: contact.pushname,
                shortName: contact.shortName,
                verifiedName: contact.verifiedName,
                about,
                profilePictureUrl,
            });
        }
        c.Contact = Contact.toJSON();
    }
    /*
    let contact = await connection.getWhatsappContact();
    if (contact) {
        c.Contact = contact.toJSON();
    }
    */
    res.json(c);
});

router.get("/conexoes/nova", async (req, res) => {
    const headers = {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
    };
    res.writeHead(200, headers);
    const clientId = uuid();
    const connection = new WhatsappConnectionModel({
        id: clientId,
        UserId: req.userId,
    });

    const client = connection.WhatsappClient;
    client.on("qr", (qr) => {
        const data = `data: ${JSON.stringify({ qr })}\n\n`;
        res.write(data);
    });

    client.on("authenticated", () => {
        console.log('authenticated');
    });

    let ready = false;
    client.on("ready", async () => {
        connection.wid = client.info.wid;
        connection.pushname = client.info.pushname;
        
        let contact = await client.getContactById(connection.wid._serialized);
        connection.name = contact.name;
        await connection.save();

        let about = await contact.getAbout();
        let profilePictureUrl = await contact.getProfilePicUrl();

        let number = await contact.getFormattedNumber();

        connection.WhatsappContact = await WhatsappContactModel.create({
            WhatsappConnectionId: connection.id,
            WhatsappId: contact.id,
            businessProfile: contact.businessProfile,
            isBlocked: contact.isBlocked,
            isBusiness: contact.isBusiness,
            isEnterprise: contact.isEnterprise,
            isGroup: contact.isGroup,
            isUser: contact.isUser,
            isWAContact: contact.isWAContact,
            name: contact.name,
            number: number,
            pushname: contact.pushname,
            shortName: contact.shortName,
            verifiedName: contact.verifiedName,
            about,
            profilePictureUrl,
        });

        if ("undefined" === typeof Connections[req.userId]) {
            Connections[req.userId] = [];
        }
        Connections[req.userId].push(connection);
        ConnectionsEvents.emit('updated');
        ConnectionsEvents.emit('new_connection', connection);

        ready = true;
        res.write(
            `event: authenticated\ndata: ${JSON.stringify({ clientId })}\n\n`
        );
    });
    req.on("close", () => {
        if (!ready) {
            client.destroy();
        }
    });
});

router.get("/conexao/:id/reconectar", async (req, res) => {
    const connection_id = req.params.id;
    if (!Connections[req.userId]) {
        return res.status(404).json({
            error: "Conexão não encontrada",
        });
    }
    const connection = Connections[req.userId].find(
        (connection) => connection.id === connection_id
    );
    if (!connection) {
        return res.status(404).json({
            error: "Conexão não encontrada",
        });
    }

    const headers = {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
    };
    res.writeHead(200, headers);

    const client = connection.WhatsappClient;
    client.on("qr", (qr) => {
        const data = `data: ${JSON.stringify({ qr })}\n\n`;
        res.write(data);
    });

    let ready = false;
    let clientId = connection.id;
    client.on("ready", async () => {
        ready = true;
        res.write(
            `event: authenticated\ndata: ${JSON.stringify({ clientId })}\n\n`
        );
    });

    req.on("close", () => {
        if (!ready) {
            connection.disconnect();
        }
    });
});

router.post("/conexao/:id/desconectar", async (req, res) => {
    const connection_id = req.params.id;
    if (!Connections[req.userId]) {
        return res.status(404).json({
            error: "Conexão não encontrada",
        });
    }
    const connection = Connections[req.userId].find(
        (connection) => connection.id === connection_id
    );
    if (!connection) {
        return res.status(404).json({
            error: "Conexão não encontrada",
        });
    }

    if (connection.state !== "CONNECTED") {
        return res.status(400).json({
            error: "Número não conectado",
        });
    }

    try {
        await connection.logout();
        res.json({
            message: "Número desconectado com sucesso.",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

router.delete("/conexao/:id", async (req, res) => {
    if ("undefined" === Connections[req.userId]) {
        return res.status(404).json({
            error: "Conexão não encontrada.",
        });
    }
    const connection_id = req.params.id;

    let connection = Connections[req.userId].find(
        (connection) => connection.id == connection_id
    );
    if (!connection) {
        return res.status(404).json({
            error: "Conexão não encontrada.",
        });
    }
    Connections[req.userId] = Connections[req.userId].filter(
        ({id}) => id !== connection_id
    );

    await connection.logout();
    connection.destroy();
    ConnectionsEvents.emit('updated');
    ConnectionsEvents.emit('connection_removed', connection);
    res.json({
        message: "conexão removida com sucesso."
    })

});

router.post("/conexao/:id/importar-contatos", async (req, res) => {
    if ("undefined" === Connections[req.userId]) {
        return res.status(404).json({
            error: "Conexão não encontrada.",
        });
    }
    const connection_id = req.params.id;
    

    let connection = Connections[req.userId].find(
        (connection) => connection.id == connection_id
    );

    if (!connection) {
        return res.status(404).json({
            error: "Conexão não encontrada.",
        });
    }
    connection.import_percentual = 0;
    connection.importing = true;
    let imported = 0;
    
    connection
        .getContacts()
        .then(async (rows) => {            


            for (let row of rows) {
                if (!row.isWAContact || !row.isUser) {                    
                    continue;
                }

                let number = await row.getFormattedNumber();

                let [contact, created] = await ContactModel.findOrCreate({
                    where: {
                        celular: number,
                        UserId: req.userId,
                    },
                    defaults: {
                        celular: number,
                        UserId: req.userId
                    }
                });
                
                                
                let profilePictureUrl = '';

                
                let nome;
                let sobrenome;
                try {
                    [nome, ...sobrenome] = (
                        row.name ||
                        row.pushname ||
                        row.shortName ||
                        row.verifiedName || 
                        ''
                    ).split(/\s+/gim);
                    if ('string' != typeof sobrenome) {
                        sobrenome = sobrenome.join(" ");
                    }

                } catch (err) {
                    console.log(err.message, row);
                }

                let about = await row.getAbout();

                contact.nome = nome;
                contact.sobrenome = sobrenome;
                contact.biografia = about;
                await contact.save();


                try {
                    profilePictureUrl = await row.getProfilePicUrl();
                } catch (err) {
                    console.error(err);
                }

                let [wacontact, wacontact_created] =
                await WhatsappContactModel.findOrCreate({
                    where: {
                        number,
                        ContactId: contact.id,
                    },
                    defaults: {
                        about,
                        profilePictureUrl,
                        WhatsappId: row.id,
                        businessProfile: row.businessProfile,
                        isBlocked: row.isBlocked,
                        isBusiness: row.isBusiness,
                        isEnterprise: row.isEnterprise,
                        isGroup: row.isGroup,
                        isUser: row.isUser,
                        isWAContact: row.isWAContact,
                        name: row.name,
                        number: number,
                        pushname: row.pushname,
                        shortName: row.shortName,
                        verifiedName: row.verifiedName,
                        ContactId: contact.id,
                    },
                });
                if (wacontact.profilePictureUrl != profilePictureUrl) {
                    wacontact.profilePictureUrl = profilePictureUrl;
                    wacontact.save();
                }

                imported++;
                connection.import_percentual = Math.round(imported / rows.length * 100);
            }


            res.json({
                message: `contatos importados com sucesso.`,
            });
        })
        .catch((err) => {
            console.error(err.message);
            res.status(500).json({
                error: err.message,
            });
        })
        .then(() => {
            connection.importing = false;
        });
});


router.post("/transmission/:id/send", async (req, res) => {
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
        let template = transmission.template
        let [connection] = Connections[req.userId];

        let client = connection.WhatsappClient;
        for (let contact of transmission.Contacts) {
            //let wacontact = await client.getContactById(contact.WhatsappContact.WhatsappId._serialized);
            /*
            console.log(wacontact);
            if (!wacontact) {
                continue;
            }
            let chat = await wacontact.getChat();
            if (!chat) {
                continue;
            }
            console.log(chat)
            */

            for (let block of template.blocks) {
                if (block.type === 'paragraph') {
                    let text = block.data.text;
                    //await chat.sendMessage(text);
                    await client.sendMessage(contact.WhatsappContact.WhatsappId._serialized, text)
                }
                if (block.type === 'image') {
                    let url = block.data.file.url;
                    let media = await MessageMedia.fromUrl(url);
                    //await chat.sendMessage(media);
                    await client.sendMessage(contact.WhatsappContact.WhatsappId._serialized, media, {
                        caption: block.data.caption
                    })
                }
                if (block.type === 'attaches') {
                    let url = block.data.file.url;
                    let media = await MessageMedia.fromUrl(url);
                    //await chat.sendMessage(media);
                    await client.sendMessage(
                        contact.WhatsappContact.WhatsappId._serialized,
                        media,
                        {
                            sendAudioAsVoice: true,
                            caption: block.data.title
                        }
                    );
    
                }
            }            
        }
        
        res.json(transmission.toJSON());
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});

export default router;
