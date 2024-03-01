// refer to https://www.mediawiki.org/wiki/API:Etiquette
async function fetchDataFromEndpoints(apiEndpointArray) {
    const dataHash = {};
    const dataArray = [];
    if (apiEndpointArray.length < 200) {
        await Promise.all(apiEndpointArray.map(async endpoint => {
            const res = await fetch(endpoint);
            if (res.ok) {
                const data = await res.json();
                for (const key in data.query.pages) { // consider using an array instead of an object
                    const title = data.query.pages[key].title;

                    const url = 'https://en.wikipedia.org/wiki/' + title.replaceAll(' ', '_');

                    // /<[^>]+>|&nbsp;|<\/?[^>]+>|'{5}/gi === remove HTML tags, &nbsp;, and 5 consecutive ' marks
                    dataHash[data.query.pages[key].title] = {
                        title: title,
                        url: url,
                        text: data.query.pages[key].revisions[0].slots.main['*'].replace(/<[^>]+>|&nbsp;|<\/?[^>]+>|'{5}/gi, ''),
                    }
                    dataArray.push({
                        title: title,
                        url: url,
                        text: data.query.pages[key].revisions[0].slots.main['*'].replace(/<[^>]+>|&nbsp;|<\/?[^>]+>|'{5}/gi, ''),
                    })
                }
              }
        }))
    }
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
                // '|' needs to be at the end of every title for API urls
                titles.push('|' + url.replace('https://en.wikipedia.org/wiki/', ''));
            }

            if (titles.length === 50) {
                apiEndpointArray.push(apiEndpointStart + titles.join('') + apiEndpointEnd);
                titles = [];
            }
    });
    return apiEndpointArray
}

module.exports = { fetchDataFromEndpoints, formatApiEndpoints };