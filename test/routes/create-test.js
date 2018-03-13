const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Video = require('../../models/video');

const {parseTextFromHTML, parseAttributeFromHTML, buildVideoObject} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /videos/create', () => {
  beforeEach(connectDatabaseAndDropData);
  afterEach(diconnectDatabase);

  describe('GET', () => {
    it('contains a form with method post and action /videos/create', async () => {
      const response = await request(app)
        .get('/videos/create');
      assert.equal(parseAttributeFromHTML(response.text, 'form', 'method'), 'post',
        'Expected a form with method post');
      assert.equal(parseAttributeFromHTML(response.text, 'form', 'action'), '/videos/create',
        'Expected a form with action /videos/create');
    });

    it('renders empty input fields', async () => {
      const response = await request(app)
        .get('/videos/create');
      assert.equal(parseTextFromHTML(response.text, 'input#title-input'), '',
        'Expected empty title input field');
      assert.equal(parseTextFromHTML(response.text, 'textarea#description-input'), '',
        'Expected empty description input field');
      assert.equal(parseTextFromHTML(response.text, 'input#url-input'), '',
        'Expected empty url input field');
    });
  });

  describe('POST', () => {
    var videoToCreate;
    const postVideo = async (video) => {
      return await request(app)
        .post('/videos/create')
        .type('form')
        .send(video);
    };
    beforeEach(function() {
      videoToCreate = buildVideoObject();
    });

    it('responds with 302 redirect and displays the videos show page on success', async () => {
      const response = await postVideo(videoToCreate);
      const video = await Video.findOne({});
      assert.equal(response.status, 302,
        'Expected 302 response status');
      assert.equal(response.headers.location, `/videos/${video._id}`,
        'Expected to be redirected to the videos show page');
    });

    it('saves a new video to the database', async () => {
      const response = await postVideo(videoToCreate);
      const video = await Video.find({});
      assert.equal(video.length, 1,
        'Expected a new video in the database');
      assert.equal(videoToCreate.title, video[0].title,
        'Expected video to have a title');
      assert.equal(videoToCreate.description, video[0].description,
        'Expected video to have a description');
      assert.equal(videoToCreate.url, video[0].url,
        'Expected video to have a url');
    });

    it('does not save a video when title is missing', async () => {
      videoToCreate.title = '';
      const response = await postVideo(videoToCreate);
      const video = await Video.find({});
      assert.equal(video.length, 0, 'Expected no videos in the database');
    });

    it('does not save a video when description is missing', async () => {
      videoToCreate.description = '';
      const response = await postVideo(videoToCreate);
      const video = await Video.find({});
      assert.equal(video.length, 0, 'Expected no videos in the database');
    });

    it('does not save a video when url is missing', async () => {
      videoToCreate.url = '';
      const response = await postVideo(videoToCreate);
      const video = await Video.find({});
      assert.equal(video.length, 0, 'Expected no videos in the database');
    });

    it('responds with status 400 when title is missing', async () => {
      videoToCreate.title = '';
      const response = await postVideo(videoToCreate);
      assert.equal(response.status, 400, 'Expected 400 response status');
    });

    it('responds with status 400 when description is missing', async () => {
      videoToCreate.description = '';
      const response = await postVideo(videoToCreate);
      assert.equal(response.status, 400, 'Expected 400 response status');
    });

    it('responds with status 400 when url is missing', async () => {
      videoToCreate.url = '';
      const response = await postVideo(videoToCreate);
      assert.equal(response.status, 400, 'Expected 400 response status');
    });

    it('renders the create form with an error when title is missing', async () => {
      videoToCreate.title = '';
      const response = await postVideo(videoToCreate);
      assert.equal(parseAttributeFromHTML(response.text, 'form', 'action'), '/videos/create',
        'Expected form with action /videos/create present on the page');
      assert.include(parseTextFromHTML(response.text, 'span.error'), 'required',
        'Expected error text on the page');
    });

    it('renders the create form with an error when description is missing', async () => {
      videoToCreate.description = '';
      const response = await postVideo(videoToCreate);
      assert.equal(parseAttributeFromHTML(response.text, 'form', 'action'), '/videos/create',
        'Expected form with action /videos/create present on the page');
      assert.include(parseTextFromHTML(response.text, 'span.error'), 'required',
        'Expected error text on the page');
    });

    it('renders the create form with an error when url is missing', async () => {
      videoToCreate.url = '';
      const response = await postVideo(videoToCreate);
      assert.equal(parseAttributeFromHTML(response.text, 'form', 'action'), '/videos/create',
        'Expected form with action /videos/create present on the page');
      assert.include(parseTextFromHTML(response.text, 'span.error'), 'required',
        'Expected error text on the page');
    });

    it('url and description are still present after submitting with empty title field', async () => {
      videoToCreate.title = '';
      const response = await postVideo(videoToCreate);
      assert.include(response.text, videoToCreate.description,
        'Expected videos description to be present on the page');
      assert.include(response.text, videoToCreate.url,
        'Expected videos url to be present on the page');
    });
  });

});
