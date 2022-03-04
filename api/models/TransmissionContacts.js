import { Model, DataTypes } from 'sequelize';
import { connection as sequelize } from "./sequelize.js";
import Contact from './Contact.js';
import Transmission from './Transmission.js';

class TransmissionContacts extends Model {

}

TransmissionContacts.init({
    TransmissionId: {
        type: DataTypes.UUID,
        references: {
            model: Transmission,
            key: 'id',
        }
    },
    ContactId: {
        type: DataTypes.UUID,
        references: {
            model: Contact,
            key: 'id',
        }
    },    
    status: {
        type: DataTypes.ENUM('Pendente', 'Enviado', 'Visualizado', 'Respondido', 'Erro'),
        allowNull: false,
        defaultValue: 'Pendente',
    }
},{
    sequelize,
    timestamps: true,
    paranoid: true,
});

Transmission.belongsToMany(Contact, { through: TransmissionContacts });
Contact.belongsToMany(Transmission, { through: TransmissionContacts });
TransmissionContacts.belongsTo(Transmission);
TransmissionContacts.belongsTo(Contact);
Transmission.hasMany(TransmissionContacts);
Contact.hasMany(TransmissionContacts);

export default TransmissionContacts;