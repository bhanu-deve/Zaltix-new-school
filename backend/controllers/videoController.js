import Video from '../models/AddVideo.js';

// GET all videos
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .exec();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

// ADD new video
export const createVideo = async (req, res) => {
  try {
    const { title, subject, url } = req.body;

    const newVideo = await Video.create({
      title,
      subject,
      url,
      thumbnail: '/placeholder.svg',
      uploadDate: new Date().toISOString().split('T')[0],
    });

    res.status(201).json(newVideo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add video' });
  }
};

// UPDATE video
export const updateVideo = async (req, res) => {
  try {
    const { title, subject, url } = req.body;

    const updated = await Video.findByIdAndUpdate(
      req.params.id,
      { title, subject, url },
      { new: true }
    ).exec();

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update video' });
  }
};

// DELETE video
export const deleteVideo = async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id).exec();
    res.json({ message: 'Video deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete video' });
  }
};
