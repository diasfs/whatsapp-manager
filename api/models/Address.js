import { Model, DataTypes } from 'sequelize';
import { connection as sequelize } from './sequelize.js';

class Address extends Model {

}

Address.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    cep: {
        type: DataTypes.STRING(9)
    },
    logradouro: {
        type: DataTypes.STRING
    },
    numero: {
        type: DataTypes.STRING
    },
    complemento: {
        type: DataTypes.STRING
    },
    bairro: {
        type: DataTypes.STRING
    },
    cidade: {
        type: DataTypes.STRING
    },
    uf: {
        type: DataTypes.STRING(2)
    }
}, {
    timestamps: true,
    paranoid: true,
    sequelize
});

export default Address;