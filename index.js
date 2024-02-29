const { getUserInputUrl } = require('./user-input-tooling/user-input-tooling');
const { initiatePuppeteerSession, getUrls } = require('./services/web-scraper-service');
const { fetchDataFromEndpoints, formatApiEndpoints } = require('./services/wiki-api-fetch-service');

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
        fetchDataFromEndpoints(apiEndpointArray);

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
        console.error('Error:', error.message);
    }
}

// // refer to https://www.mediawiki.org/wiki/API:Etiquette
// function fetchDataFromEndpoints(apiEndpointArray) {
//     if (apiEndpointArray.length < 200) {

//     }
// }

// function formatApiEndpoint(urls) {
//     const apiEndpointArray = [];
//     const apiEndpointStart = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&titles=';
//     const apiEndpointEnd = '&utf8=1&rvprop=content&rvslots=main';
//     let titles = [];
//     // titles index will look like: Julius_Caesar|Pompey|Lepidus|Quintus_Mucius_Scaevola_Pontifex|Publius_Mucius_Scaevola_(consul_133_BC)
//     urls.forEach(url => {
//             if (titles.length === 0) {
//                 // it cannot be at the start of the first title
//                 titles.push(url.replace('https://en.wikipedia.org/wiki/', ''));
//             } else {
//                 // '|' needs to be at the end of every title
//                 titles.push('|' + url.replace('https://en.wikipedia.org/wiki/', ''));
//             }

//             if (titles.length === 50) {
//                 apiEndpointArray.push(apiEndpointStart + titles.join('') + apiEndpointEnd);
//                 titles = [];
//             }
//     });
//     console.log('apiEndpointArray[0]', apiEndpointArray[0]);
//     console.log('apiEndpointArray.length', apiEndpointArray.length);

//     return apiEndpointArray
// }

// search every page for the inputted keyword or phrase
async function searchForTopic(page, topic) {
    const bodyText = await page.evaluate(() => document.body.innerText);
    return bodyText.includes(phrase);
}

init();