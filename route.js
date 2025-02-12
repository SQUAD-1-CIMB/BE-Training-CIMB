import cors from 'cors';
import express from 'express';

import { getUser, loginUser, logoutUser, registerUser } from './controllers/AuthController.js';

import { authenticateToken } from './middleware/authMiddleware.js';

const router = express.Router();

router.use(
  cors({
    origin: ['http://localhost:3000', 'http://192.168.0.110:3000'],
    credentials: true
  })
);

router.get('/', (req, res) => {
  res.send('Test!');
});

// AuthController
router.route('/user/login')
  .post(loginUser);

router.route('/user-data')
  .get(getUser);

router.route('/user/logout')
  .post(logoutUser);

router.route('/user/register')
  .post(registerUser);

export default router;
