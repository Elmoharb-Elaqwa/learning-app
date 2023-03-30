import Courses from '../models/Courses.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';

// fliter courses by category
export const getAllCourses = async (req, res) => {
  let filterCategories = {};
  if (req.params.categoryId) {
    filterCategories = { category: req.params.categoryId };
  }
  try {
    const courses = await Courses.find(filterCategories).populate('videos');
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCourseById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No course with that id');
  }
  try {
    const deletedCourse = await Courses.findByIdAndRemove(id);
    res.status(200).json({ deletedCourse: deletedCourse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCourseById = async (req, res) => {
  const { id } = req.params;
  const { name, teacher, levelsOfCourse, description, price } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No course with that id');
  }
  try {
    const updatedCourse = await Courses.findByIdAndUpdate(
      id,
      {
        name,
        teacher: teacher,
        levelsOfCourse,
        description,
        price,
      },
      { new: true }
    );
    res.status(200).json({ updatedCourse: updatedCourse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// add courses to user

// add course to specific category
export const addCoursesToSpecificCate = async (req, res) => {
  const { categoryId } = req.params;
  const { name, teacher, description, levelsOfCourse, price } = req.body;
  if (!categoryId) return res.status(400).send('Category id is required');

  try {
    const category = await Category.findById(categoryId);
    if (category) {
      const newCourse = await Courses.create({
        name,
        teacher,
        description,
        levelsOfCourse,
        price,
        subscribe: false,
      });
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        {
          categoryCourses: [...category.categoryCourses, newCourse._id],
        },
        { new: true }
      ).populate('categoryCourses');

      return res.send(updatedCategory);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }

  // console.log(course);
};

// get course by id
export const getCourseVideos = async (req, res) => {
  const { courseId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(404).send('No course with that id');
  }

  try {
    const course = await Courses.findById(courseId).populate('videos');
    res.status(200).json(course.videos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
