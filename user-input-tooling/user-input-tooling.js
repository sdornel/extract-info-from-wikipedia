const readline = require('readline');

function getUserInputUrl() {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question('Input URL to be scraped: ', (url) => {
            rl.question('Input word or phrase to look for: ', (topic) => {
                rl.close();
                resolve({ url, topic });
            });
        });
    });
}

module.exports = { getUserInputUrl };