**Hosted version:** https://be-nc-news-f47c.onrender.com/api

This project provides the ability to store information on various articles in a database, and the API is build to enable others to access the application data programatically.

To see the code work, please go to the link above and add one of the provided API endpoints to alter the information. For example, /api/users will serve an array of all user objects. 

**To clone, run the following command:**
git clone https://github.com/tashkenna/BE_PORTFOLIO_WEEK.git

**Please run:**
npm install

*This will install*
devDependencies: 
dotenv, express, jest-sorted, pg and supertest
dependencies:
husky, jest, jest-extended, pg-format

**Setting up .env files:**
There are two datatbases in this project, one is for the dev data and then some simpler data for testing. 
Set up the .env.development files with PGDATABASE=nc_news
For testing, .env.test is to be set up with PGDATABASE=nc_news_test
These files will be .gitignored

**Seeding local database**
To seed the local database, run *npm run seed*, this will run the file /db/seeds/run-seed.js

**Testing suite**
To run the testing suite, run *npm run test* in the terminal. 


**The minimum versions of Node.js and Postgres needed to run this project are:**
Node.js: v18.15.0
Postgres: 14.8 (Homebrew)