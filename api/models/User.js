import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import { connection as sequelize } from './sequelize.js';
import Contact from './Contact.js';
import Tag from './Tag.js';
import WhatsappConnection from './WhatsappConnection.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class User extends Model {
    verifyPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
    get jwt() {
        const token = jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
            //expiresIn: 300
        })
        return token;
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
        type: DataTypes.STRING,
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