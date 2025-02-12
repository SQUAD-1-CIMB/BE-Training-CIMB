import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                jwt.sign(
                    {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                    }, process.env.JWT_SECRET, {}, (err, token) => {
                    if (err) {
                        res.status(500).json({ message: 'Failed to generate token.' });
                    } else {
                        const threeHours = 3 * 60 * 60 * 1000;
                        const expirationDate = new Date(Date.now() + threeHours);

                        res.cookie('token', token, { expires: expirationDate, httpOnly: true }).json({ token, user });
                    }
                });
            } else {
                res.json('Invalid credentials!');
            }
        } else {
            res.json('Invalid credentials!');
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

const getUser = (req, res) => {
    const { token } = req.cookies;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized" });
            } else {
                return res.json(user);
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
        }).json({ message: 'Logout succesfully.' });
};

export { getUser, loginUser, logoutUser };

