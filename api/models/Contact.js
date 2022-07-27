import { DataTypes, Model } from "sequelize";
import { connection as sequelize } from './sequelize.js';

import WhatsappContact from "./WhatsappContact.js";
import WhatsappMessage from "./WhatsappMessage.js";
import WhatsappConnection from "./WhatsappConnection.js";

import Address from './Address.js';
import Tag from './Tag.js';

class Contact extends Model {
    async updateProfile() {
        try {
            let Contact = this;

            let connections = await WhatsappConnection.findAll({
                where: {
                    UserId: this.UserId
                }
            });

            let contact;
            let profile_picutre;
            let about;
            let number;
            for (let connection of connections) {
                try {
                    await connection.updateState();
                    if ('CONNECTED' !== connection.state) {
                        continue;
                    }
                    let celular = (Contact.celular||'').replace(/\D+/igm, '');
                    let telefone = (Contact.telefone||'').replace(/\D+/igm, '');
                    if ('' != celular) {
                        celular = await connection.getFormattedNumber(celular);
                        let wid = await connection.getNumberId(celular);
                        let is_registered_user = await connection.getIsRegisteredUser(wid._serialized);
                        if (is_registered_user) {
                            contact = await connection.getContactById(wid._serialized);
                            if (contact) {
                                profile_picutre = await connection.getProfilePictureUrl(contact.id._serialized);
                                about = await connection.getAbout(contact.id._serialized);
                                number = await connection.getFormattedNumber(contact.id._serialized);
                                break;
                            }
                        }
                    }
                    if ('' != telefone) {
                        telefone = await connection.getFormattedNumber(telefone);
                        let wid = await connection.getNumberId(telefone);
                        let is_registered_user = await connection.getIsRegisteredUser(wid._serialized);
                        if (is_registered_user) {
                            contact = await connection.getContactById(wid._serialized);

                            if (contact) {
                                profile_picutre = await connection.getProfilePictureUrl(contact.id._serialized);
                                about = await connection.getAbout(contact.id._serialized);
                                number = await connection.getFormattedNumber(contact.id._serialized);

                                break;
                            }
                        }
                    }

                } catch (err) {
                    console.error(err);
                }
            }

            if (!contact) {
                throw new Error('contact not found')
            }

            let row = contact;

            let wacontact = await WhatsappContact.findOne({
                where: {
                    number,
                    ContactId: Contact.id
                }
            });
            if (!wacontact) {
                wacontact = await WhatsappContact.create({
                    number,
                    ContactId: Contact.id
                });
            }


            wacontact.set({
                about,
                profilePictureUrl: profile_picutre,
                WhatsappId: row.id,
                businessProfile: row.businessProfile,
                isBlocked: row.isBlocked,
                isBusiness: row.isBusiness,
                isEnterprise: row.isEnterprise,
                isGroup: row.isGroup,
                isUser: row.isUser,
                isWAContact: row.isWAContact,
                name: row.name,
                pushname: row.pushname,
                shortName: row.shortName,
                verifiedName: row.verifiedName
            });

            wacontact.save();


            return contact;

        } catch (error) {
            console.error(error);
        }
        return null;
    }
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

Contact.belongsToMany(Tag, { through: 'ContactTags' });
Tag.belongsToMany(Contact, { through: 'ContactTags' });

Contact.belongsToMany(WhatsappMessage, { through: 'ContactMessages' ,constraints: false });
WhatsappMessage.belongsToMany(Contact, { through: 'ContactMessages' ,constraints: false});


export default Contact;