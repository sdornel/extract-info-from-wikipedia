const { findTopicInArticles } = require('./topic-extractor/topic-extractor');
const { getUserInputUrl } = require('./user-input-tooling/user-input-tooling');
const { initiatePuppeteerSession, getUrls } = require('./web-scraper/web-scraper');
const { fetchDataFromEndpoints, formatApiEndpoints } = require('./wiki-api-fetch/wiki-api-fetch');
const { convertToFileFormat } = require('./convert-to-file-format/convert-to-file-format');

async function init() {
    try {
        console.log('================================================================');
        console.log('For now this is only intended to work with Wikipedia.');
        console.log('In the future I may extend the functionality to other websites.');
        console.log('================================================================');

        // receive data from java GUI
        // const inputData = {
        //     url: process.argv[2],
        //     topic: process.argv[3]
        // }
        const inputData = await getUserInputUrl(); // if you want to start the app without using java
        console.log(inputData.url, 'and referenced articles are being scraped for', inputData.topic);
        const startTime = Date.now();

        const browser = await initiatePuppeteerSession();
        console.log('Initiated puppeteer session');

        const urls = await getUrls(browser, inputData.url);
        console.log('Found ' + urls.length + ' pages');

        console.log('Formatting endpoints to hit');
        const apiEndpointArray = formatApiEndpoints(urls);
        
        console.log('Fetching data');
        const articles = (await fetchDataFromEndpoints(apiEndpointArray)).sort(); // sort articles variable so that it does not always return items in a different order

        console.log(`Retrieving article fragments`);
        const articleFragments = findTopicInArticles(articles, inputData.topic);
        console.log(articleFragments.length + ' article fragments retrieved. converting to file format...');
        
        convertToFileFormat(articleFragments, inputData.topic, '.docx');
        console.log('File saved successfully.');

        const endTime = Date.now(); // Record the end time
        console.log(`Execution time: ${endTime - startTime} milliseconds`); // Calculate and log the execution time
    
        browser.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

init();
