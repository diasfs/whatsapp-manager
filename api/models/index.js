import { connection } from './sequelize.js';
import Address from './Address.js';
import Contact from './Contact.js';
import ContactList from './ContactList.js';
import Location from './Location.js';
import Tag from './Tag.js';
import User from './User.js';
import WhatsappConnection from './WhatsappConnection.js';
import WhatsappContact from './WhatsappContact.js';
import WhatsappLink from './WhatsappLink.js';
import WhatsappMessage from './WhatsappMessage.js';
import Transmission from './Transmission.js';
import TransmissionContacts from './TransmissionContacts.js';
import TransmissionQueue from './TransmissionQueue.js';

await connection.sync();
//await Transmission.sync({ alter: true });

export {
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
    TransmissionContacts,
    TransmissionQueue,
    connection
}

export default {
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
    TransmissionContacts,
    TransmissionQueue,
    connection
}