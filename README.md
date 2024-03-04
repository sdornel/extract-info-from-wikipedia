# extract-info-from-wikipedia

WIP

Currently this application is able to get every reference to a certain word/phrase within a wikipedia page as well as the article URLs located within that wikipedia page. It also gets 100 words before the chosen topic and 100 words after the chosen topic.

TODO:
figure out if wikipedia will ban you for acting like a bot after you start getting 800^800 articles
make some sort of rate limiter for when you add in more links
ensure you can iterate one link deeper than the surface stuff you have now
if topic mentioned twice within the 200 word span, combine both texts to decrease file bloat?
i have so many different configuration options that i thought of. i need to create a more
user friendly interface to handle all the different options
store in DB?
hook up AWS?
i also need to somehow be notified if my code is not working due to wiki API changes/deprecations
^ probably need unit tests