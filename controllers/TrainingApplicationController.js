import TrainingApplication from '../models/TrainingApplication.js';
import Training from '../models/Training.js';
import Employee from '../models/Employee.js';
import { Op } from 'sequelize';

const applyTraining = async (req, res) => {
    try {
        const { id: employee_id } = req.user;
        const { training_id } = req.body;

        const existingApplication = await TrainingApplication.findOne({
            where: { employee_id, training_id }
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this training.' });
        }

        const application = await TrainingApplication.create({
            employee_id,
            training_id,
            status: 'PENDING',
        });

        res.status(201).json(application);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while applying for the training.' });
    }
};

const withdrawApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: employee_id } = req.user;

        const application = await TrainingApplication.findOne({
            where: {
                id,
                employee_id,
                status: {
                    [Op.in]: ['PENDING', 'APPROVED']
                }
            }
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found or cannot be withdrawn.' });
        }

        application.status = 'WITHDRAWN';
        await application.save();

        res.status(200).json(application);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while withdrawing the application.' });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const { id: employee_id } = req.user;
        const { page = 1, limit = 10, status } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {
            employee_id,
            ...(status && { status })
        };

        const applications = await TrainingApplication.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [
                { model: Training },
            ]
        });

        res.status(200).json({
            totalItems: applications.count,
            totalPages: Math.ceil(applications.count / limit),
            currentPage: parseInt(page),
            data: applications.rows
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while fetching your applications.' });
    }
};

// Manager
const acceptApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: manager_id } = req.user;

        const application = await TrainingApplication.findOne({
            where: { id, status: 'PENDING' }
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found or cannot be accepted.' });
        }

        application.status = 'APPROVED';
        application.modified_by = manager_id;
        application.updated_at = new Date();
        await application.save();

        res.status(200).json(application);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while accepting the application.' });
    }
};

const rejectApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: manager_id } = req.user;
        const { rejection_reason } = req.body;

        const application = await TrainingApplication.findOne({
            where: { 
                id: id, 
                status: {
                    [Op.in]: ['PENDING', 'APPROVED']
                } 
            }
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found or cannot be rejected.' });
        }

        application.status = 'REJECTED';
        application.modified_by = manager_id;
        application.rejection_reason = rejection_reason;
        application.updated_at = new Date();
        await application.save();

        res.status(200).json(application);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while rejecting the application.' });
    }
};

const getApplications = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {
            ...(status && { status })
        };

        const applications = await TrainingApplication.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [
                { model: Training },
                { model: Employee, as: 'manager' }
            ]
        });

        res.status(200).json({
            totalItems: applications.count,
            totalPages: Math.ceil(applications.count / limit),
            currentPage: parseInt(page),
            data: applications.rows
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while fetching applications.' });
    }
};

export {
    applyTraining,
    withdrawApplication,
    getMyApplications,
    acceptApplication,
    rejectApplication,
    getApplications
};