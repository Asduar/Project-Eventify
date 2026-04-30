import { DataTypes, Model } from 'sequelize';
import db from '../config/database.js';

class Organization extends Model {}

Organization.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    contact_email: { type: DataTypes.STRING, allowNull: false }
}, {
    sequelize: db,
    modelName: 'Organization',
    tableName: 'organizations',
    timestamps: true
});

export default Organization;