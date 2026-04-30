import { DataTypes, Model } from 'sequelize';
import db from '../config/database.js';

class Event extends Model {}

Event.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    date: {
        type: DataTypes.DATEONLY, // Hanya menyimpan tanggal (YYYY-MM-DD)
        allowNull: false
    },
    time: {
        type: DataTypes.TIME, // Menyimpan jam (HH:MM:SS)
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('Rapat', 'Konser', 'Seminar', 'Lainnya'),
        allowNull: false,
        defaultValue: 'Lainnya'
    }
}, {
    sequelize: db,
    modelName: 'Event',
    tableName: 'events',
    timestamps: true
});

export default Event;