import { Sequelize } from 'sequelize';

const db = new Sequelize('eventify_db', 'root', '150605', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

export default db;