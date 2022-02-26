import { Model, DataTypes } from 'sequelize';
import { connection as sequelize } from './sequelize.js';

class Location extends Model {

}

Location.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    latitude: {
        type: DataTypes.DOUBLE
    },
    longitude: {
        type: DataTypes.DOUBLE
    },
    description: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true,
    paranoid: true,
    sequelize
})

export default Location;