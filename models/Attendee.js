import { DataTypes, Model } from 'sequelize';
import db from '../config/database.js';

class Attendee extends Model {}

Attendee.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    student_name: { type: DataTypes.STRING, allowNull: false },
    nim: { type: DataTypes.STRING, allowNull: false },
    eventId: { type: DataTypes.INTEGER, allowNull: false }
}, {
    sequelize: db,
    modelName: 'Attendee',
    tableName: 'attendees',
    timestamps: true
});

export default Attendee;