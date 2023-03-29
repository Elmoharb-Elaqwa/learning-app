import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    videos: [{ type: String, required: true }],
    // videoOwnerCourse: {
    //   type: mongoose.Types.ObjectId,
    //   ref: 'Courses',
    //   required: true,
    // },
  },

  { timestamps: true }
);

const Media = mongoose.model('Media', MediaSchema);

export default Media;
