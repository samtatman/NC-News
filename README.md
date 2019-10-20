# Agent News API

Agent News is an API which is used in the [Agent News App](https://agentnewsfornow.netlify.com/), a web app written with React JS. This API is linked to a postgres SQL database, which contains articles, comments, topics and users.

The API is hosted on Heroku at this address: https://agent-news.herokuapp.com/api.

The link will take you to a JSON listing all of the endpoints, their example requests, queries and responses. From there, adding the listed endpoint paths to the URL will let you access the specific resources.

e.g. https://agent-news.herokuapp.com/api/topics will give you a JSON object of all of the topics in the database.

## Getting Started

### Prerequisites

- Node.js 12

### Installing

To run this project locally, clone it into a directory on your computer using the terminal command:

```bash
git clone https://github.com/samtatman/NC-News
```

Open the repository in a code editor, such as _VS Code_ and install the necessary _Node_ packages by running the command:

```bash
npm install
```

A test and dev database will need to be created which can be done by running the following command:

```bash
npm run setup-dbs
```

Seeding the database is done in the seed.js file. It can be run with the following commands:

```bash
npm run seed
```

for seeding the dev database

```bash
npm run seed-test
```

for seeding the test database

Migration rollback and latest are integrated within the seed file(the seed file rolls back to the previous migration and then rolls forward the latest one, in order to reset the database) but these migrations can also be done manually with the commands:

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

## Testing

This api was tested with mocha, chai and supertest.

### API Testing

The app.spec.js tests for how the API responds when it is given valid and invalid requests. It can be run with this command:

```bash
npm t
```

Here is an example:

```javascript
describe("/api/topics", () => {
  it("405: return invalid method when invalid method called", () => {
    return request(app)
      .patch("/api/topics")
      .expect(405)
      .then(({ body }) => {
        expect(body.msg).to.equal("Invalid method");
      });
  });
});
```

The package _supertest_ is used to send a request to the server and test the response against the expected response.

## Utility Testing

The utils.spec.js tests for any data manipulation functions that don't directly involve the database. It can be run with this command:

```bash
npm run test-utils
```

Here is an example:

```javascript
describe("paginateResults", () => {
  let testArray;
  beforeEach(() => {
    testArray = [...Array(30).fill("sample")];
  });
  it("returns an empty array when passed an empty array", () => {
    expect(paginateResults([], 10, 1)[0]).to.have.length(0);
    expect(paginateResults([], 10, 1)[1]).to.equal(0);
  });
});
```

_mocha_ is used to test the utility function.

## Built With

- node JS v12.8.0 - Javascript Runtime
- express v4.17.1 - Web Application Framework
- postgresSQL v7.12.1 - SQL Database
- knex JS v0.19.4 - SQL Query Builder

* mocha v6.2.0 - Testing Framework
* chai v4.2.0 - Assertion Library
* supertest v4.0.2 - Testing Framework

## Author

Sam Tatman
