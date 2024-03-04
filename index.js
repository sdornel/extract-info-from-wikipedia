const { findTopicInArticles } = require('./topic-extractor/topic-extractor');
const { getUserInputUrl } = require('./user-input-tooling/user-input-tooling');
const { initiatePuppeteerSession, getUrls } = require('./web-scraper/web-scraper');
const { fetchDataFromEndpoints, formatApiEndpoints } = require('./wiki-api-fetch/wiki-api-fetch');

const fs = require('fs');

// don't forget to implement a rate-limiter as well
async function init() {
    try {
        console.log('================================================================');
        console.log('For now this is only intended to work with Wikipedia.');
        console.log('In the future I may extend the functionality to other websites.');
        console.log('================================================================');

        const inputData = await getUserInputUrl();
        console.log(inputData.url, 'is being scraped for', inputData.topic);
        const startTime = Date.now();

        const browser = await initiatePuppeteerSession();
        console.log('Initiated puppeteer session');

        const urls = await getUrls(browser, inputData.url);
        console.log('Found ' + urls.length + ' pages');

        console.log('Formatted endpoints to hit');
        const apiEndpointArray = formatApiEndpoints(urls);
        
        console.log('Fetching data');
        const articles = await fetchDataFromEndpoints(apiEndpointArray);
        // i should sort articles variable so that it does not always return items in a different order

        console.log('Retrieving article fragments');
        const articleFragments = findTopicInArticles(articles, inputData.topic);
        console.log('Article fragments retrieved. converting to file format...');
        
        convertToFileFormat(articleFragments, inputData.topic, '.docx');
        console.log('File saved successfully.');

        const endTime = Date.now(); // Record the end time
        console.log(`Execution time: ${endTime - startTime} milliseconds`); // Calculate and log the execution time
    
        browser.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

function convertToFileFormat(articleFragments, topic, chosenFormat) {
    console.log('topic', topic);

    // this works for txt. not sure if it would work for other file formats
    const stringFormatArticleFragments = articleFragments.join('\n\n');

    // ensure the directory exists
    if (!fs.existsSync('./extracted-text-files/')){
        fs.mkdirSync('./extracted-text-files/');
    }
    
    const filePath = './extracted-text-files/' + topic.split('_').join('') + Date.now() + chosenFormat;

    fs.writeFile(filePath, stringFormatArticleFragments, (err) => {
        if (err) {
          console.error('Error writing file:', err);
        }
    });
}

init();