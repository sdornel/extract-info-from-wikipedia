# extract-info-from-wikipedia

Currently this application is able to get every reference to a certain word/phrase within a wikipedia page as well as the article URLs located referenced that wikipedia page. It also gets 100 words before the chosen topic and 100 words after the chosen topic.

Before you start run "npm install"

To start, ensure you are in root and type:
1. node index.js
2. name of wikipedia article (ie - https://en.wikipedia.org/wiki/Julius_Caesar)
3. topic to be searched for (ie - roman republic)

The application will then create a .docx file with all the relevant data in JSON objects looking like this:


{
  "title": ,
  "url": ,
  "text":
}
