function findTopicInArticles(articles, topic) {
    const results = [];

    for (let article of articles) {
        const words = article.text.split(/\s+/); // split article into words

        for (let i = 0; i < words.length; i++) {
            if (words[i].toLowerCase() === topic) {
                /**
                 * EDGE CASE TO ACCOUNT FOR:
                 * if 'legion' is mentioned multiple times in the 100 character span, 
                 * get startIndex of first 'legion' and endIndex of last 'legion'
                 * this should help you avoid redundant texts?
                 */

                // <<<YOUR CHOSEN TOPIC>>> + ' ' === 24 characters
                words[i] = '<<<YOUR CHOSEN TOPIC>>> ' + words[i] + ' <<<YOUR CHOSEN TOPIC>>>';
                const startIndex = Math.max(0, i - 124); // start index of context
                const endIndex = Math.min(words.length - 1, i + 124); // end index of context

                // extract context
                const context = words.slice(startIndex, endIndex + 1).join(' ');

                results.push(JSON.stringify({
                    title: article.title,
                    url: article.url,
                    text: context,
                }, null, '\t'));

                // // skip forward to avoid overlapping occurrences
                // i += 100;
            }
        }
    }
    // console.log('results', results);
    return results;
}

module.exports = { findTopicInArticles };