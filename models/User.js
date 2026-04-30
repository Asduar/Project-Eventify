import { DataTypes, Model } from 'sequelize';
import db from '../config/database.js';

// Memenuhi syarat M02: Class dan Inheritance
class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'User',
    tableName: 'users',
    timestamps: true // Otomatis membuat kolom createdAt & updatedAt
});

export default User;