import { Router } from 'express';
import fs from 'fs/promises';
import * as url from 'url';
import path from 'path';

const root = path.dirname(path.dirname(url.fileURLToPath(new URL('.', import.meta.url))));

import {
    Address,
    Contact,
    ContactList,
    Location,
    Tag,
    User,
    WhatsappConnection,
    WhatsappContact,
    WhatsappLink,
    WhatsappMessage,
    Transmission,
    TransmissionContacts
} from '../models/index.js'

const router = new Router();

router.get('/generate', async (req, res) => {
    let address = await Address.findAll();
    let contact = await Contact.findAll();
    let contactList = await ContactList.findAll();
    let location = await Location.findAll();
    let tag = await Tag.findAll();
    let transmission = await Transmission.findAll();
    let transmissionContacts = await TransmissionContacts.findAll();
    let user = await User.findAll();
    let whatsappConnection = await WhatsappConnection.findAll();
    let whatsappContact = await WhatsappContact.findAll();
    let whatsappLink = await WhatsappLink.findAll();
    let whatsappMessage = await WhatsappMessage.findAll();

    let data = {
        address,
        contact,
        contactList,
        location,
        tag,
        transmission,
        transmissionContacts,
        user,
        whatsappConnection,
        whatsappContact,
        whatsappLink,
        whatsappMessage
    }

    
    await fs.mkdir(`${root}/backup`, { recursive: true });
    let filename = (new Date()).toJSON()+'.json';
    await fs.writeFile(`${root}/backup/${filename}`, JSON.stringify(data));
    res.json(data);
});

router.get('/address', async (req, res) => {
    let rows = await Address.findAll();
    res.json(rows);
});

router.get('/contact', async (req, res) => {
    let rows = await Contact.findAll();
    res.json(rows);
});

router.get('/contact-list', async (req, res) => {
    let rows = await ContactList.findAll();
    res.json(rows);
});

router.get('/location', async (req, res) => {
    let rows = await Location.findAll();
    res.json(rows);
});

router.get('/tag', async (req, res) => {
    let rows = await Tag.findAll();
    res.json(rows);
});

router.get('/transmission', async (req, res) => {
    let rows = await Transmission.findAll();
    res.json(rows);
});

router.get('/transmission-contacts', async (req, res) => {
    let rows = await TransmissionContacts.findAll();
    res.json(rows);
});

router.get('/user', async (req, res) => {
    let rows = await User.findAll();
    res.json(rows);
});

router.get('/whatsapp-connection', async (req, res) => {
    let rows = await WhatsappConnection.findAll();
    res.json(rows);
});

router.get('/whatsapp-contact', async (req, res) => {
    let rows = await WhatsappContact.findAll();
    res.json(rows);
});

router.get('/whatsapp-link', async (req, res) => {
    let rows = await WhatsappLink.findAll();
    res.json(rows);
});

router.get('/whatsapp-message', async (req, res) => {
    let rows = await WhatsappMessage.findAll();
    res.json(rows);
});

export default router;