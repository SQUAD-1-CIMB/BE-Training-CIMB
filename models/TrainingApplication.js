import { DataTypes } from 'sequelize';
import config from '../config.js';
import Employee from './Employee.js';
import Training from './Training.js';

const { sequelize } = config;

const TrainingApplication = sequelize.define('TrainingApplication', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employee,
            key: 'id',
        },
    },
    training_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Training,
            key: 'id',
        },
    },
    application_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN']],
        },
    },
    modified_by: {
        type: DataTypes.INTEGER,
        references: {
            model: Employee,
            key: 'id',
        },
    },
    updated_at: {
        type: DataTypes.DATE,
    },
    rejection_reason: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'training_applications',
    timestamps: false,
});

TrainingApplication.belongsTo(Employee, { foreignKey: 'employee_id' });
TrainingApplication.belongsTo(Training, { foreignKey: 'training_id' });
TrainingApplication.belongsTo(Employee, { foreignKey: 'modified_by', as: 'manager' });

export default TrainingApplication;
