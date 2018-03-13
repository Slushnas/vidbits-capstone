const router = require('express').Router();
const Video = require('../models/video');

router.get('/videos', async (req,res) => {
  const videos = await Video.find({});
  res.render('videos/index', {videos});
});

router.get('/videos/create', async (req, res) => {
  res.render('videos/create');
});

router.post('/videos/create', async (req, res) => {
  const {url, title, description} = req.body;
  const newVideo = new Video({url, title, description});
  newVideo.validateSync();
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
  const {url, title, description} = req.body;
  const updatedVideo = Video({_id, url, title, description});
  updatedVideo.validateSync();
  if (updatedVideo.errors) {
    res.status(400).render(`videos/edit`, {item: updatedVideo});
  } else {
    await Video.findByIdAndUpdate(_id, {url, title, description});
    res.redirect(`/videos/${_id}`);
  }
});

router.post('/videos/:id/deletions', async (req, res) => {
  await Video.deleteOne({_id: req.params.id});
  res.redirect('/');
});

module.exports = router;
