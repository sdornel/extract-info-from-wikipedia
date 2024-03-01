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

        const page = await initiatePuppeteerSession(inputData.url);

        const urls = await getUrls(page);
        console.log('Found ' + urls.length + ' pages');

        const apiEndpointArray = formatApiEndpoints(urls);
        
        const articles = await fetchDataFromEndpoints(apiEndpointArray);
        // i should sort articles variable so that it does not always return items in a different order

        console.log('Retrieving article fragments');
        const articleFragments = findTopicInArticles(articles, inputData.topic);
        console.log('Article fragments retrieved. converting to file format...');
        
        convertToFileFormat(articleFragments, inputData.topic, '.docx');
        console.log('File saved successfully.');
        // TODO:
        // figure out if wikipedia will ban you for acting like a bot after you start getting 800^800 articles
        // make some sort of rate limiter for when you add in more links
        // ensure you can iterate one link deeper than the surface stuff you have now
        // if topic mentioned twice within the 200 word span, combine both texts to decrease file bloat?
        // i have so many different configuration options that i thought of. i need to create a more
        // user friendly interface to handle all the different options
        // store in DB?
        // hook up AWS?
        // i also need to somehow be notified if my code is not working due to wiki API changes/deprecations
    } catch (error) {
        console.error('Error:', error);
    }
}

function convertToFileFormat(articleFragments, topic, chosenFormat) {
    console.log('topic', topic);

    // this works for txt. not sure if it would work for other file formats
    const stringFormatArticleFragments = articleFragments.join('\n\n');
    console.log('stringFormatArticleFragments', stringFormatArticleFragments);
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

function writeTextFile(filePath, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

init();