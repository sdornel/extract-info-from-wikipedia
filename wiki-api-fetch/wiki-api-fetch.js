// refer to https://www.mediawiki.org/wiki/API:Etiquette
async function fetchDataFromEndpoints(apiEndpointArray) {
    const dataArray = [];
    // if (apiEndpointArray.length < 200) { // need to avoid overloading the system. should remove this later
        await Promise.all(apiEndpointArray.map(async endpoint => {
            const res = await fetch(endpoint);
            if (res.ok) {
                const data = await res.json();
                for (const key in data.query.pages) {
                    const title = data.query.pages[key].title;

                    const url = 'https://en.wikipedia.org/wiki/' + title.replaceAll(' ', '_');

                    // /<[^>]+>|&nbsp;|<\/?[^>]+>|'{5}/gi === remove HTML tags, &nbsp;, and 5 consecutive ' marks
                    dataArray.push({
                        title: title,
                        url: url,
                        text: data.query.pages[key].revisions[0].slots.main['*'].replace(/<[^>]+>|&nbsp;|<\/?[^>]+>|'{5}/gi, ''),
                    });
                }
              }
        }));
    // }
    return dataArray;
}

function formatApiEndpoints(urls) {
    const apiEndpointArray = [];
    const apiEndpointStart = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&titles=';
    const apiEndpointEnd = '&utf8=1&rvprop=content&rvslots=main';
    let titles = [];
    // titles index will look like: Julius_Caesar|Pompey|Lepidus|Quintus_Mucius_Scaevola_Pontifex|Publius_Mucius_Scaevola_(consul_133_BC)
    urls.forEach((url, index) => {
        if (url.includes('#')) {
            /**
             * the # sign takes you to a certain section of a wiki page
             * the API uses page titles without the # when retrieving body text
             */
            url = url.split('#')[0];
        }
        if (titles.length === 0) {
            // '|' cannot be at the start of the first title
            titles.push(url.replace('https://en.wikipedia.org/wiki/', ''));
        } else {
            // '|' needs to be at the end of every title for API urls
            titles.push('|' + url.replace('https://en.wikipedia.org/wiki/', ''));
        }

        if (titles.length === 50) { // wikipedia only allows 50 title values in one request
            apiEndpointArray.push(apiEndpointStart + titles.join('') + apiEndpointEnd);
            titles = [];
        }
        if (index === urls.length-1) { // if final batch of titles is not length 50, add them to array anyway
            apiEndpointArray.push(apiEndpointStart + titles.join('') + apiEndpointEnd);
        }
    });
    return apiEndpointArray
}

module.exports = { fetchDataFromEndpoints, formatApiEndpoints };