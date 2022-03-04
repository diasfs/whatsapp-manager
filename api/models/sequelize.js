import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

export const connection = new Sequelize({
    dialect: process.env.DB_DIALECT,
    storage: process.env.DB_STORAGE,
    //logging: false
});

export default connection;