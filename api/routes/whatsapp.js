import { Router } from "express";
import { v4 as uuid } from "uuid";
import MessageMedia from "whatsapp-web.js/src/structures/MessageMedia.js";
import { Connections, Events as ConnectionsEvents } from "../connections.js";
import { WhatsappContact } from '../models/index.js';
import EventSource from 'eventsource';
import axios from 'axios';

import fs from 'fs/promises';
import * as url from 'url';
import path from 'path';

const root = path.dirname(path.dirname(url.fileURLToPath(new URL('.', import.meta.url))));

import {
    WhatsappConnection as WhatsappConnectionModel,
    WhatsappContact as WhatsappContactModel,
    Contact as ContactModel,
    Transmission as TransmissionModel,
    Tag as TagModel
} from "../models/index.js";

const router = new Router();
/*
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
            try {
                connection.state = await client.getState();
            } catch (err) {
                console.error(err);
            }
        });
        client.on("auth_failure", (msg) => {
            connection.state = "DISCONNECTED";
        });
        client.on("qr", () => {
            connection.disconnect();
        });

        Connections[connection.UserId].push(connection);
    }
    //console.log(Connections);
    ConnectionsEvents.emit("updated");
});
*/
/*
const updateContacts = async () => {
    console.log('atualizando')
    let contacts = await WhatsappContact.findAll();
    for (let contact of contacts) {
        contact.WhatsappId_serialized = contact.WhatsappId._serialized;
        await contact.save();
    }
    console.log('atualizado');
}
updateContacts().then(() => {
    console.log('terminou')
}).catch(err => {
    console.error('nao deu')
    console.error(err.message);
});
*/

router.get("/conexoes", async (req, res) => {
    //console.log(req.userId);
    try {
        let connections = await WhatsappConnectionModel.findAll({
            where: {
                UserId: req.userId
            },
            include: [
                WhatsappContactModel
            ]
        });
        let Connections = [];
        for(let connection of connections) {
            let { data: {state, status} } = await axios.get(`http://wapi:3000/${connection.id}/state`);
            if (state == 'started' && status == null) {
                status = 'DISCONNECTED'
            }
            console.log({ state, status })
            Connections.push({
                ...connection.toJSON(),
                Contact: connection.WhatsappContact ? connection.WhatsappContact.toJSON() : null,
                state: status,
                status: state
            })
        }
        /*
        connections = connections.map(connection => {


            return {
                ...connection.toJSON(),
                Contact: connection.WhatsappContact?connection.WhatsappContact.toJSON():null
            }
        })
        */


        res.json(Connections);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
    /*
    if ("undefined" === typeof Connections[req.userId]) {
        return res.json([]);
    }

    let connections = [];

    const updateProfilePicUrl = async (connection) => {
        try {
            let client = connection.WhatsappClient;
            if ('CONNECTED' !== connection.state) {
                await new Promise((resolve, reject) => {
                    client.on('ready', resolve);
                    client.on("disconnected", reject);
                    client.on("auth_failure", reject);
                });
            }

            let contact = await client.getContactById(connection.wid._serialized);
            let profilePictureUrl = await contact.getProfilePicUrl();
            if (profilePictureUrl) {
                connection.WhatsappContact.profilePictureUrl = profilePictureUrl;
                await connection.WhatsappContact.save();
            }
        } catch (err) {
            console.log(err);
        }
    };

    for (let connection of Connections[req.userId]) {
        try {
            let c = connection.toJSON();
            c.state = connection.state;
            c.importing = connection.importing;
            c.import_percentual = 0;

            if (connection.WhatsappContact) {
                updateProfilePicUrl(connection);
                c.Contact = connection.WhatsappContact.toJSON();
                //console.log({ profilePictureUrl });
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
        } catch (err) {
            console.error(err);
        }
    }
    //    console.log(connections);
    return res.json(connections);
    */
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
    connection.save();

    let events = new EventSource(`http://wapi:3000/${clientId}/sse`);
    events.on('error', console.error)
    let axiosClient = axios.create({
        baseURL: `http://wapi:3000/${clientId}`
    });

    events.addEventListener('data', console.log);
    events.addEventListener('qr', evt => {
        console.log('qr', evt);
        let { qr } = JSON.parse(evt.data);
        const data = `data: ${JSON.stringify({ qr })}\n\n`;
        res.write(data);
    })
    events.addEventListener('ready', async () => {
        try {
            console.log('ready');
            let { data: info } = await axiosClient.get('info');
            let { wid, pushname } = info;
            connection.wid = wid;
            connection.pushname = pushname;
            let { data: contact } = await axiosClient.get(`contacts/${wid._serialized}`);
            connection.name = contact.name;
            await connection.save();

            let { data: { about } } = await axiosClient.get(`contacts/${wid._serialized}/about`);
            let { data: { profilePictureUrl } } = await axiosClient.get(`contacts/${wid._serialized}/profile-picture`);
            let { data: { number } } = await axiosClient.get(`contacts/${wid._serialized}/formatted-number`);

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
                profilePictureUrl
            });
            res.write(
                `event: authenticated\ndata: ${JSON.stringify({ clientId })}\n\n`
            );

        } catch (err) {
            if (err.response && err.response.data) {
                console.error(err.response.data);
            } else {
                console.error(err);
            }
            res.write(
                `event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`
            );
        }


    });
    req.on('close', () => {
        events.close();
    })

    /*
    const client = connection.WhatsappClient;
    client.on("qr", (qr) => {
        const data = `data: ${JSON.stringify({ qr })}\n\n`;
        res.write(data);
    });
    */
    /*
    client.on("authenticated", () => {
        console.log("authenticated");
    });

    let ready = false;
    client.on("ready", async () => {
        try {
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
            ConnectionsEvents.emit("updated");
            ConnectionsEvents.emit("new_connection", connection);

            ready = true;
            res.write(
                `event: authenticated\ndata: ${JSON.stringify({ clientId })}\n\n`
            );

        } catch (err) {
            console.error(err);
        }
    });
    req.on("close", () => {
        if (!ready) {
            try {
                client.destroy();

            } catch (err) {
                console.error(err);
            }
        }
    });
    */
});


router.get("/conexao/:id", async (req, res) => {
    try {
        let connection_id = req.params.id;

        let connection = await WhatsappConnectionModel.findOne({
            where: {
                id: connection_id,
                UserId: req.userId
            },
            include: [WhatsappContactModel]
        });

        if (!connection) {
            return res.status(404).json({
                error: "Conexão não encontrada.",
            });
        }

        let { data: { state, status } } = await axios.get(`http://wapi:3000/${connection.id}/state`);

        let c = connection.toJSON();
        c.state = status;
        c.importing = connection.importing;
        c.import_percentual = connection.import_percentual;
        c.Contact = connection.WhatsappContact.toJSON();

        /*

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
        */
        /*
        let contact = await connection.getWhatsappContact();
        if (contact) {
            c.Contact = contact.toJSON();
        }
        */
        res.json(c);
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
});


router.get("/conexao/:id/reconectar", async (req, res) => {
    const connection_id = req.params.id;
    let connection = await WhatsappConnectionModel.findByPk(connection_id);
    if (!connection) {
        return res.status(404).json({
            error: "Conexão não encontrada",
        });
    }
    /*
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
    */

    const headers = {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
    };
    res.writeHead(200, headers);

    let events = new EventSource(`http://wapi:3000/${connection_id}/sse`);

    events.addEventListener('qr', evt => {
        let { qr } = JSON.parse(evt.data);
        const data = `data: ${JSON.stringify({ qr })}\n\n`;
        res.write(data);
    })
    events.addEventListener('ready', async () => {        
        res.write(
            `event: authenticated\ndata: ${JSON.stringify({ connection_id })}\n\n`
        );
        
    });

    req.on('close', () => {
        events.close();
    });
    /*
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
                console.log('not ready disconnecting')
                connection.disconnect();
            }
        });
    */
});

router.post("/conexao/:id/desconectar", async (req, res) => {
    try {
        const connection_id = req.params.id;
    
        let connection = await WhatsappConnectionModel.findByPk(connection_id);
        if (!connection) {
            return res.status(404).json({
                error: "Conexão não encontrada",
            });
        }
    
        let axiosClient = axios.create({
            baseURL: `http://wapi:3000/${connection_id}`
        });
    
        await connection.disconnect();
        await connection.updateState();

        setTimeout(() => {
            res.json({
                message: "Número desconectado com sucesso.",
            });
        }, 3000)

    } catch (err) {
        res.status(500).json({
            error: error.message,
        });
    }


    /*
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
        console.log('desconectando')
        await connection.logout();
        res.json({
            message: "Número desconectado com sucesso.",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
    */
});

router.delete("/conexao/:id", async (req, res) => {
    try {
        let connection_id = req.params.id;
        let connection = await WhatsappConnectionModel.findOne({
            where: {
                id: connection_id,
                UserId: req.userId
            }
        });
        if (!connection) {
            return res.status(404).json({
                error: "Conexão não encontrada.",
            });
        }
        
        await connection.disconnect();
        await connection.destroy();
        
        res.json({
            message: "conexão removida com sucesso.",
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
    /*
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
        ({ id }) => id !== connection_id
    );

    try {
        console.log('deleting')
        await connection.logout();
    } catch (err) {
        console.error(err);
    }
    try {
        console.log('deleting')
        connection.destroy();
    } catch (err) {
        console.error(err);
    }
    ConnectionsEvents.emit("updated");
    ConnectionsEvents.emit("connection_removed", connection);
    res.json({
        message: "conexão removida com sucesso.",
    });
    */
});

router.post("/conexao/:id/importar-contatos", async (req, res) => {
    let connection;
    const connection_id = req.params.id;
    try {
        connection = await WhatsappConnectionModel.findOne({
            where: {
                UserId: req.userId,
                id: connection_id
            }
        })
        /*
        if ("undefined" === Connections[req.userId]) {
            return res.status(404).json({
                error: "Conexão não encontrada.",
            });
        }

        connection = Connections[req.userId].find(
            (connection) => connection.id == connection_id
        );
        console.log('connection found');
 
        if (!connection) {
            return res.status(404).json({
                error: "Conexão não encontrada.",
            });
        }
        */


        let tag = await TagModel.findOne({
            where: {

                UserId: req.userId,
                name: 'Whatsapp'
            }
        });
        if (!tag) {
            tag = await TagModel.create({
                UserId: req.userId,
                name: 'Whatsapp'
            });
        }

        connection.import_percentual = 0;
        connection.importing = true;
        let imported = 0;
        let rows = await connection.getContacts();


        //await fs.writeFile(`${root}/backup/contatos.json`, JSON.stringify(rows));

        rows = rows.filter(row => {
            if (row.isGroup) return false;
            if (row.isBlocked) return false;
            if (!row.isUser) return false;
            if (!row.isWAContact) { return false };
            if ('undefined' != typeof row.name) return true;
            if ('undefined' != typeof row.pushname) return true;
            if ('undefined' != typeof row.shortName) return true;
            if ('undefined' != typeof row.verifiedName) return true;

            return false;
        });

        for (let row of rows) {


            let [number = '', profilePictureUrl = '', about = ''] = await Promise.all([
                connection.getFormattedNumber(row.id._serialized),
                connection.getProfilePictureUrl(row.id._serialized),
                connection.getAbout(row.id._serialized)
            ]);


            let [contact, created] = await ContactModel.findOrCreate({
                where: {
                    celular: number,
                    UserId: req.userId,
                },
                defaults: {
                    celular: number,
                    UserId: req.userId,
                },
            });



            let nome;
            let sobrenome;
            try {
                [nome, ...sobrenome] = (
                    row.name ||
                    row.pushname ||
                    row.shortName ||
                    row.verifiedName ||
                    ""
                ).split(/\s+/gim);
                if ("string" != typeof sobrenome) {
                    sobrenome = sobrenome.join(" ");
                }
            } catch (err) {
                console.error(err.message, row);
            }


            contact.nome = nome;
            contact.sobrenome = sobrenome;
            contact.biografia = about;
            await contact.save();

            contact.addTag(tag);


            let wacontact = await WhatsappContactModel.findOne({
                where: {
                    number,
                    ContactId: contact.id
                }
            });
            if (!wacontact) {
                wacontact = await WhatsappContactModel.create({
                    number,
                    ContactId: contact.id
                });
            }

            
            wacontact.set({
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
                pushname: row.pushname,
                shortName: row.shortName,
                verifiedName: row.verifiedName
            });

            wacontact.save();

            imported++;
            connection.import_percentual = Math.round(
                (imported / rows.length) * 100
            );
        }

        res.json({
            message: `contatos importados com sucesso.`,
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
    connection.importing = false;
});

router.post("/transmission/:id/send", async (req, res) => {
    let transmission;
    try {
        transmission = await TransmissionModel.findOne({
            where: {
                id: req.params.id,
                UserId: req.userId,
            },
            include: [
                {
                    model: ContactModel,
                    as: 'Queue',
                    //include: [WhatsappContactModel],
                }
            ],
        });
        if (!transmission) {
            throw new Error("Mensagem não encontrada.");
        }
        let connection = await WhatsappConnectionModel.findByPk(req.body.connection_id);
        if (!connection) {
            throw new Error("Número selecionado para envio não encontrado");
        }
        await connection.updateState();
        if ('CONNECTED' != connection.state) {
            throw new Error("O número selecionado para envio não encontra-se conectado.");
        }        

        if (transmission.Queue.length == 0) {
            throw new Error("Lista vazia.");
        }

        if (!transmission.template || !transmission.template.blocks || transmission.template.blocks.length == 0) {
            console.log(transmission.template);
            throw new Error("Mensagem vazia.");
        }

        transmission.status == 'ENVIANDO';
        transmission.pendentes = transmission.Queue.length;
        await transmission.save();


        res.json(transmission.toJSON());

        for (let contact of transmission.Queue) {
            if (contact.TransmissionQueue.status != 'Pendente') {
                continue;
            }

            try {
                await contact.updateProfile();
                let wacontact = await contact.getWhatsappContact();

                if (!wacontact) {
                    throw new Error("Contato sem Whatsapp")
                }
                console.log(wacontact);
                contact.WhatsappContact = wacontact;

                let blocks = transmission.template.blocks.map(block => {
                    let row = { ...block };
                    if (row.type == 'paragraph') {
                        row.data = { ...row.data };
                        row.data.text = (row.data.text||'')
                            .replace(/\{\{\s*nome\s*\}\}/igm, contact.nome || '')
                            .replace(/\{\{\s*sobrenome\s*\}\}/igm, contact.sobrenome || '')
                            .replace(/\{\{\s*telefone\s*\}\}/igm, contact.telefone || '')
                            .replace(/\{\{\s*celular\s*\}\}/igm, contact.celular || '')
                            .replace(/\{\{\s*email\s*\}\}/igm, contact.email || '')
                            .replace(/\{\{\s*instagram\s*\}\}/igm, contact.instagram || '')
                            .replaceAll('&nbsp;', '');
                    }
                    /*
                    if (row.type == 'attaches') {
                        if (/\.(mp3|wav|ogg)$/.test(row.data.file.name)) {
                            row.type = 'audio'
                        }
                        if (/\.(mp4|mpeg4|avi|mkv|mpeg)$/.test(row.data.file.name)) {
                            row.type = 'video'
                        }
                    }
                    */
                    return row
                });

                for (let block of blocks) {
                    if (block.type === "paragraph") {
                        let text = block.data.text;

                        await connection.sendMessage(
                            contact.WhatsappContact.WhatsappId._serialized,
                            text
                        );
                    }
                    if (block.type === "image") {
                        let url = block.data.file.url;
                        await connection.sendMessageMedia(contact.WhatsappContact.WhatsappId._serialized, null, null, null, url, {
                            caption: block.data.caption,
                            sendVideoAsGif: true
                        })
                        //let url = block.data.file.url.replace(/^.+\/uploads/igm, `${root}/uploads`);
                        //let media = await MessageMedia.fromUrl(url);
                        /*
                        let media = await MessageMedia.fromFilePath(url);
                        if (/\.gif$/.test(url)) {
                            media.isGif = true;
                            media.mimetype = 'image/gif';
                        }
                        //await chat.sendMessage(media);
                        await client.sendMessage(
                            contact.WhatsappContact.WhatsappId._serialized,
                            media,
                            {
                                caption: block.data.caption,
                                sendVideoAsGif: true
                            }
                        );
                        */
                    }
                    if (block.type === "attaches") {
                        let url = block.data.file.url;
                        await connection.sendMessageMedia(contact.WhatsappContact.WhatsappId._serialized, null, null, null, url, {
                            sendAudioAsVoice: true,
                            caption: block.data.title,
                        })
                        //let url = block.data.file.url.replace(/^.+\/uploads/igm, `${root}/uploads`);
                        //let media = await MessageMedia.fromUrl(url);
                        //let media = await MessageMedia.fromFilePath(url);
                        //await chat.sendMessage(media);
                        /*
                        await client.sendMessage(
                            contact.WhatsappContact.WhatsappId._serialized,
                            media,
                            {
                                sendAudioAsVoice: true,
                                caption: block.data.title,
                            }
                        );
                        */
                    }
                }

                // set status to Enviado
                contact.TransmissionQueue.status = 'Enviado';
                await contact.TransmissionQueue.save();
                transmission.enviadas++;
                transmission.pendentes--;
                await transmission.save();
            } catch (err) {
                // set status to Erro
                console.error(err);
                contact.TransmissionQueue.status = 'Erro';
                contact.TransmissionQueue.error = err.message;
                await contact.TransmissionQueue.save();

                transmission.erros++;
                transmission.pendentes--;
                await transmission.save();
            }
        }

        transmission.status = 'ENVIADA';
        await transmission.save();


    } catch (err) {
        console.error(err);
        if (transmission && transmission.status == 'ENVIANDO') {
            try {
                transmission.status = 'INTERROMPIDA';
                await transmission.save();
            } catch (err) {
                console.error(err);
            }
        }
        res.status(500).json({
            error: err.message,
        });
    }
});


export default router;
