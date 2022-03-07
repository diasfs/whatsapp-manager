import { Model, DataTypes } from 'sequelize';
import { connection as sequelize } from './sequelize.js';
import WhatsappContact from './WhatsappContact.js';
import { Client as Client2 } from "whatsapp-web.js";
import LocalAuth from 'whatsapp-web.js/src/authStrategies/LocalAuth.js';

import locateChrome from 'locate-chrome';

class Client extends Client2 {
    async getProfilePicUrl(contactId) {
        const profilePic = await this.pupPage.evaluate(async (contactId) => {
            const chatWid = window.Store.WidFactory.createWid(contactId);
            let asyncPic = await window.Store.getProfilePicFull(chatWid).catch(
                () => {
                    return undefined;
                }
            );
            if (!asyncPic) {
                asyncPic = await window.Store.Wap.profilePicFind(
                    contactId
                ).catch(() => {
                    return undefined;
                });
            }
            return asyncPic;
        }, contactId);
        return profilePic ? profilePic.eurl : undefined;
    }
}

const executablePath = await locateChrome();

class WhatsappConnection extends Model {
    #client;
    qr;
    state;
    importing = false;

    get WhatsappClient() {
        if (!this.#client) {
            this.#client = new Client({
                puppeteer: {
                    executablePath,
                    /*
                    headless: false
                    */
                },
                authStrategy: new LocalAuth({
                    clientId: this.id,
                    dataPath: process.env.PUPPETER_DATA_PATAH||'./WWebJS/'
                })
            });
            this.#client.on('qr', async qr => {                
                this.state = 'DISCONNECTED';
                this.qr = qr;
            });
            this.#client.on('ready', async () => {                
                this.state = await this.#client.getState();
            })
            this.#client.on('auth_failure', err => {
                this.state = 'DISCONNECTED';
            });
            this.#client.on('change_state', state => {                
                this.state = state;
            });
            this.#client.on('disconnected', reason => {                
                this.state = 'DISCONNECTED';
            });
            this.#client.initialize();
        }
        return this.#client;
    }

    async logout() {
        if (!this.#client) {
            return;
        }
        await this.#client.logout();
        this.#client = null;
    }

    async disconnect() {
        await this.#client.destroy();
        this.#client = null;
        this.state = 'DISCONNECTED';
    }

    async getContacts() {        
        let client = this.WhatsappClient;
        if (this.state != 'CONNECTED') {
            return [];
        }

        return await client.getContacts();        
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
        type: DataTypes.STRING,
        get() {
            try {
                return JSON.parse(this.getDataValue('wid'));
            } catch (err) {
                return null;
            }
        },
        set(val) {
            this.setDataValue('wid',JSON.stringify(val));
        }
    }
}, {
    timestamps: true,
    paranoid: true,
    sequelize
});


WhatsappConnection.hasOne(WhatsappContact);

export default WhatsappConnection;