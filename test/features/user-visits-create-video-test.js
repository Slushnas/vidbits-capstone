const {assert} = require('chai');
const {buildVideoObject, fillAndSubmitVideo} = require('../test-utils');

describe('user visits create video page', () => {
  describe('enters a url, title, description and clicks submit', () => {
    it('returns to show page and displays the video', async () => {
      const video = buildVideoObject();
      browser.url('/');
      browser.click('a[href="/videos/create"]');

      fillAndSubmitVideo(video);

      assert.equal(browser.getAttribute('iframe', 'src'), video.url,
        'Expected an iframe with src attribute equal to the videos url');
      assert.include(browser.getText('body'), video.title,
        'Expected show page to include the videos title');
      assert.include(browser.getText('body'), video.description,
        'Expected show page to include the videos description');
    })
  })
})
