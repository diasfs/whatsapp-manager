import { Model, DataTypes } from "sequelize";
import { connection as sequelize } from "./sequelize.js";
import ContactList from "./ContactList.js";

class Transmission extends Model {}

Transmission.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
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
        envidas: {
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
    },
    {
        sequelize,
        timestamps: true,
        paranoid: true,
    }
);


Transmission.belongsToMany(ContactList, { through: "TransmissionContactLists" });
ContactList.belongsToMany(Transmission, { through: "TransmissionContactLists" });

export default Transmission;
