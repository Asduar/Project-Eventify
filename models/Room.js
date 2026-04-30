import { DataTypes, Model } from 'sequelize';
import db from '../config/database.js';

class Room extends Model {}

Room.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    room_name: { type: DataTypes.STRING, allowNull: false },
    building: { type: DataTypes.STRING, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false }
}, {
    sequelize: db,
    modelName: 'Room',
    tableName: 'rooms',
    timestamps: true
});

export default Room;