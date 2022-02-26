import { DataTypes, Model } from "sequelize";
import { connection as sequelize } from './sequelize.js';
import WhatsappContact from "./WhatsappContact.js";
import Address from './Address.js';
import Tag from './Tag.js';

class Contact extends Model {

}

Contact.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    nome: {
        type: DataTypes.STRING
    },
    sobrenome: {
        type: DataTypes.STRING
    },
    empresa: {
        type: DataTypes.STRING
    },
    cargo: {
        type: DataTypes.STRING
    },
    biografia: {
        type: DataTypes.TEXT
    },
    email: {
        type: DataTypes.STRING
    },
    facebook: {
        type: DataTypes.STRING
    },
    instagram: {
        type: DataTypes.STRING
    },
    celular: {
        type: DataTypes.STRING
    },
    telefone: {
        type: DataTypes.STRING
    },
    aniversario: {
        type: DataTypes.DATEONLY
    },
    indicacao: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true,
    paranoid: true,
    sequelize
})

Contact.hasOne(Address);
Contact.hasOne(WhatsappContact);
Contact.hasMany(Tag);


export default Contact;