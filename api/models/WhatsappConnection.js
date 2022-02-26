import { Model, DataTypes } from 'sequelize';
import { connection as sequelize } from './sequelize.js';
import WhatsappContact from './WhatsappContact.js';
import { Client } from "whatsapp-web.js";
import locateChrome from 'locate-chrome';

const executablePath = await locateChrome();

class WhatsappConnection extends Model {
    #client;
    qr;
    status;

    get WhatsappClient() {
        if (!this.#client) {
            this.#client = new Client({
                puppeteer: {
                    executablePath
                },
                clientId: this.id
            });
            this.#client.on('qr', qr => {
                this.qr = qr;
            });
            this.#client.on('ready', () => {
                console.log('ready');
            })
            this.#client.on('auth_failure', err => {
                console.log('auth_failure', err);
            });
            this.#client.on('authenticated', session => {
                console.log('authenticated', session);
            });
            this.#client.on('change_state', state => {
                console.log('change_state', state);
                this.state = state;
            });
            this.#client.on('disconnected', reason => {
                console.log('disconnected', reason);
            });
            this.#client.on('message', message => {
                console.log('message', message);
            });
            this.#client.on('message_ack', (message, ack) => {
                console.log('message ack', message, ack);
            });
            this.#client.on('message_create', message => {
                console.log('message_create', message);
            });
            this.#client.on('message_revoke_everyone', (message, revoked_msg) => {
                console.log('message_revoke_everyone', message, revoked_msg);
            });
            this.#client.on('message_revoke_me', message => {
                console.log('message_revoke_me', message);
            })
            this.#client.initialize();
        }
        return this.#client;
    }

}

WhatsappConnection.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING
    },
    pushname: {
        type: DataTypes.STRING
    },
    wid: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true,
    paranoid: true,
    sequelize
});


WhatsappConnection.hasOne(WhatsappContact);

export default WhatsappConnection;