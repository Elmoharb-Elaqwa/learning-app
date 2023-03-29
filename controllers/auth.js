import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    if (password === confirmPassword) {
      const newUser = new User({
        fullName,
        email,
        password: passwordHash,
      });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } else {
      res.send('password and confirm password must be equal');
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: 'User does not exist. ' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials. ' });

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        isTeacher: user.isTeacher,
        courses: user.courses,
      },
      process.env.JWT_SECRET
    );
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    await User.findOneAndUpdate(email, { password: passwordHash });
    res.status(200).json({ message: 'Password is reset successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// courses subscription
// courses subscription
export const getCoursesUserSubscription = async (req, res) => {
  let filterCourses = {};
  if (req.params.userId) {
    filterCourses = { coursesSubscribed: req.params.userId };
    console.log(req.params.courseId);
  }
  try {
    const courses = await Courses.find(filterCourses).populate(
      'coursesSubscribed'
    );
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update user information
export const updateUserInformation = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, birth } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No user with that id');
  }

  try {
    if (name && email && phone && birth) {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          fullName: name,
          email: email,
          phone: phone,
          birth: new Date(birth),
        },
        { new: true }
      );
      res.status(200).json({ updatedUser: updatedUser });
    } else {
      res.send('you should fill all field');
    }
  } catch (error) {
    res.send(error.message);
  }
};
// get user courses which he subscriped

export const userCourses = async (req, res) => {
  try {
    const allCourses = await User.findById(req.user.id).populate('courses');

    res.status(200).json(allCourses.courses);
  } catch (error) {
    console.log(error.message);
  }
};

// delete user account
export const deleteUserAccount = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user.id);
    res.send(deletedUser);
  } catch (error) {
    res.send(error.message);
  }
};

// get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate('courses');
    res.send(users);
  } catch (error) {
    res.send(error.message);
  }
};

/* Reset Password Function */
