const puppeteer = require('puppeteer');

async function initiatePuppeteerSession(url, topic) {
    url = 'https://en.wikipedia.org/wiki/Julius_Caesar'; // temp hardcoded value. please remove
    // Start a Puppeteer session with:
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
      });
    
      // Open a new page
      const page = await browser.newPage();

      // navigate to inputted url
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
      });
    return page;
}

async function getUrls(page) {
    const mwContentText = await page.$('#mw-content-text');

    if (mwContentText) {
      const linksSet = new Set(await mwContentText.$$eval('a', anchors => anchors.map(a => a.href)));

      // Convert the Set to an array and filter out links we do not want
      const links = [...linksSet].filter(a => {
          return a.includes('en.wikipedia.org') &&
          !a.includes('Template:') &&
          !a.includes('Template_talk:') &&
          !a.includes('Special:') &&
          !a.includes('Category:') &&
          !a.includes('Help:') &&
          !a.includes('.php') &&
          !a.includes('cite_note') &&
          !a.includes('CITEREF') &&
          !a.includes('cite_ref') &&
          !a.includes(':Citation_needed') &&
          !a.includes('Wikipedia:') &&
          !a.endsWith('(identifier)') &&
          !/\.[a-zA-Z]+$/.test(a)
          ;
      });
      
      return links;
    }
}

module.exports = { initiatePuppeteerSession, getUrls };