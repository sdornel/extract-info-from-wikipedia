// const fetch = require('node-fetch');
// const puppeteer = require('puppeteer');


// refer to https://www.mediawiki.org/wiki/API:Etiquette
async function fetchDataFromEndpoints(apiEndpointArray) {
    const dataHash = {};
    const dataArray = [];
    if (apiEndpointArray.length < 200) {
        await Promise.all(apiEndpointArray.map(async endpoint => {
            const res = await fetch(endpoint);
            if (res.ok) {
                const data = await res.json();
                // console.log(data);
                for (const key in data.query.pages) { // consider using an array instead of an object
                    // console.log('data.query.pages[key]', data.query.pages[key]);
                    const title = data.query.pages[key].title;

                    const url = 'https://en.wikipedia.org/wiki/' + title.replaceAll(' ', '_');
                    dataHash[data.query.pages[key].title] = {
                        title: title,
                        url: url,
                        text: data.query.pages[key].revisions[0].slots.main['*'].toLowerCase().replace(/<[^>]+>|&nbsp;|<\/?[^>]+>|'{5}/gi, ''),
                    }
                    dataArray.push({
                        title: title,
                        url: url,
                        text: data.query.pages[key].revisions[0].slots.main['*'].toLowerCase().replace(/<[^>]+>|&nbsp;|<\/?[^>]+>|'{5}/gi, ''),
                    })
                    // dataArray.push(data.query.pages[key].revisions[0].slots.main['*']);
                }
              }
        }))
    }
    // this dataset is insanely big. i need to keep things highly performant here.
    // at this point i can probably use the "topic" from the input to filter data?
    // i will have to display the ~100 words before and after the topic for each
    // instance that topic appears
    // perhaps a script to move things into a txt file
    // console.log('dataHash', dataHash);
    console.log('dataArray', dataArray.join('').length);
    // return dataHash;
    return dataArray;
}

function formatApiEndpoints(urls) {
    const apiEndpointArray = [];
    const apiEndpointStart = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&titles=';
    const apiEndpointEnd = '&utf8=1&rvprop=content&rvslots=main';
    let titles = [];
    // titles index will look like: Julius_Caesar|Pompey|Lepidus|Quintus_Mucius_Scaevola_Pontifex|Publius_Mucius_Scaevola_(consul_133_BC)
    urls.forEach(url => {
            if (url.includes('#')) {
                /**
                 * the # sign takes you to a certain section of a wiki page
                 * the API uses page titles without the # when retrieving body text
                 */
                url = url.split('#')[0];
            }
            if (titles.length === 0) {
                // it cannot be at the start of the first title
                titles.push(url.replace('https://en.wikipedia.org/wiki/', ''));
            } else {
                // '|' needs to be at the end of every title
                titles.push('|' + url.replace('https://en.wikipedia.org/wiki/', ''));
            }

            if (titles.length === 50) {
                apiEndpointArray.push(apiEndpointStart + titles.join('') + apiEndpointEnd);
                titles = [];
            }
    });
    // urls.indexOf()
    console.log('apiEndpointArray[0]', apiEndpointArray[0]);
    // console.log('apiEndpointArray.length', apiEndpointArray.length);

    return apiEndpointArray
}

module.exports = { fetchDataFromEndpoints, formatApiEndpoints };