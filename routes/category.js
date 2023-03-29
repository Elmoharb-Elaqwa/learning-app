import express from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryCoursesById,
  updateCategory,
} from '../controllers/category.js';
import { admin } from '../middleware/admin.js';
import { verifyToken } from '../middleware/auth.js';

const categoryRoute = express.Router();

categoryRoute.post('/add', [verifyToken, admin], createCategory);
categoryRoute.get('/', getAllCategories);
categoryRoute.delete('/:id', [verifyToken, admin], deleteCategory);
categoryRoute.get('/categoryId/:id', verifyToken, getCategoryCoursesById);
categoryRoute.patch(
  '/updateCategory/:id',
  [verifyToken, admin],
  updateCategory
);

export default categoryRoute;
