const puppeteer =  require('puppeteer');

const getQuotes = async () => {
    // Start a Puppeteer session with:
    // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
    // - no default viewport (`defaultViewport: null` - website page will in full width and height)
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
    });
  
    // Open a new page
    const page = await browser.newPage();
  
    // On this new page:
    // - open the 'http://quotes.toscrape.com/' website
    // - wait until the dom content is loaded (HTML is ready)
    await page.goto('http://quotes.toscrape.com/', {
      waitUntil: 'domcontentloaded',
    });

    // Get page data
    const quotes = await createScrapingArray(page);
  
    // as long as there is a next page, keep getting quotes
    while (await page.$('.pager > .next > a')) {
        await page.click('.pager > .next > a');
        quotes.push(await createScrapingArray(page));
    } 

    // Display the quotes
    console.log('quotes', quotes);
    
    // Close the browser
    await browser.close();
  };
  
async function createScrapingArray(page) {
    // Get page data
    const quotes = await page.evaluate(() => {
        // Fetch the first element with class 'quote'
        const quoteList = document.querySelectorAll('.quote');
        return Array.from(quoteList).map((quote) => {
        // Fetch the sub-elements from the previously fetched quote element
        // Get the displayed text and return it (`.innerText`)
        const text = quote.querySelector('.text').innerText;
        const author = quote.querySelector('.author').innerText;
        return { text, author };
        })
    });
    return quotes;
}
  
// start script
getQuotes();
