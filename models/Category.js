import mongoose from 'mongoose';

const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    categoryCourses: [{ type: mongoose.Types.ObjectId, ref: 'Courses' }],
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
