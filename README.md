# extract-info-from-wikipedia


Based on a chosen wikipedia article and phrase, this application gets all references to said phrase with 100 words before and after
1) within the selected article
2) within articles that have links within the selected article
3) all articles that have links inside the articles that have links.

If we choose the phrase "javascript" and we choose a wikipedia page with links to 5 articles, the following will occur:
1) The chosen wikipedia page gets scanned for "javascript"
2) The 5 articles with links to the chosen page get scanned for "javascript"
3) Any articles that have links in the above 5 articles get scanned for "javascript"

Before you start run "npm install"

To start, ensure you are in root and type:
1. node index.js
2. name of wikipedia article (ie - https://en.wikipedia.org/wiki/Julius_Caesar)
3. topic to be searched for (ie - roman republic)

The application will create a .docx file with all the relevant data in JSON objects looking like this:

{
  "title": ,
  "url": ,
  "text":
}
