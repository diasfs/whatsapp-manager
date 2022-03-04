import { Model, DataTypes } from 'sequelize';
import { connection as sequelize } from "./sequelize.js";
import Contact from './Contact.js';

class ContactList extends Model {}

ContactList.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contact_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        sequelize,
        timestamps: true,
        paranoid: true,
    }
);

ContactList.belongsToMany(Contact, { through: 'ContactListContacts' });
Contact.belongsToMany(ContactList, { through: 'ContactListContacts' });

export default ContactList;