const router = require('express').Router();
const Video = require('../models/video');

const buildAndValidateVideo = (request) => {
  const {url, title, description} = request.body;
  var video = Video({url, title, description});
  video.validateSync();
  return video;
};

router.get('/videos', async (req,res) => {
  const videos = await Video.find({});
  res.render('videos/index', {videos});
});

router.get('/videos/create', async (req, res) => {
  res.render('videos/create');
});

router.post('/videos/create', async (req, res) => {
  var newVideo = buildAndValidateVideo(req);
  if (newVideo.errors) {
    res.status(400).render('videos/create', {item: newVideo});
  } else {
    const savedItem = await newVideo.save();
    res.status(201);
    res.redirect(`/videos/${savedItem._id}`);
  }
});

router.get('/videos/:id', async (req, res) => {
  const video = await Video.findById(req.params.id);
  res.render('videos/show', video);
});

router.get('/videos/:id/edit', async (req, res) => {
  const video = await Video.findById(req.params.id);
  res.render('videos/edit', {item: video});
});

router.post('/videos/:id/updates', async (req, res) => {
  const _id = req.params.id;
  var updatedVideo = buildAndValidateVideo(req);
  // Mongoose creates a new _id when converting an object to a db
  // model so we must set the _id field back to the original value
  updatedVideo._id = _id;
  if (updatedVideo.errors) {
    res.status(400).render(`videos/edit`, {item: updatedVideo});
  } else {
    await Video.findByIdAndUpdate(_id,
      {url: updatedVideo.url, title: updatedVideo.title, description: updatedVideo.description});
    res.redirect(`/videos/${_id}`);
  }
});

router.post('/videos/:id/deletions', async (req, res) => {
  await Video.deleteOne({_id: req.params.id});
  res.redirect('/');
});

module.exports = router;
