const {assert} = require('chai');
const Video = require('../../models/video');
const {mongoose, databaseUrl, options} = require('../../database');

describe('Video model', () => {
  describe('title', () => {
    it('is a string', async () => {
      const titleAsNumber = 5;
      const video = new Video({title: titleAsNumber});
      assert.strictEqual(video.title, titleAsNumber.toString(),
        'Expected video title to be a string');
    });

    it('is required', async () => {
      const video = new Video({});
      video.validateSync();
      assert.equal(video.errors.title.message, 'Path `title` is required.',
        'Expected error message when video title is missing');
    });
  });

  describe('description', () => {
    it('is a string', async () => {
      const descriptionAsNumber = 5;
      const video = new Video({description: descriptionAsNumber});
      assert.strictEqual(video.description, descriptionAsNumber.toString(),
        'Expected video description to be a string');
    });

    it('is required', async () => {
      const video = new Video({});
      video.validateSync();
      assert.equal(video.errors.description.message, 'Path `description` is required.',
        'Expected error message when video description is missing');
    });
  });

  describe('url', () => {
    it('is a string', async () => {
      const urlAsNumber = 5;
      const video = new Video({url: urlAsNumber});
      assert.strictEqual(video.url, urlAsNumber.toString(),
        'Expected video url to be a string');
    });

    it('is required', async () => {
      const video = new Video({});
      video.validateSync();
      assert.equal(video.errors.url.message, 'Path `url` is required.',
        'Expected error message when video url is missing');
    });
  });

});
