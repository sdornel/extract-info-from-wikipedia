const fs = require('fs');

function convertToFileFormat(articleFragments, topic, chosenFormat) {
    // this works for txt. not sure if it would work for other file formats
    const stringFormatArticleFragments = articleFragments.join('\n\n');

    // ensure the directory exists
    if (!fs.existsSync('./extracted-text-files/')){
        fs.mkdirSync('./extracted-text-files/');
    }
    
    const filePath = './extracted-text-files/' + topic.replaceAll(' ', '-') + Date.now() + chosenFormat;

    fs.writeFile(filePath, stringFormatArticleFragments, (err) => {
        if (err) {
          console.error('Error writing file:', err);
        }
    });
}

module.exports = { convertToFileFormat };