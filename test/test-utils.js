const {jsdom} = require('jsdom');

const Video = require('../models/video');

const buildVideoObject = (options = {}) => {
  const title = options.title || 'Antarctica Deep Bore';
  const url = options.url || 'https://www.youtube.com/embed/fyjt5zpNAeg';
  const description = options.description || 'Deep Bore Into Antarctica Finds Freezing Ice, Not Melting as Expected | National Geographic';
  return {url, title, description};
};

const seedItemToDatabase = async (options = {}) => {
  const item = await Video.create(buildItemObject(options));
  return item;
};

const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

const parseAttributeFromHTML = (htmlAsString, selector, attribute) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    const elementAttribute = selectedElement.getAttribute(attribute);
    if (selectedElement !== null) {
      return elementAttribute;
    } else {
      throw new Error(`No attribute ${attribute} with selector ${selector} found in HTML string`)
    }
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.random()}`;
};

const fillAndSubmitVideo = (video) => {
  browser.setValue('#url-input', video.url);
  browser.setValue('#title-input', video.title);
  browser.setValue('#description-input', video.description);
  browser.click('.submit-button');
}

module.exports = {
  buildVideoObject,
  seedItemToDatabase,
  parseTextFromHTML,
  parseAttributeFromHTML,
  generateRandomUrl,
  fillAndSubmitVideo
};
