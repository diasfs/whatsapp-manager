import { Model, DataTypes } from "sequelize";
import { connection as sequelize } from "./sequelize.js";

import WhatsappContact from "./WhatsappContact.js";
import WhatsappMessage from "./WhatsappMessage.js";
import WhatsappLink from "./WhatsappLink.js";

import { Client as Client2 } from "whatsapp-web.js";
import LocalAuth from "whatsapp-web.js/src/authStrategies/LocalAuth.js";
import fs from "fs";
import Path, { dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import { v4 as uuid } from "uuid";

const __dirname = dirname(fileURLToPath(import.meta.url));
const __rootdir = dirname(dirname(__dirname));
const __publicdir = Path.join(__rootdir, "public");
const __uploaddir = process.env.UPLOAD_DIR || Path.join(__rootdir, "uploads");

import locateChrome from "locate-chrome";

class Client extends Client2 {
    async getProfilePicUrl(contactId) {
        const profilePic = await this.pupPage.evaluate(async (contactId) => {
            try {
                const chatWid = window.Store.WidFactory.createWid(contactId);
                return await window.Store.ProfilePic.profilePicFind(chatWid);
            } catch (err) {
                if (err.name === "ServerStatusCodeError") return undefined;
                throw err;
            }
        }, contactId);

        if (profilePic && profilePic.eurl) {
            const url = profilePic.eurl;
            const path = Path.resolve(
                __uploaddir,
                "images/",
                contactId + ".jpg"
            );
            const writer = fs.createWriteStream(path);

            const resp = await axios({
                url,
                method: "GET",
                responseType: "stream",
            });

            resp.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
            });

            return "uploads/images/" + contactId + ".jpg";
        }

        return profilePic ? profilePic.eurl : undefined;
    }
    async getProfilePicUrl2(contactId) {
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

        if (profilePic && profilePic.eurl) {
            const url = profilePic.eurl;
            const path = Path.resolve(
                __uploaddir,
                "images/",
                contactId + ".jpg"
            );
            const writer = fs.createWriteStream(path);

            const resp = await axios({
                url,
                method: "GET",
                responseType: "stream",
            });

            resp.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
            });

            return "uploads/images/" + contactId + ".jpg";
        }

        return profilePic ? profilePic.eurl : undefined;
    }
}

let executablePath = null;
if (process.env.CHROME_EXECUTABLE_PATH) {
    executablePath = process.env.CHROME_EXECUTABLE_PATH;
} else if (process.env.LOCATE_CHROME) {
    executablePath = await locateChrome();
}

class WhatsappConnection extends Model {
    #client;
    qr;
    state;
    importing = false;

    get WhatsappClient() {
        if (!this.#client) {
            console.log('creating client');
            this.#client = new Client({
                puppeteer: {
                    executablePath,
                    args: [
                        "--disable-gpu",
                        "--disable-dev-shm-usage",
                        "--disable-setuid-sandbox",
                        "--no-sandbox",
                    ],

                    headless: process.env.HEADLESS=='true',
                },
                authStrategy: new LocalAuth({
                    clientId: this.id,
                    dataPath: process.env.PUPPETER_DATA_PATH || "./WWebJS/",
                }),
            });
            this.#client.on("qr", async (qr) => {
                console.log('disconnected');
                this.state = "DISCONNECTED";
                this.qr = qr;
            });
            this.#client.on("ready", async () => {
                console.log('client ready')
                this.state = await this.#client.getState();
            });
            this.#client.on("auth_failure", (err) => {
                console.log('disconnected');
                this.state = "DISCONNECTED";
            });
            this.#client.on("change_state", (state) => {
                console.log('state', state)
                this.state = state;
            });
            this.#client.on("disconnected", (reason) => {
                console.log('disconnected');
                this.state = "DISCONNECTED";
            });

            const save_message = async (msg, location='backup/msg') => {
                try {
                    console.log('message received', msg.id);
                    await fs.promises.mkdir(`${__rootdir}/${location}`, { recursive: true });
                    await fs.promises.writeFile(`${__rootdir}/${location}/${msg.id.id}.json`, JSON.stringify(msg));
                    let message = await WhatsappMessage.findOne({
                        where: {
                            from: msg.from,
                            to: msg.to,
                            timestamp: msg.timestamp
                        }
                    })
                    if (!message) {
                        message = await WhatsappMessage.create({
                            from: msg.from,
                            to: msg.to,
                            timestamp: msg.timestamp,
                            body: msg.body,
                            ack: msg.ack + '',
                            author: msg.author,
                            isBroadcast: msg.broadcast,
                            deviceType: msg.deviceType,
                            forwardingScore: msg.forwardingScore,
                            isFromMe: msg.fromMe,
                            hasMedia: msg.hasMedia,
                            hasQuoteMsg: msg.hasQuoteMsg,
                            wid: msg.id,
                            _data: msg._data,
                            inviteV4: msg.inviteV4,
                            isEphemeral: msg.isEphemeral,
                            isForwarded: msg.isForwarded,
                            isGif: msg.isGif,
                            isStarred: msg.isStarred,
                            isStatus: msg.isStatus,
                            mediaKey: msg.mediaKey,
                            mentionedIds: msg.mentionedIds,
                            orderId: msg.orderId,
                            type: msg.type,
                            vCards: msg.vCards,
                            Links: msg.links.map(l => ({
                                link: l.link,
                                isSuspicious: l.isSuspicious
                            })),
                            Location: msg.location,
                            UserId: this.UserId
                        });
                    } else {
                        console.log('mensagem encontrada');
                        message.set({
                            ack: msg.ack+'',                    
                            wid: {
                                ...msg.id,
                                old: message.wid
                            },                
                            _data: {
                                ...msg._data,
                                old: message._data
                            },
                            type: msg.type
                        });        
                        await message.save();            
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            this.#client.on('message_create', save_message)
            this.#client.on('message',save_message)
            this.#client.on('message_ack', async (msg, ack) => {
                console.log('message_ack', ack, msg.id);
            });
            this.#client.on('message_revoke_me', async msg => {
                console.log('mensagem deletada para mim', msg.id)
                save_message(msg, 'backup/revoked/me');
            });
            this.#client.on('message_revoke_everyone', async (msg, old_msg) => {
                console.log('mensagem deletada para todos', msg.id, old_msg.id)
                save_message(msg, 'backup/revoked/everyone');       
                
                await fs.promises.mkdir(`${__rootdir}/backup/revoked_old`, { recursive: true });
                await fs.promises.writeFile(`${__rootdir}/backup/revoked_old/${old_msg.id.id}.json`, JSON.stringify(old_msg));
            });
            this.#client.on('media_uploaded', async msg => {
                console.log('media_uploaded', msg.id);
            })

            console.log('initializing client')
            this.#client.initialize().then(e => console.log('client initialized')).catch(console.error);
        }
        return this.#client;
    }

    async logout() {
        if (!this.#client) {
            return;
        }
        await this.#client.logout().catch(console.error);
        this.#client = null;
    }

    async disconnect() {
        if (null !== this.#client) {
            await this.#client.destroy().catch(console.error);
        }
        this.#client = null;
        this.state = "DISCONNECTED";
    }

    async getContacts() {
        let client = this.WhatsappClient;
        if (this.state != "CONNECTED") {
            return [];
        }

        return await client.getContacts().catch(err => {
            console.error(err);
            return [];
        });
    }
}

WhatsappConnection.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
        },
        pushname: {
            type: DataTypes.STRING,
        },
        wid: {
            type: DataTypes.STRING,
            get() {
                try {
                    return JSON.parse(this.getDataValue("wid"));
                } catch (err) {
                    return null;
                }
            },
            set(val) {
                this.setDataValue("wid", JSON.stringify(val));
            },
        },
    },
    {
        timestamps: true,
        paranoid: true,
        sequelize,
    }
);

WhatsappConnection.hasOne(WhatsappContact);

export default WhatsappConnection;
