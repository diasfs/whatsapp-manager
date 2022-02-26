import { connection } from './sequelize.js';
import Address from './Address.js';
import Contact from './Contact.js';
import Location from './Location.js';
import Tag from './Tag.js';
import User from './User.js';
import WhatsappConnection from './WhatsappConnection.js';
import WhatsappContact from './WhatsappContact.js';
import WhatsappLink from './WhatsappLink.js';
import WhatsappMessage from './WhatsappMessage.js';

//await connection.sync();

export {
    Address,
    Contact,
    Location,
    Tag,
    User,
    WhatsappConnection,
    WhatsappContact,
    WhatsappLink,
    WhatsappMessage,
    connection
}

export default {
    Address,
    Contact,
    Location,
    Tag,
    User,
    WhatsappConnection,
    WhatsappContact,
    WhatsappLink,
    WhatsappMessage,
    connection
}