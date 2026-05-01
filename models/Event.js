import { DataTypes, Model } from 'sequelize';
import db from '../config/database.js';

class Event extends Model {}

Event.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    time: { type: DataTypes.TIME, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    organizationId: { type: DataTypes.INTEGER, allowNull: true }, 
    roomId: { type: DataTypes.INTEGER, allowNull: true }
}, {
    sequelize: db,
    modelName: 'Event',
    tableName: 'events',
    timestamps: true
});

export default Event;