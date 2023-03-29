import express from 'express';
import {
  getPasswordView,
  getResetPassword,
  resetThePassword,
  sendForgotPasswordLink,
} from '../controllers/passwordController.js';

const passwordRouter = express.Router();

passwordRouter.route('/forgot-password').post(sendForgotPasswordLink);

passwordRouter
  .route('/reset-password/:userId/:token')
  .get(getResetPassword)
  .post(resetThePassword);

export default passwordRouter;
