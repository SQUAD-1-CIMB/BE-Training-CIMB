import cors from 'cors';
import express from 'express';

import { getUser, loginUser, logoutUser } from './controllers/AuthController.js';
import { getAllJob, getJobById } from './controllers/JobController.js';
import { getAllUser, getUserById, saveUser } from './controllers/UserController.js';

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

// UserController
router.route('/user')
  .get(getAllUser)
  .post(saveUser);

router.route('/user/:id')
  .get(getUserById);

// AuthController
router.route('/user/login')
  .post(loginUser);

router.route('/user-data')
  .get(getUser);

router.route('/user/logout')
  .post(logoutUser);

// JobController
router.route('/api/jobs')
  .get(authenticateToken, getAllJob);

router.route('/api/jobs/:id')
  .get(authenticateToken, getJobById);

export default router;
