import { Model, DataTypes } from 'sequelize';
import { connection as sequelize } from './sequelize.js';
import Location from './Location.js';
import WhatsappLink from './WhatsappLink.js';


class WhatsappMessage extends Model {
}

WhatsappMessage.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    ack: {
        type: DataTypes.STRING
    },
    author: {
        type: DataTypes.STRING
    },
    body: {
        type: DataTypes.TEXT
    },
    isBroadcast: {
        type: DataTypes.BOOLEAN
    },
    deviceType: {
        type: DataTypes.STRING
    },
    forwardingScore: {
        type: DataTypes.INTEGER
    },
    from: {
        type: DataTypes.STRING
    },
    isFromMe: {
        type: DataTypes.BOOLEAN
    },
    hasMedia: {
        type: DataTypes.BOOLEAN
    },
    hasQuotedMsg: {
        type: DataTypes.BOOLEAN
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
            this.setDataValue('wid', JSON.stringify(val));
        }
    },
    inviteV4: {
        type: DataTypes.STRING,
        get() {
            try {
                return JSON.parse(this.getDataValue('inviteV4'));            
            } catch (err) {
                return null;
            }

        },
        set(val) {
            this.setDataValue('inviteV4',JSON.stringify(val));
        }
    },
    isEphemeral: {
        type: DataTypes.BOOLEAN
    },
    isForwarded: {
        type: DataTypes.BOOLEAN
    },
    isGif: {
        type: DataTypes.BOOLEAN
    },
    isStarred: {
        type: DataTypes.BOOLEAN
    },
    isStatus: {
        type: DataTypes.BOOLEAN
    },
    mediaKey: {
        type: DataTypes.STRING
    },
    mentionedIds: {
        type: DataTypes.STRING,
        get() {
            return this.getDataValue('mentionedIds').split('|')
        },
        set(val) {
            this.setDataValue('mentionedIds', val.join('|'))
        }
    },
    orderId: {
        type: DataTypes.STRING
    },
    timestamp: {
        type: DataTypes.INTEGER
    },
    to: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.STRING
    },
    vCards: {
        type: DataTypes.STRING,
        get() {
            return this.getDataValue('vCards').split('|')
        },
        set(val) {
            this.setDataValue('vCards', val.join('|'))
        }
    },

}, {
    timestamps: true,
    paranoid: true,
    sequelize
})

WhatsappMessage.hasOne(Location);
WhatsappMessage.hasMany(WhatsappLink, {
    as: 'Links'
})

export default WhatsappMessage;