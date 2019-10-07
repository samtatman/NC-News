## Agent-News

Agent-News is an api which is used in Agent-News, a REACT-based web app. This api is linked to a postgres SQL database, which contains articles, comments, topics and users, used in NC News

# Getting Started

Seeding the database is done in the seed.js file. It can be run with the following commands:

The api is hosted on https://git.heroku.com/agent-news.git.

```bash
npm run seed
```

for seeding the dev database

```bash
npm run seed-test
```

for seeding the test database

```bash
npm run seed:prod
```

for seeding the production database.

Migration rollback and latest are integrated within the seed file (the seed file rolls back to the previous migration and then rolls forward the latest one, in order to reset the database) but these migrations can also be done manually with the commands:

```bash
npm run migrate:latest
npm run migrate:rollback
```

# Testing

This api was tested with mocha, chai and supertest. The spec files for the app and utilities can be found in the spec folder.

The app.spec.js tests for how the API responds when it is given valid and invalid requests. It can be run with this command:

```bash
npm t
```

The utils.spec.js tests for any data manipulation functions that don't directly involve the database. It can be run with this command:

```bash
npm run test-utils
```

# Built With

node.js
express
postgres
knex

# Author

Sam Tatman
