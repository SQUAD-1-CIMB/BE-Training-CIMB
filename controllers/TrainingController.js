import Training from '../models/Training.js';
import { Op } from 'sequelize';

const getTrainings = async (req, res) => {
    try {
        const { page = 1, limit = 10, filter = '', startDate } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {
            ...(filter && { title: { [Op.iLike]: `%${filter}%` } }),
            ...(startDate && { start_date: { [Op.gte]: new Date(startDate) } })
        };

        const trainings = await Training.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            totalItems: trainings.count,
            totalPages: Math.ceil(trainings.count / limit),
            currentPage: parseInt(page),
            data: trainings.rows
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while fetching trainings.' });
    }
};

const getTraining = async (req, res) => {
    try {
        const { id } = req.params;
        const training = await Training.findByPk(id);
        if (!training) {
            return res.status(404).json({ message: 'Training not found.' });
        }
        res.status(200).json(training);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while fetching the training.' });
    }
}

const DEFAULT_THUMBNAIL_URL = 'https://testdulu.com/default-thumbnail.jpg';

const createTraining = async (req, res) => {
    try {
        const { id } = req.user;
        const { title, description, provider, start_date, end_date } = req.body;
        const thumbnail = req.file ? req.file.path : DEFAULT_THUMBNAIL_URL;
        const training = await Training.create({
            title,
            description,
            provider,
            start_date,
            end_date,
            created_by: id,
            thumbnail,
        });
        res.status(201).json(training);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while creating the training.' });
    }
};

const updateTraining = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, provider, start_date, end_date } = req.body;
        console.log(req.body);
        if (!title || !description || !provider || !start_date || !end_date) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Find the training by ID
        const training = await Training.findByPk(id);
        if (!training) {
            return res.status(404).json({ message: 'Training not found.' });
        }

        const thumbnail = req.file ? req.file.path : training.thumbnail;
        console.log(req.file);
        training.title = title;
        training.description = description;
        training.provider = provider;
        training.start_date = new Date(start_date);
        training.end_date = new Date(end_date);
        training.thumbnail = thumbnail;

        await training.save();

        res.status(200).json({ data: training });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while updating the training.' });
    }
};

const deleteTraining = async (req, res) => {
    try {
        const { id } = req.params;
        const training = await Training.findByPk(id);
        if (!training) {
            return res.status(404).json({ message: 'Training not found.' });
        }
        await training.destroy();
        res.status(200).json({ message: 'Training deleted successfully.' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'An error occurred while deleting the training.' });
    }
};

export { getTrainings, getTraining, createTraining, updateTraining, deleteTraining };