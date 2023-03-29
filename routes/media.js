import express from 'express';
import {
  addVideosToSpecificCourse,
  deleteVideo,
  getAllVideos,
  getVideoById,
  updateVideoNameById,
} from '../controllers/media.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { verifyToken } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
const mediaRouter = express.Router({ mergeParams: true });

//get all media
mediaRouter.get('/', [verifyToken, admin], getAllVideos);

// create new media

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public');
    }
    if (!fs.existsSync('public/videos')) {
      fs.mkdirSync('public/videos');
    }
    cb(null, '../public/videos');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);
    if (ext !== '.mkv' && ext !== '.mp4') {
      return cb(new Error('Only Videos Are Allowed !'));
    }
    cb(null, true);
  },
});

// delete video by id
mediaRouter.delete('/:id', [verifyToken, admin], deleteVideo);

// update video's name by id
mediaRouter.patch('/:id', [verifyToken, admin], updateVideoNameById);

//new work
// add video to specific course
mediaRouter.put(
  '/:courseId',
  [verifyToken, admin],
  upload.fields([
    {
      name: 'videos',
      maxCount: 5,
    },
  ]),
  addVideosToSpecificCourse
);

// get video by id
mediaRouter.get('/:id', verifyToken, getVideoById);
export default mediaRouter;
