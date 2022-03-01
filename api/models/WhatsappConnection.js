import { Model, DataTypes } from 'sequelize';
import { connection as sequelize } from './sequelize.js';
import WhatsappContact from './WhatsappContact.js';
import { Client } from "whatsapp-web.js";
import locateChrome from 'locate-chrome';

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
                    headless: false
                },
                clientId: this.id
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

        let rows = await client.getContacts();
        let contacts = [];
        for(let row of rows) {
            let about = await row.getAbout();
            let profilePictureUrl = '';
            try {
                profilePictureUrl = await row.getProfilePicUrl();
            } catch (err) {
                console.log(err.message, row.name, row.pushname);
            }
            let number = await row.getFormattedNumber();
            let contact = new WhatsappContact({
                about,
                profilePictureUrl,
                WhatsappId: row.id,
                isBlocked: row.isBlocked,
                isBusinesss: row.isBusiness,
                isEnterprise: row.isEnterprise,
                isGroup: row.isGroup,
                isUser: row.isUser,
                isWaContact: row.isWaContact,
                name: row.name,
                number: number,
                pushname: row.pushname,
                shortName: row.shortName
            });
            contacts.push(contact);
        }
        return contacts;
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
            return JSON.parse(this.getDataValue('wid'));
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