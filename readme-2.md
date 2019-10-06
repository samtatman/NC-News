## Agent-News

Agent-News is an api which is used in Agent-News, a REACT-based web app. This api is linked to a postgres SQL database, which contains articles, comments, topics and users, used in NC News

# Getting Started

The api is hosted on https://git.heroku.com/agent-news.git

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
