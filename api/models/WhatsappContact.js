import { DataTypes, Model } from "sequelize";
import { connection as sequelize } from './sequelize.js';

class WhatsappContact extends Model {

}

WhatsappContact.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    WhatsappId: {
        type: DataTypes.STRING,
        get() {
            return JSON.parse(this.getDataValue('WhatsappId'));
        },
        set(val) {
            this.setDataValue('WhatsappId',JSON.stringify(val));
        }
    },
    name: {
        type: DataTypes.STRING
    },
    number: {
        type: DataTypes.STRING
    },
    pushname: {
        type: DataTypes.STRING
    },
    shortName: {
        type: DataTypes.STRING
    },
    isBlocked: {
        type: DataTypes.BOOLEAN
    },
    isEnterprise: {
        type: DataTypes.BOOLEAN
    },
    isGroup: {
        type: DataTypes.BOOLEAN
    },
    isUser: {
        type: DataTypes.BOOLEAN
    },
    isWAContact: {
        type: DataTypes.BOOLEAN
    },
    profilePictureUrl: {
        type: DataTypes.STRING
    },
    about: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    paranoid: true,
    sequelize
})


export default WhatsappContact;