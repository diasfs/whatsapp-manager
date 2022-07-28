import { Model, UUID, UUIDV4, STRING, TEXT } from 'sequelize';
import { connection as sequelize } from './sequelize.js';
import slugify from 'slugify';

export class Help extends Model {}
Help.init({
    id: {
        type: UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV4
    },
    slug: {
        type: STRING,
        allowNull: false,
    },
    name: {
        type: STRING,
        allowNull: false,
        set(v) {
            this.setDataValue('name', v);
            this.setDataValue('slug', slugify(v, {
                lower: true, 
                locale: 'pt',                
            }))
        }
    },
    text: {
        type: TEXT,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: true,
    paranoid: true
});

Help.init();