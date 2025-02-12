import bcrypt from "bcrypt";
import User from "../models/User.js";

const getAllUser = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = await User.findById(req.params.id);

        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

const saveUser = async (req, res) => {
    const { name, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        password: hashedPassword,
        email,
    });

    try {
        const insertUser = await user.save();
        res.status(201).json(insertUser);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
}

export { getAllUser, getUserById, saveUser };

