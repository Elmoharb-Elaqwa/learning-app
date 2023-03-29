import Category from '../models/Category.js';
import mongoose from 'mongoose';
export const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = await Category.create({ name });
    res.status(200).json(newCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).populate('categoryCourses');
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    res.status(200).json({ deletedCategory: deletedCategory });
  } catch (error) {
    res.status(400).json({ error: error.messgae });
  }
};

// get category by id
export const getCategoryCoursesById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No Category with that id');
  }
  try {
    const categoryCourses = await Category.findById(id).populate(
      'categoryCourses'
    );
    res.send(categoryCourses.categoryCourses);
  } catch (error) {
    res.send(error.message);
  }
};

// update category courses by id
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No Category with that id');
  }

  try {
    if (name) {
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        {
          name,
        },
        { new: true }
      );
      res.send(updatedCategory);
    }
  } catch (error) {
    res.send(error.message);
  }
};

// get category by id
// export const getCategoryById = async (req, res) => {
//   const { id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).send('No Category with that id');
//   }
//   try {
//     const category = await Category.findById(id);
//     res.send(category);
//   } catch (error) {
//     res.send(error.message);
//   }
// };
