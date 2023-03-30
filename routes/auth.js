import express from 'express';
import {
  deleteUserAccount,
  getAllUsers,
  login,
  register,
  resetPassword,
  updateUserInformation,
  userCourses,
} from '../controllers/auth.js';
import { admin } from '../middleware/admin.js';
import { verifyToken } from '../middleware/auth.js';
import coursesRoute from './courses.js';

const router = express.Router({ mergeParams: true });

router.post('/login', login);
router.post('/register', register);
router.patch('/reset', resetPassword);
router.patch('/', verifyToken, updateUserInformation);
router.delete('/', verifyToken, deleteUserAccount);
router.get('/', [verifyToken, admin], getAllUsers);
router.get('/courses', verifyToken, userCourses);
router.use('/:userId/courses', coursesRoute);

export default router;
