import { Model, DataTypes } from "sequelize";
import { connection as sequelize } from './sequelize.js';

class Tag extends Model {

}

Tag.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING
    },
    backgroundColor: {
        type: DataTypes.STRING
    }

}, {
    timestamps: true,
    paranoid: true,
    sequelize
});

export default Tag;