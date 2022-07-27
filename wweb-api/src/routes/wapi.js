const { Router } = require('express');
const Clients = require('../Clients.js');
const WhatsappRouter = require('./whatsapp.js');
const express = require('express');
const path = require('path');

const router = Router();

public_dir = path.join(path.dirname(path.dirname(__dirname)),'public');
router.use(express.static(public_dir))


router.get('/instances', async (req, res) => {
    try {
        let instances = [];

        for (let connection of Object.values(Clients.wids)) {
            let client = connection.client;

            let page = client.pupPage;
            let instance = {
                wid: connection.wid,
                session_id: connection.session_id,
                state: connection.state,
                qr: connection.qr,
                info: connection.info
            }

            if (page) {
                try {
                    let screen = await page.screenshot({
                        type: 'jpeg',
                        quality: 75,
                        encoding: 'base64'
                    });
                    instance.screen = screen
                } catch (err) {
                    console.error(err);
                }
            }

            instances.push(instance);
        }

        res.json(instances);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        })
    }
})

router.use('/:id', async (req, res, next) => {
    try {
        let client = await Clients.getById(req.params.id);
        req.clientId = req.params.id;
        req.Whatsapp = client;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: err.message
        })
    }
}, WhatsappRouter);




module.exports = router;