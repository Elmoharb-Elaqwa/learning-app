import express from 'express';
import {
  deleteCourseById,
  getAllCourses,
  updateCourseById,
  addCoursesToSpecificCate,
  getCourseVideos,
} from '../controllers/courses.js';
import { verifyToken } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const coursesRoute = express.Router({ mergeParams: true });

coursesRoute.get('/all', verifyToken, getAllCourses);
coursesRoute.delete('/:id', [verifyToken, admin], deleteCourseById);
coursesRoute.patch('/:id', [verifyToken, admin], updateCourseById);
// new work

// add course to specific category
coursesRoute.put(
  '/addCoursesToSpecificCategory',
  [verifyToken, admin],
  addCoursesToSpecificCate
);

// get course by id
coursesRoute.get('/:courseId', verifyToken, getCourseVideos);

export default coursesRoute;
