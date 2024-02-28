const puppeteer =  require('puppeteer');
const { getUserInputUrl } = require('./user-input-tooling/user-input-tooling');

// don't forget to implement a rate-limiter as well
async function init() {
    try {
        console.log('================================================================');
        console.log('For now this is only intended to work with Wikipedia.');
        console.log('In the future I may extend the functionality to other websites.');
        console.log('================================================================');

        const inputData = await getUserInputUrl();
        console.log(inputData.url, 'is being scraped for', inputData.topic);

        const page = await initiatePuppeteerSession(inputData.url);

        const urls = await getUrls(page);
        // TODO:
        // move puppeteer logic to a new file
        // figure out if wikipedia will ban you for acting like a bot
        // make some sort of rate limiter
        // ensure you can iterate two links deeper than the surface stuff you have now
        // get all references to "topic" + 100 words before and 100 words after
        // get the text + url + page title into an object
        // store in DB
        // hook up AWS?
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function initiatePuppeteerSession(url, topic) {
    url = 'https://en.wikipedia.org/wiki/Julius_Caesar';
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
    //   const mwContentText = await page.$('#mw-content-text');

    //   if (mwContentText) {
    //     const linksSet = new Set(await mwContentText.$$eval('a', anchors => anchors.map(a => a.href)))

    //     // Convert the Set to an array and filter out links we do not want
    //     const links = [...linksSet].filter(a => {
    //         return a.includes('en.wikipedia.org') &&
    //         !a.includes('Template:') &&
    //         !a.includes('Template_talk:') &&
    //         !a.includes('Special:') &&
    //         !a.includes('Category:') &&
    //         !a.includes('Help:') &&
    //         !a.includes('.php') &&
    //         !a.includes('cite_note') &&
    //         !a.includes('CITEREF') &&
    //         !a.includes('cite_ref') &&
    //         !a.includes(':Citation_needed') &&
    //         !a.includes('Wikipedia:') &&
    //         !a.endsWith('(identifier)') &&
    //         !/\.[a-zA-Z]+$/.test(a)
    //         ;
    //     });
        
    //     links.forEach(l => console.log(l));
    //     console.log('DONE', links.length);
    //   }
    // return links;
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
      
      links.forEach(l => console.log(l));
      console.log('DONE', links.length);
      return links;
    }
}

// search every page for the inputted keyword or phrase
async function searchForTopic(page, topic) {
    const bodyText = await page.evaluate(() => document.body.innerText);
    return bodyText.includes(phrase);
}

init();