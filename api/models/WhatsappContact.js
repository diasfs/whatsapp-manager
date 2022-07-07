import { DataTypes, Model } from "sequelize";
import { connection as sequelize } from './sequelize.js';

class WhatsappContact extends Model {

}

WhatsappContact.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        businessProfile: {
            type: DataTypes.STRING,
            get() {
                try {
                    return JSON.parse(this.getDataValue("businessProfile"));
                } catch (err) {
                    return null;
                }
            },
            set(val) {
                this.setDataValue("businessProfile", JSON.stringify(val));
            },
        },
        WhatsappId: {
            type: DataTypes.STRING,
            get() {
                try {
                    return JSON.parse(this.getDataValue("WhatsappId"));
                } catch (err) {
                    return null;
                }
            },
            set(val) {
                if (val._serialized) {
                    this.setDataValue('WhatsappId_serialized');
                }
                this.setDataValue("WhatsappId", JSON.stringify(val));
            },
        },
        WhatsappId_serialized: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING,
        },
        number: {
            type: DataTypes.STRING,
        },
        pushname: {
            type: DataTypes.STRING,
        },
        verifiedName: {
            type: DataTypes.STRING,
        },
        verifiedLevel: {
            type: DataTypes.INTEGER,
        },
        shortName: {
            type: DataTypes.STRING,
        },
        isBlocked: {
            type: DataTypes.BOOLEAN,
        },
        isEnterprise: {
            type: DataTypes.BOOLEAN,
        },
        isBusiness: {
            type: DataTypes.BOOLEAN,
        },
        isGroup: {
            type: DataTypes.BOOLEAN,
        },
        isUser: {
            type: DataTypes.BOOLEAN,
        },
        isWAContact: {
            type: DataTypes.BOOLEAN,
        },
        profilePictureUrl: {
            type: DataTypes.STRING,
        },
        about: {
            type: DataTypes.TEXT,
        },
    },
    {
        timestamps: true,
        paranoid: true,
        sequelize,
    }
);


export default WhatsappContact;