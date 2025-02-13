import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/Employee.js';

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ where: { email } });
        
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                jwt.sign(
                    {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }, 
                    process.env.JWT_SECRET, 
                    {}, 
                    (err, token) => {
                        if (err) {
                            res.status(500).json({ message: 'Failed to generate token.' });
                        } else {
                            const threeHours = 48 * 60 * 60 * 1000;
                            const expirationDate = new Date(Date.now() + threeHours);

                            const userWithoutPassword = {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                department: user.department,
                                role: user.role,
                                created_at: user.created_at,
                                avatar: user.avatar
                            };

                            res.cookie('token', token, { expires: expirationDate, httpOnly: true })
                               .json({ token, user: userWithoutPassword });
                        }
                    }
                );
            } else {
                res.status(400).json('Invalid credentials!');
            }
        } else {
            res.status(400).json('Invalid credentials!');
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

const getUser = (req, res) => {
    const { token } = req.cookies;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized" });
            } else {
                User.findByPk(decoded.id)
                    .then(user => {
                        return res.json(user);
                    })
                    .catch(err => {
                        return res.status(500).json({ message: "User not found" });
                    });
            }
        });
    } else {
        return res.status(401).json({ message: "No user found." });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie('token', 
        { 
            path: '/',
            domain: 'localhost',
            secure: true
        }).json({ message: 'Logout successfully.' });
};

const DEFAULT_AVATAR_URL = "https://res.cloudinary.com/dm03tiklu/image/upload/v1739442632/training_thumbnails/mvcvwudtnzkdet0ngsvr.jpg"

const registerUser = async (req, res) => {
    try {
        const { email, password, name, department } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
            department,
            avatar: DEFAULT_AVATAR_URL
        });

        res.status(201).json({
            message: 'User registered successfully.',
            user: { id: newUser.id, email: newUser.email, name: newUser.name, department: newUser.department }
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

export { getUser, loginUser, logoutUser, registerUser };

