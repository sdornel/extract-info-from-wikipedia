# extract-info-from-wikipedia

WIP

Currently this application is able to get every reference to a certain word/phrase within a wikipedia page as well as the article URLs located within that wikipedia page. It also gets 100 words before the chosen topic and 100 words after the chosen topic.

TODO:
1. ensure you can iterate one link deeper than the surface stuff you have now

2. if topic mentioned twice within the 200 word span, combine both texts to decrease file bloat?

3. i have so many different configuration options that i thought of. i need to create a more user friendly interface to handle all the different options

4. i also need to somehow be notified if my code is not working due to wiki API changes/deprecations
^ probably need unit tests

5. containerization

TODO in the future if you figure out your AWS and redis cache problem (related to local machine):
1. store in DB?

2. consider using redis and/or AWS ElastiCache
^ i think using a cache is best but i had problems getting redis to run on my local machine. i think it is some config issue? even then i still have to use RAM and i have to hit the wikipedia endpoint to see lastUpdated date so i'm hitting it for every URL no matter what...
i wonder if my local machine will finally let me connect to aws... last time it didn't because of some auth key issue. i do not want to reformat my computer again.

3. hook up to S3?

4. figure out if wikipedia will ban you for acting like a bot after you start getting 800^800 articles

5. make some sort of rate limiter for when you add in more links


brew services start mongodb-community@7.0
brew services stop mongodb-community@7.0