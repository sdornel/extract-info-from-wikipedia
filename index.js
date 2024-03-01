const { getUserInputUrl } = require('./user-input-tooling/user-input-tooling');
const { initiatePuppeteerSession, getUrls } = require('./web-scraper/web-scraper-service');
const { fetchDataFromEndpoints, formatApiEndpoints } = require('./wiki-api-fetch/wiki-api-fetch-service');

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

        const apiEndpointArray = formatApiEndpoints(urls);
        
        // I need to begin fetching the data from the endpoints.
        const articles = await fetchDataFromEndpoints(apiEndpointArray);
        findWordInArticles(articles, inputData.topic);
        // TODO:
        // figure out if wikipedia will ban you for acting like a bot
        // make some sort of rate limiter for when you add in more links
        // ensure you can iterate two links deeper than the surface stuff you have now
        // get all references to "topic" + 100 words before and 100 words after
        // get the text + url + page title into an object
        // store in DB
        // hook up AWS?
        // i also need to somehow be notified if my code is not working due to wiki API changes/deprecations
    } catch (error) {
        console.error('Error:', error);
    }
}

function findWordInArticles(articles, topic) {
    const results = [];

    for (let article of articles) {
        const words = article.text.split(/\s+/); // split article into words

        for (let i = 0; i < words.length; i++) {
            if (words[i] === topic) {
                // <<<YOUR CHOSEN TOPIC>>> + ' ' === 24 characters
                words[i] = '<<<YOUR CHOSEN TOPIC>>> ' + words[i] + ' <<<YOUR CHOSEN TOPIC>>>';
                const startIndex = Math.max(0, i - 124); // start index of context
                const endIndex = Math.min(words.length - 1, i + 124); // end index of context

                // extract context
                const context = words.slice(startIndex, endIndex + 1).join(' ');

                results.push({
                    title: article.title,
                    url: article.url,
                    text: context,
                });

                // // skip forward to avoid overlapping occurrences
                // i += 100;
            }
        }
    }
    console.log('results', results);
    return results;
}

// search every page for the inputted keyword or phrase
async function searchForTopic(page, topic) {
    const bodyText = await page.evaluate(() => document.body.innerText);
    return bodyText.includes(phrase);
}

init();