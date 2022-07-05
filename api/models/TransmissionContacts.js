import { Model, DataTypes } from 'sequelize';
import { connection as sequelize } from "./sequelize.js";
import Contact from './Contact.js';
import Transmission from './Transmission.js';

class TransmissionContacts extends Model {

}

TransmissionContacts.init({
    TransmissionId: {
        type: DataTypes.UUID,
        /*
        references: {
            model: Transmission,
            key: 'id',
        }
        */
        //unique: 'tc_unique_constraint'
    },
    ContactId: {
        type: DataTypes.UUID,
        /*
        references: {
            model: Contact,
            key: 'id',
        }
        */
        //unique: 'tc_unique_constraint'
    },    
    status: {
        type: DataTypes.ENUM('Pendente', 'Enviado', 'Visualizado', 'Respondido', 'Erro'),
        allowNull: false,
        defaultValue: 'Pendente',
    }
},{
    sequelize,
    timestamps: true,
    paranoid: false,
});

Transmission.belongsToMany(Contact, { constraints: false, foreignKey: 'ContactId', through: TransmissionContacts });
Contact.belongsToMany(Transmission, { constraints: false, foreignKey: 'TransmissionId', through: TransmissionContacts });

TransmissionContacts.belongsTo(Transmission, { constraints: false, foreignKey: 'TransmissionId'});
TransmissionContacts.belongsTo(Contact, { constraints: false, foreignKey: 'ContactId' });

/*
Transmission.hasMany(TransmissionContacts, { constraints: false, foreignKey: 'TransmissionId' });
Contact.hasMany(TransmissionContacts, { constraints: false, foreignKey: 'ContactId' });
*/

export default TransmissionContacts;