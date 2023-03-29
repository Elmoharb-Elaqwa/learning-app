import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },

    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    phone: { type: Number, default: 0 },
    birth: { type: Date, default: new Date('3/27/2023') },
    isAdmin: Boolean,
    isTeacher: Boolean,
    isUser: Boolean,
    courses: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Courses',
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
export default User;
