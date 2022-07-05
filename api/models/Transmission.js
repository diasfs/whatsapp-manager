import { Model, DataTypes } from "sequelize";
import { connection as sequelize } from "./sequelize.js";
import ContactList from "./ContactList.js";
import { publish } from '../pubsub.js';

class Transmission extends Model {}

Transmission.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        nome: {
            type: DataTypes.STRING
        },
        template: {
            type: DataTypes.TEXT,
            allowNull: false,
            get() {
                try {
                    return JSON.parse(this.getDataValue("template"));
                } catch (err) {
                    return null;
                }
            },
            set(val) {
                this.setDataValue("template", JSON.stringify(val));
            },
        },
        pendentes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        enviadas: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        visualizadas: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        respondidas: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        erros: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        status: {
            type: DataTypes.ENUM,
            values: ["RASCUNHO","ENVIANDO", "ENVIADA", "INTERROMPIDA"],
            defaultValue: "RASCUNHO",
        }
    },
    {
        sequelize,
        timestamps: true,
        paranoid: true,
    }
);

Transmission.addHook('afterSave', (transmission, options) => {
    console.log(`transmission.save[${transmission.id}]`);
    publish(`transmission.save[${transmission.id}]`, transmission);
});
Transmission.addHook('afterUpdate', (transmission, options) => {
    console.log(`transmission.update[${transmission.id}]`)
    publish(`transmission.update[${transmission.id}]`, transmission);
});

Transmission.belongsToMany(ContactList, { through: "TransmissionContactLists" });
ContactList.belongsToMany(Transmission, { through: "TransmissionContactLists" });


export default Transmission;
