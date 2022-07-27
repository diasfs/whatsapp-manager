const { Router } = require('express');
const MessageMedia = require('whatsapp-web.js/src/structures/MessageMedia.js');
const Location = require('whatsapp-web.js/src/structures/Location.js');
const List = require('whatsapp-web.js/src/structures/List.js');
const Buttons = require('whatsapp-web.js/src/structures/Buttons.js');
const fs = require('fs/promises');
const path = require('path');
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
const { v4: uuid } = require('uuid');

const ffmpeg = createFFmpeg({ log: true });

const convertUrl2MessageMedia = async url => {
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }
    let filename = uuid();
    ffmpeg.FS('writeFile', filename + '.gif', await fetchFile(url));
    await ffmpeg.run('-i', filename + '.gif', '-r', '10', '-movflags', 'faststart', '-pix_fmt', 'yuv420p', filename + '.mp4');
    await fs.writeFile('/tmp/' + filename + '.mp4', ffmpeg.FS('readFile', filename + '.mp4'));
    let message = await MessageMedia.fromFilePath('/tmp/' + filename + '.mp4');
    await fs.unlink('/tmp/' + filename + '.mp4');
    return message;
}

const router = new Router();

router.get('/', (req, res) => {
    res.json(req.contact);
});

router.get('/profile-picture', async (req, res) => {
    try {
        let picture = await req.contact.getProfilePicUrl();
        res.json({ picture })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        })
    }
});

router.get('/about', async (req, res) => {
    try {
        let about = await req.contact.getAbout();
        res.json({ about })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        })
    }
});

router.get('/formatted-number', async (req, res) => {
    try {
        let number = await req.contact.getFormattedNumber();
        res.json({ number })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        })
    }
});
router.get('/chat', async (req, res) => {
    try {
        let chat = await req.contact.getChat();
        res.json(chat)
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
});
router.get('/messages', async (req, res) => {
    try {
        let chat = await req.contact.getChat();
        if (!chat) {
            chat = await req.Whatsapp.client.getChatById(req.contact.id._serialized);
        }
        if (!chat) {
            throw new Error("Chat not found");
        }

        let messages = await chat.fetchMessages({
            limit: Number.MAX_SAFE_INTEGER
        });

        res.json(messages);
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
});

router.post('/message', async (req, res) => {
    try {
        let { content = '', options = {} } = req.body;
        options = {
            ...options,
            sendAudioAsVoice: true,
        }

        let message = await req.Whatsapp.sendMessage(req.contact.id._serialized, content, options);

        res.json(message);
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
});

router.post('/message-media', async (req, res) => {
    try {
        let { mimetype, data, filename = null, url = null, options = {} } = req.body;
        options = {
            ...options,
            sendAudioAsVoice: true,
            //sendVideoAsGif: true,

        }


        let messageMedia;
        if (url) {
            //messageMedia = await MessageMedia.fromFilePath('./test.mp4');
            if (/\.gif/igm.test(url)) {
                messageMedia = await convertUrl2MessageMedia(url);
            } else {
                messageMedia = await MessageMedia.fromUrl(url);
                if (/^video/igm.test(messageMedia.mimetype)) {
                    messageMedia = await convertUrl2MessageMedia(url);
                }
            }
        } else {
            messageMedia = new MessageMedia(mimetype, data, filename);
        }
        //messageMedia.mimetype = 'image/gif';


        let message = await req.Whatsapp.sendMessage(req.contact.id._serialized, messageMedia, options);

        res.json(message);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message,
            line: err.line
        })
    }
});
router.post('/location', async (req, res) => {
    try {
        let { latitude, longitude, description, options = {} } = req.body;
        options = {
            ...options,
            sendAudioAsVoice: true,
        }

        let location = new Location(latitude, longitude, description)

        let message = await req.Whatsapp.sendMessage(req.contact.id._serialized, location, options);

        res.json(message);
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
});

router.post('/list', async (req, res) => {
    try {
        let { body, buttonText, sections, title = null, footer = null, options = {} } = req.body;
        options = {
            ...options,
            sendAudioAsVoice: true,
        }

        let list = new List(body, buttonText, sections, title)

        let message = await req.Whatsapp.sendMessage(req.contact.id._serialized, list, options);

        res.json(message);
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
});

router.post('/buttons', async (req, res) => {
    try {
        let { body = null, buttons, url = null, title = null, footer = null, options = {} } = req.body;
        options = {
            ...options,
            sendAudioAsVoice: true,
        }

        if (url) {
            body = await MessageMedia.fromUrl(url);
        }


        let msgButtons = new Buttons(body, buttons, title, footer);
        msgButtons.headerType = 2;
        let message = await req.Whatsapp.sendMessage(req.contact.id._serialized, msgButtons, options);

        res.json(message);
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
});


module.exports = router;