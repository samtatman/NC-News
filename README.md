# Agent-News

Agent-News is an API which is used in the Agent-News App, a web app written with React JS. This API is linked to a postgres SQL database, which contains articles, comments, topics and users, used in NC News.

## Accessing the API

The API is hosted on Heroku at this address: https://agent-news.herokuapp.com/api.

The link will take you to a JSON listing all of the endpoints, their example requests, queries and responses. From there, adding the listed endpoint paths to the URL will let you access the specific resources.

e.g. https://agent-news.herokuapp.com/api/topics will give you a JSON object of all of the topics in the database.

## Running the Program Locally

To run this project locally, clone it into a directory on your computer using the command:

```bash
git clone https://github.com/samtatman/NC-News
```

Open the repository in a code editor, such as _VS Code_ and install the necessary _Node_ packages by running the command:

```bash
npm install
```

A test and dev database will need to be created which can be done by running the following command in the terminal:

```bash
npm run setup-dbs
```

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

Migration rollback and latest are integrated within the seed file (the seed file rolls back to the previous migration and then rolls forward the latest one, in order to reset the database) but these migrations can also be done manually with the commands:

```bash
npm run migrate:latest
npm run migrate:rollback
```

Finally, input the command

```bash
npm start
```

to run the listen.js file which allows for html requests to be accepted.

The default PORT is 9080, but this changes if a different port is set in the Node environment.

# Testing

This api was tested with mocha, chai and supertest. These npm packages must be installed to run the files in the spec folder.

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
