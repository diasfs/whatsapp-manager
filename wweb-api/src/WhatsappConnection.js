class WhatsappConnection {
    constructor(client) {
        this.client = client;
        this.qr = null;
        this.state = 'starting';
        this.info = null;

        client.on('disconnected', () => {
            this.state = 'disconnected';
        });
        client.on('ready', () => {
            this.state = 'ready';
            this.info = client.info;
        });
        client.on('qr', qr => {
            this.qr = qr;
            this.state = 'started';
        })
    }

    logout() {
        return this.client.logout().catch(err => {
            console.error(err);
        })
    }

    destroy() {
        return this.client.destroy().catch(err => {
            console.error(err);
        })
    }

    close() {
        this.logout().then(() => {
            //return this.destroy();
            return;
        }).then(evt => {
            this.client.emit('disconnected')
        })
    }

    getContacts() {
        if (this.state !== 'ready') {
            return []
        }
        return this.client.getContacts();
    }

    getNumberId(number) {
        if (this.state !== 'ready') {
            return null;
        }
        return this.client.getNumberId(number);
    }

    getContactById(id) {
        if (this.state !== 'ready') {
            return null;
        }
        return this.client.getContactById(id);
    }

    getFormattedNumber(number) {
        if (this.state !== 'ready') {
            return number;
        }
        return this.client.getFormattedNumber(number);
    }

    getProfilePictureUrl(contact_id) {
        if (this.state !== 'ready') {
            return null;
        }
        return this.client.getProfilePictureUrl(contact_id);
    }

    isRegisteredUser(id) {
        if (this.state !== 'ready') {
            return null;
        }
        return this.client.isRegisteredUser(id);
    }

    searchMessages(query, options = null) {
        if (this.state !== 'ready') {
            return null;
        }
        return this.client.searchMessages(query, options);
    }

    sendMessage(chatId, content, options = null) {
        if (this.state !== 'ready') {
            return null;
        }
        return this.client.sendMessage(chatId, content, options);
    }
}


module.exports = WhatsappConnection;