const { Router } = require('express');
const contactRouter = require('./contact.js');
const QRCode = require('qrcode');

const router = new Router();

router.get('/info', (req, res) => {
    try {
        let connection = req.Whatsapp;

        res.json(connection.info);
    } catch (err) {
        console.error('info', err);
        console.status(500).error(err);
    }
})

router.get('/state', async (req, res) => {
    try {
        let connection = req.Whatsapp;
        let status;
        try {
            status = await connection.client.getState();
        } catch (err) {
            status = err.message;
        }

        res.json({ state: connection.state, status });
    } catch (err) {
        console.error('state', err);
        console.status(500).error(err);
    }
});

router.get('/qr', (req, res) => {
    try {
        let connection = req.Whatsapp;

        res.json({ qr: connection.qr });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message })
    }
});

router.get('/screen', async (req, res) => {
    try {
        let connection = req.Whatsapp;
        let page = connection.client.pupPage;
        if (!page) {
            throw new Error("Screen not ready yet");
        }
        let buffer = await page.screenshot({
            type: 'jpeg',
            quality: 75,
        })
        res.set('Content-Type', 'image/jpeg').send(buffer);


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message })
    }
});

router.get('/qr/image', (req, res) => {
    let connection;
    try {
        connection = req.Whatsapp;
        if (!connection.qr) {
            throw new Error("QR code not ready yet");
        }

        QRCode.toFileStream(res, connection.qr);


    } catch (err) {
        res.status(500).json({ error: err.message, state: connection.state })
    }
});

router.get('/sse', async (req, res) => {
    try {
        console.log('sse');
        let connection = req.Whatsapp;
        let client = connection.client;
        const headers = {
            "Content-Type": "text/event-stream",
            Connection: "keep-alive",
            "Cache-Control": "no-cache",
        };
        res.writeHead(200, headers);

        const send = (evt, data) => {
            res.write(
                `event: ${evt}\ndata: ${JSON.stringify(data)}\n\n`
            );
        }

        console.log('sending state')
        send('state', { clientId: req.clientId, state: connection.state })
        if (connection.state == 'started' && connection.qr) {
            send('qr', { qr: connection.qr, clientId: req.clientId });
        }

        client.on("qr", (qr) => {
            console.log('qr')
            send('qr', { qr, clientId: req.clientId });
        });

        client.on('ready', () => {
            console.log('ready');
            send('ready', { clientId: req.clientId, info: client.info });
        });

        client.on('disconnected', () => {
            console.log('disconnected');
            send('diconnected', { clientId: req.clientId });
        })


        //res.json({ qr: client.qr });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message })
    }
});

router.get('/disconnect', async (req, res) => {
    try {
        let connection = req.Whatsapp;

        await connection.close();

        res.json({
            success: true,
            state: connection.state,
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message })
    }
});

router.get('/contacts', async (req, res) => {
    try {
        let connection = req.Whatsapp;
        if (connection.state != 'ready') {
            throw new Error("Not connected");
        }

        let contacts = (await connection.getContacts()).filter(contact => {
            if (contact.isGroup) {
                return false;
            }
            if (contact.isBlocked) {
                return false;
            }


            return true;
        });

        res.json(contacts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message })
    }
});

router.get('/number-id/:number', async (req, res, next) => {
    try {
        let connection = req.Whatsapp;
        if (connection.state != 'ready') {
            throw new Error("Not connected");
        }

        let number = req.params.number.replace(/\D+/igm, '');
        let id = await connection.getNumberId(number);

        res.json(id);
    } catch (err) {
        console.error('number',err);
        res.status(500).json({ error: err.message })
    }
});

router.get('/is-registered-user/:number', async (req, res) => {
    try {
        let connection = req.Whatsapp;
        if (connection.state != 'ready') {
            throw new Error("Not connected");
        }

        let number = req.params.number.replace(/\D+/igm, '');
        
        let id = await connection.getNumberId(number);
        
        let result = await connection.isRegisteredUser(id._serialized);
        
        res.json(result);
    } catch (err) {
        console.error('is_registered_user',err);
        res.status(500).json({ error: err.message })
    }
});

router.use('/contacts/:contact_id', async (req, res, next) => {
    try {
        let connection = req.Whatsapp;
        if (connection.state != 'ready') {
            throw new Error("Not connected");
        }


        let number = req.params.contact_id.replace(/\D+/igm, '')
        let id = await connection.getNumberId(number);
        let contact_id = id._serialized;
        req.params.contact_id = contact_id;


        let contact = await connection.getContactById(contact_id);
        if (!contact) {
            throw new Error("Contact not found");
        }
        req.contact = contact;
        next();
    } catch (err) {
        console.error('contacts',err);
        res.status(500).json({ error: err.message })
    }

}, contactRouter)



module.exports = router;