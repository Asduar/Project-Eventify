import { Sequelize } from 'sequelize';

// Inisialisasi koneksi Sequelize (Sesuai Modul M07)
// Format: new Sequelize('nama_database', 'username_mysql', 'password_mysql', { options })
const db = new Sequelize('eventify_db', 'root', '150605', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false // Matikan log query di terminal agar bersih
});

export default db;