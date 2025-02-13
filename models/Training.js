import { DataTypes } from 'sequelize';
import config from '../config.js';
import Employee from './Employee.js';

const { sequelize } = config;

const Training = sequelize.define('Training', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    provider: {
        type: DataTypes.STRING,
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employee,
            key: 'id',
        },
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    // thumbnail: {
    //     type: DataTypes.STRING,
    // },
}, {
    tableName: 'trainings',
    timestamps: false,
});

Training.belongsTo(Employee, { foreignKey: 'created_by' });

export default Training;
