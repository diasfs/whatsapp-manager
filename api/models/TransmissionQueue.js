import { Model, DataTypes } from 'sequelize';
import { connection as sequelize } from "./sequelize.js";
import Contact from './Contact.js';
import Transmission from './Transmission.js';

class TransmissionQueue extends Model {

}

TransmissionQueue.init({
    TransmissionId: {
        type: DataTypes.UUID,
        /*
        references: {
            model: Transmission,
            key: 'id',
        }
        */
       //unique: 'tq_unique_constraint'
    },
    ContactId: {
        type: DataTypes.UUID,
        //unique: 'tq_unique_constraint',
        //references: null
        /*
        references: {
            model: Contact,
            key: 'id',
        }
        */
    },
    status: {
        type: DataTypes.ENUM('Pendente', 'Enviado', 'Visualizado', 'Respondido', 'Erro'),
        allowNull: false,
        defaultValue: 'Pendente',
    }
}, {
    sequelize,
    timestamps: true,
    paranoid: false,
});

Transmission.belongsToMany(Contact, { as: 'Queue', foreignKey: 'ContactId', constraints: false, through: TransmissionQueue });
Contact.belongsToMany(Transmission, { as: "Queue", foreignKey: 'TransmissionId', constraints: false, through: TransmissionQueue });

TransmissionQueue.belongsTo(Transmission, { foreignKey: 'TransmissionId', constraints: false });
TransmissionQueue.belongsTo(Contact, { foreignKey: 'ContactId', constraints: false });

/*
Transmission.hasMany(TransmissionQueue, { foreignKey: 'TransmissionId', constraints: false });
Contact.hasMany(TransmissionQueue, { foreignKey: 'ContactId', constraints: false });
*/

export default TransmissionQueue;