const { Client, LocalAuth } = require('whatsapp-web.js');
const EventEmitter = require('events');
const { v4: uuid } = require('uuid');
const fs = require("fs/promises");
const path = require('path');
const locateChrome = require('locate-chrome');
const WhatsappConnection = require('./WhatsappConnection.js');


let __root__ = process.env.PWD;
if (process.env.APP_DATA) {
    __root__ = process.env.APP_DATA;
}


let Clients = {
    clients: {},
    wids: {},
    sessions: {},
    events: new EventEmitter(),

    on(evt, callback) {
        this.events.on(evt, callback);
    },
    once(evt, callback) {
        this.events.once(evt, callback);
    },
    addEventListener(evt, callback) {
        this.events.addListener(evt, callback);
    },

    async save() {
        let sessions = { ...this.sessions };
        for (let id in this.clients) {
            let wid = this.clients[id];
            if ('undefined' === typeof this.wids[wid]) {
                continue;
            }
            let { session_id } = this.wids[wid];
            sessions[id] = session_id
        }
        this.sessions = sessions;

        await fs.mkdir(path.join(__root__, 'sessions'), { recursive: true });
        await fs.writeFile(path.join(__root__, 'sessions', 'sessions.json'), JSON.stringify(sessions));
    },

    async load() {
        let sessions;
        try {
            sessions = require(path.join(__root__, 'sessions', 'sessions.json'));
        } catch (err) {
            sessions = {}
        }
        this.sessions = sessions;
    },

    async getById(id) {
        if ('undefined' !== typeof this.sessions[id]) {
            id = this.sessions[id];
        }

        if ('undefined' === typeof this.clients[id]) {
            return await this.createClient(id);
        }
        let wid = this.clients[id];
        if ('undefined' === typeof this.wids[wid]) {
            return await this.createClient(id);
        }
        let connection = this.wids[wid];
        if ('disconnected' === connection.state) {
            connection.client.initialize().catch(err => {
                console.error(err);
            })
        }
        return connection;
    },

    async createClient(id) {
        let client;
        let wid = uuid();
        let info;
        let connection = null;

        let executablePath = null;
        if (process.env.CHROME_EXECUTABLE_PATH) {
            executablePath = process.env.CHROME_EXECUTABLE_PATH;
        } else if (process.env.LOCATE_CHROME) {
            executablePath = await locateChrome();
        }

        try {
            client = new Client({
                authStrategy: new LocalAuth({
                    clientId: id,
                    dataPath: path.join(__root__, '.wwebjs_auth')
                }),
                puppeteer: {
                    executablePath,
                    headless: process.env.HEADLESS == 'true',
                    args: [
                        "--disable-gpu",
                        "--disable-dev-shm-usage",
                        "--disable-setuid-sandbox",
                        "--no-sandbox"
                    ],
                }
            })
            this.clients[id] = wid;
            connection = new WhatsappConnection(client);
            connection.wid = wid;
            connection.session_id = id;


            this.wids[wid] = connection;

            client.on('ready', async () => {
                info = client.info;
                if ('undefined' !== typeof this.wids[info.wid._serialized]) {
                    try {
                        this.wids[info.wid._serialized].close()
                    } catch (err) {
                        console.error(err);
                    }
                }
                this.wids[info.wid._serialized] = connection;
                this.clients[id] = info.wid._serialized;
                delete this.wids[wid];
                wid = info.wid._serialized;
                connection.state = 'ready';

                this.save();

            });

            client.on('qr', qr => {
                connection.state = 'started';
                connection.qr = qr;
            });

            client.on('disconnected', (reason) => {
                console.log(`${id}: disconnected`);
            })


            client.initialize().catch(err => {
                delete this.clients[id];
                console.error('initialization error', err);
            });
            return connection;
        } catch (err) {
            delete this.clients[id];
            return null;
        }
    }
};

Clients.load();

module.exports = Clients;