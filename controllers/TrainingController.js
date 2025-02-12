import Training from '../models/Training.js';

export const getTrainings = async (req, res) => {
    try {
        const trainings = await Training.findAll();
        res.status(200).json(trainings);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

export const getTraining = async (req, res) => {
    try {
        const { id } = req.params;
        const training = await Training.findByPk(id);
        res.status(200).json(training);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export const createTraining = async (req, res) => {
    try {
        const { id } = req.user;
        const { title, description, provider, start_date, end_date } = req.body;

        const training = await Training.create({
            title,
            description,
            provider,
            start_date,
            end_date,
            created_by: id,
        });
        res.status(201).json(training);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export const isManager = (req, res, next) => {
    const { role } = req.user;
    if (role ==='MANAGER') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden' });
    }
}