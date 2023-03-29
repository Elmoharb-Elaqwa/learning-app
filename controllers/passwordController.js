import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
export const getPasswordView = async (req, res) => {
  res.render('forgot-password');
};

// send forgot password
export const sendForgotPasswordLink = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const secret = `${process.env.JWT_SECRET}` + user.password;
  const token = jwt.sign({ email: user.email, id: user._id }, secret, {
    expiresIn: '10m',
  });
  const link = `${process.env.SERVER_URL}/password/reset-password/${user._id}/${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'abdulrahmanwork1999@gmail.com',
      pass: `${process.env.MY_PASS}`,
    },
  });
  const mailOptions = {
    from: 'abdulrahmanwork1999@gmail.com',
    to: user.email,
    subject: 'Reset Password',
    html: `<div>
      <h4>Click the link below to reset your password</h4>
      <p>${link}</p>
    </div>`,
  };
  transporter.sendMail(mailOptions, function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email Send' + success.response);
    }
  });
  res.json({ message: 'Link is sent to your email' });
};

// get reset password link => /reset/reset-password/:userId/:token
export const getResetPassword = async (req, res) => {
  // const { userId } = req.params;
  // const { token } = req.params;
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const secret = `${process.env.JWT_SECRET}` + user.password;
  try {
    jwt.verify(req.params.token, secret);
    // res.render('reset-password', { email: user.email });
    // when the user click the link redirect him to a page in application contains passwordInput on route.get(http://localhost:3001/password/password-reset/userId/token) after put the password in the input field click changePassword the route is executed
  } catch (error) {
    console.log(error.message);
    res.json({ message: 'Error' });
  }
};

// reset the password => /reset/reset-password/:userId/:token
export const resetThePassword = async (req, res) => {
  // const { userId } = req.params;
  // const { token } = req.params;
  // const { password } = req.body;
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const secret = `${process.env.JWT_SECRET}` + user.password;
  try {
    jwt.verify(req.params.token, secret);
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user.password = req.body.password;
    await user.save();
    res.json({ message: 'password is successfully changed' });
  } catch (error) {
    console.log(error.message);
    res.json({ message: 'Error' });
  }
};
