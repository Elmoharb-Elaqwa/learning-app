import mongoose from 'mongoose';

const coursesMedia = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    teacher: { type: String, required: true },
    levelsOfCourse: { type: Number, required: true },
    description: { type: String, required: true },
    price: {
      type: Number,
      required: true,
    },
    videos: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Media',
      },
    ],
  },
  { timestamps: true }
);

const Courses = mongoose.model('Courses', coursesMedia);

export default Courses;
