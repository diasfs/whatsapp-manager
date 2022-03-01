import { Router } from 'express';
import { v4 as uuid } from 'uuid';

import WhatsappConnectionModel from '../models/WhatsappConnection.js';
import WhatsappContactModel from '../models/WhatsappContact.js'

const router = new Router();
let Connections = {};

WhatsappConnectionModel.findAll().then(connections => {
    for(let connection of connections) {
        if ('undefined' === typeof Connections[connection.UserId]) {
            Connections[connection.UserId] = [];
        }
        connection.state = 'OPENING';
        let client = connection.WhatsappClient;
        client.on('ready', async () => {
            connection.state = await client.getState();
        });
        client.on('auth_failure', msg => {
            connection.state = 'DISCONNECTED';
        });        
        client.on('qr', () => {
            connection.disconnect();
        });
        
        Connections[connection.UserId].push(connection);
    }    
});

router.get('/conexoes', async (req, res) => {
    if ('undefined' === typeof Connections[req.userId]) {
        return res.json([]);
    }
    
    let connections = [];
    for(let connection of Connections[req.userId]) {
        let c = connection.toJSON();
        c.state = connection.state;
        c.importing = connection.importing;
        let contact =await connection.getWhatsappContact();   
        if (contact) {
            c.Contact = contact.toJSON();
        }
        connections.push(c);     
    }
    
    return res.json(connections);
});

router.get('/conexao/:id', async (req, res) => {

});

router.get('/conexoes/nova', async (req, res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);
    const clientId = uuid();
    const connection = new WhatsappConnectionModel({
        id: clientId,
        UserId: req.userId
    });

    const client = connection.WhatsappClient;
    client.on('qr', qr => {
        const data = `data: ${JSON.stringify({qr})}\n\n`;
        res.write(data);
    });

    client.on('authenticated', () => {        
    })
    
    let ready = false;
    client.on('ready', async () => {
        connection.wid = client.info.wid;
        connection.pushname = client.info.pushname;
        console.log(connection.wid);
        let contact = await client.getContactById(connection.wid._serialized);
        connection.name = contact.name;
        await connection.save();

        let about = await contact.getAbout();
        let profilePictureUrl = await contact.getProfilePicUrl();

        let number = await contact.getFormattedNumber();

        await WhatsappContactModel.create({
            WhatsappConnectionId: connection.id,
            WhatsappId: contact.id,
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
            about,
            profilePictureUrl
        });

        if ('undefined' === typeof Connections[req.userId]) {
            Connections[req.userId] = []
        }
        Connections[req.userId].push(connection);

        ready = true;
        res.write(`event: authenticated\ndata: ${JSON.stringify({clientId})}\n\n`);
    })
    
    req.on('close', () => {
        if (!ready) {
            client.destroy();
        }
    });

});

router.get('/conexao/:id/reconectar', async (req, res) => {
    const connection_id = req.params.id;
    if (!Connections[req.userId]) {
        return res.status(404).json({
            error: "Conexão não encontrada"
        });
    }
    const connection = Connections[req.userId].find(connection => connection.id === connection_id);
    if (!connection) {
        return res.status(404).json({
            error: "Conexão não encontrada"
        });
    }

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    const client = connection.WhatsappClient;
    client.on('qr', qr => {
        const data = `data: ${JSON.stringify({qr})}\n\n`;
        res.write(data);
    });
    
    let ready = false;
    let clientId = connection.id;
    client.on('ready', async () => {                
        ready = true;
        res.write(`event: authenticated\ndata: ${JSON.stringify({clientId})}\n\n`);
    })
    
    req.on('close', () => {
        if (!ready) {
            connection.disconnect();
        }
    });
});

router.post('/conexao/:id/desconectar', async (req, res) => {
    const connection_id = req.params.id;
    if (!Connections[req.userId]) {
        return res.status(404).json({
            error: "Conexão não encontrada"
        });
    }
    const connection = Connections[req.userId].find(connection => connection.id === connection_id);
    if (!connection) {
        return res.status(404).json({
            error: "Conexão não encontrada"
        });
    }

    if (connection.state !== 'CONNECTED') {
        return res.status(400).json({
            error: 'Número não conectado'
        });
    }

    try {
        await connection.logout();
        res.json({
            message: 'Número desconectado com sucesso.'
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
})

router.delete('/conexao/:id', async (req, res) => {
    if ('undefined' === Connections[req.userId]) {
        return res.status(404).json({
            error: "Conexão não encontrada."
        });
    }
    const connection_id = req.params.id;

    let connection = Connections[req.userId].find(connection => connection.id == connection_id);
    if (!connection) {
        return res.status(404).json({
            error: "Conexão não encontrada."
        });
    }
    Connections[req.userId] = Connections[req.userId].filter(id => id !== connection_id);

    await connection.logout();
    connection.destroy();
});

router.post('/conexao/:id/importar-contatos', async (req, res) => {
    if ('undefined' === Connections[req.userId]) {
        return res.status(404).json({
            error: "Conexão não encontrada."
        });
    }
    const connection_id = req.params.id;

    let connection = Connections[req.userId].find(connection => connection.id == connection_id);
    if (!connection) {
        return res.status(404).json({
            error: "Conexão não encontrada."
        });
    }
    connection.importing = true;
    connection.getContacts().then(async contacts => {

    }).catch(err => {
        console.error(err.message);
    }).then(() => {
        connection.importing = false;
    });
    res.json({
        message: "Importando contatos"
    });
    
});


export default router;