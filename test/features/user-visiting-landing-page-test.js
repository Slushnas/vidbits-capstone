const {assert} = require('chai');
const {buildVideoObject, generateRandomUrl, fillAndSubmitVideo} = require('../test-utils');

describe('user visits landing page', () => {
  describe('without existing items', () => {
    it('starts blank', async () => {
      browser.url('/');
      const videos = browser.getText('#videos-container');
      assert.equal(videos, '', 'Expected no content in #videos-container');
    });
  });

  describe('clicks on add new item', () => {
    it('takes the user to /videos/create', () => {
      browser.url('/');
      browser.click('a[href="/videos/create"]');
      assert.include(browser.getText('body'), 'Save a video',
        'Expected to land on the create page');
      assert.include(browser.getUrl(), '/videos/create',
        'Expected url path to include /videos/create')
    });
  });

  describe('with existing video', () => {
    it('renders the video', async () => {
      const video = buildVideoObject();
      browser.url('/');
      browser.click('a[href="/videos/create"]');
      video.url = generateRandomUrl('www.youtube.com');
      fillAndSubmitVideo(video);

      browser.url('/');

      assert.include(browser.getText('body'), video.title,
        'Expected landing page to include the videos title');
      assert.equal(browser.getAttribute('iframe', 'src'), video.url,
        'Expected an iframe with src attribute equal to the videos url');
    });

    it('can navigate to a videos show page', async () => {
      const video = buildVideoObject();
      browser.url('/');
      browser.click('a[href="/videos/create"]');
      video.url = generateRandomUrl('www.youtube.com');
      fillAndSubmitVideo(video);
      browser.url('/');

      browser.click('.video-card a[href*="/videos/"]');

      assert.include(browser.getSource(), video.title,
        'Expected the videos title on the show page');
      assert.include(browser.getSource(), video.description,
        'Expected the videos description on the show page');
    });
  });
});
