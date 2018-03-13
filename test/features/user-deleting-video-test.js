const {assert} = require('chai');
const {buildVideoObject, fillAndSubmitVideo} = require('../test-utils');

describe('user visits show page', () => {
  describe('clicks on the delete button', () => {
    it('deletes the video', async () => {
      const video = buildVideoObject();
      browser.url('/');
      browser.click('a[href="/videos/create"]');
      fillAndSubmitVideo(video);
      browser.url('/');
      browser.click('.video-card a[href*="/videos/"]');

      browser.click('#delete-button');

      assert.equal(browser.getUrl(), 'http://localhost:8001/videos',
        'Expected to be on the landing page');
      assert.notInclude(browser.getHTML('body'), video.title,
        'Expected landing page to be missing the videos title');
    });
  });
});
