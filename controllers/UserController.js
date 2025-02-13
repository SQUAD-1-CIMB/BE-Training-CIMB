import User from '../models/Employee.js';

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const promoteToManager = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = 'MANAGER';
        await user.save();

        res.status(200).json({ message: 'User promoted to MANAGER successfully.', user });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const demoteToEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = 'EMPLOYEE';
        await user.save();

        res.status(200).json({ message: 'User demoted to EMPLOYEE successfully.', user });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

export { getUsers, getUserById, promoteToManager, demoteToEmployee };
