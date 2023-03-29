import Media from '../models/Media.js';
import mongoose from 'mongoose';
import Courses from '../models/Courses.js';

// get videos for a specific course
export const getAllVideos = async (req, res) => {
  try {
    const media = await Media.find({});
    res.status(200).json(media);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// get video by id
export const getVideoById = async (req, res) => {
  const { id } = req.params;
  try {
    const media = await Media.findById(id);
    res.status(200).json(media);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete video by id
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No video with that id');
  }

  await Media.findByIdAndRemove(id);
  res.status(200).send('video deleted');
};

export const getVideosByLevel = async (req, res) => {
  const { level } = req.params;
  try {
    const videosByLevelFliter = await Media.find({ level });
    res.status(200).json(videosByLevelFliter);
  } catch (error) {
    res.status(error.message);
  }
};

// update video's name by id
export const updateVideoNameById = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedVideo = await Media.findByIdAndUpdate(
      id,
      { name: name },
      { new: true }
    );
    res.status(200).json(updatedVideo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get video with course id
export const getVideoWithCourseId = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Media.findById(id).populate({
      path: 'videoOwnerCourse',
    });
    res.status(200).json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// get videos with course id
// export const getVideosWithCourseId = async (req, res) => {
//   try {
//     const video = await Media.find({});
//     res.status(200).json(video);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// get videos with ownerCourseId
export const getVideosFromCourse = async (req, res) => {
  // const {videoOwnerCourse} = req.body;
  try {
    const videos = await Media.find({});
    console.log(req.params);
    res.stauts(200).json(videos);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

// add video to specifc course

export const addVideosToSpecificCourse = async (req, res) => {
  const { name } = req.body;
  const { courseId } = req.params;
  let videosPaths = [];
  if (Array.isArray(req.files.videos) && req.files.videos.length > 0) {
    for (let video of req.files.videos) {
      videosPaths.push('/' + video.path);
    }
  }

  if (!courseId) return res.status(400).send('Course id is required');

  try {
    const course = await Courses.findById(courseId);
    if (course) {
      const newMedia = await Media.create({
        name,
        videos: videosPaths,
      });
      const updatedCourse = await Courses.findByIdAndUpdate(
        courseId,
        {
          videos: [...course.videos, newMedia._id],
        },
        { new: true }
      ).populate('videos');

      return res.send(updatedCourse);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};
