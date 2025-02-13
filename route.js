import cors from 'cors';
import express from 'express';

import { getUser, loginUser, logoutUser, registerUser } from './controllers/AuthController.js';
import { createTraining, deleteTraining, getTraining, getTrainings, updateTraining } from './controllers/TrainingController.js';
import { getUsers, getUserById, promoteToManager, demoteToEmployee } from './controllers/UserController.js';
import { authenticateToken, isManager } from './middleware/authMiddleware.js';
import { acceptApplication, applyTraining, getApplications, getMyApplications, rejectApplication, withdrawApplication } from './controllers/TrainingApplicationController.js';
import upload from './middleware/uploadMiddleware.js';

const router = express.Router();

router.use(
  cors({
    // origin: ['http://localhost:3000', 'http://192.168.0.110:3000'],
    origin: '*',
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

// TrainingController
router.route('/trainings')
  .get(authenticateToken, isManager, getTrainings)
  .post(authenticateToken, isManager, upload.single('thumbnail'), createTraining);

router.route('/training/:id')
  .get(authenticateToken, getTraining)
  .put(authenticateToken, isManager, updateTraining)
  .delete(authenticateToken, isManager, deleteTraining);

// TrainingApplicationController
router.route('/training-application')
    .post(authenticateToken, applyTraining)
    .get(authenticateToken, isManager, getApplications);

router.route('/training-application/:id/withdraw')
    .patch(authenticateToken, withdrawApplication);

router.route('/my-applications')
    .get(authenticateToken, getMyApplications);

router.route('/training-application/:id/accept')
    .patch(authenticateToken, isManager, acceptApplication);

router.route('/training-application/:id/reject')
    .patch(authenticateToken, isManager, rejectApplication);



  // UserController
router.route('/users')
  .get(authenticateToken, getUsers);

router.route('/users/:id')
  .get(authenticateToken, getUserById);

router.route('/users/:id/promote')
  .put(authenticateToken, isManager, promoteToManager);

router.route('/users/:id/demote')
  .put(authenticateToken, isManager, demoteToEmployee);

export default router;
