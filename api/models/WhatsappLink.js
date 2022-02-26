import { Model, DataTypes } from 'sequelize';
import { connection as sequelize } from './sequelize.js';

class WhatsappLink extends Model {

}

WhatsappLink.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    link: {
        type: DataTypes.STRING
    },
    isSuspicious: {
        type: DataTypes.DOUBLE
    }
}, {
    timestamps: true,
    paranoid: true,
    sequelize
})

export default WhatsappLink;