import 'dotenv/config'

import path, { dirname } from 'path';
import { fileURLToPath } from 'url';


const __dirname = dirname(fileURLToPath(import.meta.url));
const __rootdir = dirname(__dirname);
const __publicdir = path.join(__rootdir, 'public');
const __uploaddir = process.env.UPLOAD_DIR || path.join(__rootdir, 'uploads');
const __backupdir = process.env.UPLOAD_DIR || path.join(__rootdir, 'backup');


let data = await import(`${__backupdir}/01.json`, { assert: { type: 'json'}}).then(e => e.default)
//console.log(data);
import { 
    User as UserModel,
    Address,
    Contact,
    ContactList,
    Location,
    Tag,
    Transmission,
    TransmissionContacts,
    WhatsappConnection,
    WhatsappContact,
    WhatsappLink,
    WhatsappMessage

} from './models/index.js';
/*
await UserModel.bulkCreate(data.user);
await Transmission.bulkCreate(data.transmission);
Address.bulkCreate(data.address);
Contact.bulkCreate(data.contact);
ContactList.bulkCreate(data.contactList);
Location.bulkCreate(data.location);
Tag.bulkCreate(data.tag);
TransmissionContacts.bulkCreate(data.transmissionContacts);
WhatsappConnection.bulkCreate(data.whatsappConnection);
WhatsappContact.bulkCreate(data.whatsappContact);
WhatsappLink.bulkCreate(data.whatsappLink);
WhatsappMessage.bulkCreate(data.whatsappMessage);
*/