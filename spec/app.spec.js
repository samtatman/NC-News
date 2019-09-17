process.env.NODE_ENV = "test";

const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    return connection.destroy();
  });

  describe("GET", () => {
    it('404: returns "Route does not exist." when passed invalid path', () => {
      return request(app)
        .get("/route-does-not-exist")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route does not exist.");
        });
    });
  });

  describe("/api/topics", () => {
    describe("GET", () => {
      it("200: returns all topics ", () => {
        return request(app)
          .get("/api/topics/")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.eql([
              {
                description: "The man, the Mitch, the legend",
                slug: "mitch"
              },
              {
                description: "Not dogs",
                slug: "cats"
              },
              {
                description: "what books are made of",
                slug: "paper"
              }
            ]);
          });
      });
    });
  });
  describe("/api/users", () => {
    describe("GET: returns single user using :username", () => {
      it("200: returns single user", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200)
          .then(({ body }) => {
            expect(body.user).to.eql([
              {
                username: "icellusedkars",
                name: "sam",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
              }
            ]);
          });
      });
      it("404: returns 'Username does not exist.' when username is not found", () => {
        return request(app)
          .get("/api/users/4refwrewn4d8")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Username does not exist.");
          });
      });
    });
  });
  describe("/api/articles", () => {
    describe("GET: returns single article using :article_id", () => {
      it("200: returns single article", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            delete body.article[0].created_at;
            expect(body.article).to.eql([
              {
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                votes: 100,
                commentCount: 13
              }
            ]);
          });
      });
      it("400: returns error 'Invalid input syntax' when passed invalid article_id", () => {
        return request(app)
          .get("/api/articles/invalid_id")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid input syntax");
          });
      });
      it("404: returns error 'Id does not exist' when passed valid article_id that is not present in the database", () => {
        return request(app)
          .get("/api/articles/76865")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Id does not exist.");
          });
      });
    });
    xdescribe("PATCH: updates and returns single article using :article_id", () => {
      it("200: updates and returns single article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ incVotes: 5 })
          .expect(200)
          .then(({ body }) => {
            delete body.article[0].created_at;
            expect(body.article).to.eql([
              {
                article_id: 1,
                title: "Living on a prayer",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                votes: 105
              }
            ]);
          });
      });
    });
  });
});
