const puppeteer = require('puppeteer');

async function initiatePuppeteerSession(url) {
    // Start a Puppeteer session with:
    const browser = await puppeteer.launch({
        headless: true,
      });

    return browser;
}

async function getUrls(browser, url) {
  
  const page = await browser.newPage();
  
  // url = 'https://en.wikipedia.org/wiki/Julius_Caesar'; // here for testing purposes so you don't have to keep copy/pasting the url from wikipedia itself
  await page.goto(url, {
    waitUntil: 'networkidle0',
  });

  const mwContentTextHandle = await page.$('#mw-content-text'); // selects main section of wikipedia page
  if (!mwContentTextHandle) return [];

  const links = await page.evaluate(async (mwContentText) => {
    const linksSet = new Set(); // avoid duplicates
    const anchors = mwContentText.querySelectorAll('a');

    for (const anchor of anchors) {
      const href = anchor.href;
      if (
        href.includes('en.wikipedia.org') &&
        !href.includes('Template:') &&
        !href.includes('Template_talk:') &&
        !href.includes('Special:') &&
        !href.includes('Category:') &&
        !href.includes('Help:') &&
        !href.includes('.php') &&
        !href.includes('cite_note') &&
        !href.includes('CITEREF') &&
        !href.includes('cite_ref') &&
        !href.includes(':Citation_needed') &&
        !href.includes('Wikipedia:') &&
        !href.endsWith('(identifier)') &&
        !/\.[a-zA-Z]+$/.test(href) // test if a string ends with a dot followed by one or more alphabetic characters
      ) {
        linksSet.add(href);
      }
    }

    return (Array.from(linksSet));
  }, mwContentTextHandle);

  await page.close(); // free up resources
  links.push(url);
  return links;
}

module.exports = { initiatePuppeteerSession, getUrls };