import { Model, STRING, UUID, UUIDV4 } from "sequelize";
import { connection as sequelize } from './sequelize.js';
import User from "./User.js";

export class Role extends Model { }

Role.init({
    id: {
        type: UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING,
        allowNull: false,
    }
}, {
    sequelize,
    timestamps: true,
    paranoid: true
});

Role.belongsToMany(User, {
    constraints: false,
    through: 'UserRole',
    as: 'Users'
});

User.belongsToMany(Roles, {
    constraints: false,
    through: 'UserRole',
    as: 'Roles'
});

await Role.sync();


export default Role;