const {assert} = require('chai');
const {buildVideoObject, generateRandomUrl, fillAndSubmitVideo} = require('../test-utils');

describe('user visits a videos show page', () => {
  describe('clicks on the edit button', () => {
    it('takes the user to /videos/:id/edit', async () => {
      const video = buildVideoObject();
      browser.url('/videos/create');
      fillAndSubmitVideo(video);

      browser.click('#edit-button');

      assert.include(browser.getSource(), video.title,
        'Expected edit page to include the videos title');
    });

    it('does not create a new video when submitting updated values', async () => {
      const video = buildVideoObject();
      browser.url('/videos/create');
      fillAndSubmitVideo(video);

      browser.click('#edit-button');
      fillAndSubmitVideo({
        url: generateRandomUrl("www.youtube.com"),
        title: "New Title",
        description: "New description"
      });
      browser.url('/');

      assert.notInclude(browser.getSource(), video.title,
        'Expected the landing page to be missing the videos previous title');
    });
  });
});
