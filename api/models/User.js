import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import { connection as sequelize } from './sequelize.js';
import Contact from './Contact.js';
import Tag from './Tag.js';
import WhatsappConnection from './WhatsappConnection.js';

class User extends Model {
    verifyPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

User.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataType.String,
        set(value) {
            this.setDataValue('password', bcrypt.hashSync(value))
        }
    }
},{
    timestamps: true,
    paranoid: true,
    sequelize
});

Contact.belongsTo(User);
User.hasMany(Contact);

Tag.belongsTo(User);
User.hasMany(User);

WhatsappConnection.belongsTo(User);
User.hasMany(WhatsappConnection);

export default User;