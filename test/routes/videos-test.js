const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Video = require('../../models/video');

const {parseTextFromHTML, parseAttributeFromHTML, buildVideoObject, generateRandomUrl} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

const createVideo = async () => {
  const video = buildVideoObject();
  const videoToCreate = new Video(video);
  return await videoToCreate.save();
}

describe('Server path: /videos/:id', () => {
  beforeEach(connectDatabaseAndDropData);
  afterEach(diconnectDatabase);

  describe('GET', async () => {
    it('renders an existing video', async () => {
      const video = await createVideo();
      const response = await request(app)
        .get(`/videos/${video._id}`);
      assert.include(response.text, video.title,
        'Expected the videos title to be present');
      assert.equal(parseAttributeFromHTML(response.text, 'iframe', 'src'), video.url,
        'Expected an iframe with source video url to be present');
    });
  });
});

describe('Server path: /videos/:id/edit', () => {
  beforeEach(connectDatabaseAndDropData);
  afterEach(diconnectDatabase);

  describe('GET', async () => {
    it('renders a form with existing values', async () => {
      const video = await createVideo();
      const response = await request(app)
        .get(`/videos/${video._id}/edit`);
      assert.include(parseAttributeFromHTML(response.text, 'input#title-input', 'value'), video.title,
        'Expected the videos title to be present');
      assert.equal(parseAttributeFromHTML(response.text, 'input#url-input', 'value'), video.url,
        'Expected the videos url to be present');
      assert.include(parseTextFromHTML(response.text, 'textarea#description-input'), video.description,
        'Expected the videos description to be present');
    });
  });
});

describe('Server path: /videos/:id/updates', () => {
  const updateVideo = async (IdOfVideo, newInfo) => {
    return await request(app)
      .post(`/videos/${IdOfVideo}/updates`)
      .type('form')
      .send(newInfo);
  }
  var newInfo;
  beforeEach(function() {
      newInfo = { title: 'New title',
        description: 'New description',
        url: generateRandomUrl("www.youtube.com")};
      connectDatabaseAndDropData();
  });
  afterEach(diconnectDatabase);

  describe('POST', async () => {
    it('updates the video', async () => {
      const video = await createVideo();
      const response = await updateVideo(video._id, newInfo);
      const updatedVideo = await Video.findOne();
      assert.equal(updatedVideo.url, newInfo.url,
        'Expected the videos url to be updated');
      assert.equal(updatedVideo.title, newInfo.title,
        'Expected the videos title to be updated');
      assert.equal(updatedVideo.description, newInfo.description,
        'Expected the videos description to be updated');
    });

    it('responds with a 302 redirect on success', async () => {
      const video = await createVideo();
      const response = await updateVideo(video._id, newInfo);
      assert.equal(response.status, 302,
        'Expected 302 redirect response');
    });

    it('does not save a video when title is empty', async () => {
      const video = await createVideo();
      newInfo.title = '';
      const response = await updateVideo(video._id, newInfo);
      const videos = await Video.find({title: ''});
      assert.equal(videos.length, 0,
        'Expected to find no videos with empty title');
    });

    it('does not save a video when description is empty', async () => {
      const video = await createVideo();
      newInfo.description = '';
      const response = await updateVideo(video._id, newInfo);
      const videos = await Video.find({description: ''});
      assert.equal(videos.length, 0,
        'Expected to find no videos with empty description');
    });

    it('does not save a video when url is empty', async () => {
      const video = await createVideo();
      newInfo.url = '';
      const response = await updateVideo(video._id, newInfo);
      const videos = await Video.find({url: ''});
      assert.equal(videos.length, 0,
        'Expected to find no videos with empty url');
    });

    it('responds with 400 status when title is empty', async () => {
      const video = await createVideo();
      newInfo.title = '';
      const response = await updateVideo(video._id, newInfo);
      assert.equal(response.status, 400,
        'Expected 400 response status');
    });

    it('responds with 400 status when description is empty', async () => {
      const video = await createVideo();
      newInfo.description = '';
      const response = await updateVideo(video._id, newInfo);
      assert.equal(response.status, 400,
        'Expected 400 response status');
    });

    it('responds with 400 status when url is empty', async () => {
      const video = await createVideo();
      newInfo.url = '';
      const response = await updateVideo(video._id, newInfo);
      assert.equal(response.status, 400,
        'Expected 400 response status');
    });

    it('renders the update form with an error when title is empty', async () => {
      const video = await createVideo();
      newInfo.title = '';
      const response = await updateVideo(video._id, newInfo);
      assert.equal(parseAttributeFromHTML(response.text, 'form', 'action'), `/videos/${video._id}/updates`,
        'Expected form with action /videos/:id/updates present on the page');
      assert.include(parseTextFromHTML(response.text, 'span.error'), 'required',
        'Expected error text on the page');
    });

    it('renders the update form with an error when description is empty', async () => {
      const video = await createVideo();
      newInfo.description = '';
      const response = await updateVideo(video._id, newInfo);
      assert.equal(parseAttributeFromHTML(response.text, 'form', 'action'), `/videos/${video._id}/updates`,
        'Expected form with action /videos/:id/updates present on the page');
      assert.include(parseTextFromHTML(response.text, 'span.error'), 'required',
        'Expected error text on the page');
    });

    it('renders the update form with an error when url is empty', async () => {
      const video = await createVideo();
      newInfo.url = '';
      const response = await updateVideo(video._id, newInfo);
      assert.equal(parseAttributeFromHTML(response.text, 'form', 'action'), `/videos/${video._id}/updates`,
        'Expected form with action /videos/:id/updates present on the page');
      assert.include(parseTextFromHTML(response.text, 'span.error'), 'required',
        'Expected error text on the page');
    });
  });
});

describe('Server path: /videos/:id/deletions', () => {
  beforeEach(connectDatabaseAndDropData);
  afterEach(diconnectDatabase);

  describe('POST', async () => {
    it('deletes the video', async () => {
      const video = await createVideo();
      const response = await request(app)
        .post(`/videos/${video._id}/deletions`)
        .type('form')
        .send();
      const videos = await Video.find({});
      assert.equal(videos.length, 0, 'Expected an empty database (video was deleted)');
    });
  });
});
