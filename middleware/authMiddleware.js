import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    const token = req.query.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = user;
        next();
    });
};

const isManager = (req, res, next) => {
    const { role } = req.user;
    console.log(role);
    if (role === 'MANAGER') {
        next();
    } else {
        res.status(403).json({ message: 'Not a Manager' });
    }
}

export {
    authenticateToken,
    isManager
};

