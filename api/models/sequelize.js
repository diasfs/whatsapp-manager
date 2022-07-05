import { Sequelize } from "sequelize";




let uri = process.env.DB_URI
let logging = process.env.DB_LOGGING=='true'

console.log({ uri, logging });

export const connection = new Sequelize(uri, {
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    },
    logging
});

export default connection;