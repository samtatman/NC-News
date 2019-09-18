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
    describe("GET: returns all articles", () => {
      it("200: returns all articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.contain({
              article_id: 12,
              title: "Moustache",
              author: "butter_bridge",
              body: "Have you seen the size of that thing?",
              topic: "mitch",
              created_at: "1974-11-26T12:21:54.171Z",
              votes: 0,
              comment_count: "0"
            });
            expect(body.articles.length).to.equal(12);
          });
      });
      it("200: each article has a comment count", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            console.log(body.articles);
            expect(body.articles[3]).to.contain({
              comment_count: "2"
            });
            expect(body.articles.length).to.equal(12);
          });
      });
    });
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
    describe("PATCH: updates and returns single article using :article_id", () => {
      it("200: increments vote count", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 5 })
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
                votes: 105
              }
            ]);
          });
      });
      it("200: decrements vote count", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -20 })
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
                votes: 80
              }
            ]);
          });
      });
      it("400: when passed invalid vote count returns 'Invalid input syntax.'", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "invalid" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid input syntax");
          });
      });
      it("400: when passed invalid article_id returns 'Invalid input syntax'", () => {
        return request(app)
          .patch("/api/articles/invalid")
          .send({ inc_votes: 4 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid input syntax");
          });
      });
      it("404: when passed article_id that is valid but does not exist returns 'Id does not exist'", () => {
        return request(app)
          .patch("/api/articles/8549")
          .send({ inc_votes: 4 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Id does not exist.");
          });
      });
    });
    describe("POST: /article_id/comments inserts comment into comments using article_id", () => {
      it("200: inserts comment into database which returns inserted comment", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(201)
          .send({
            body: "test comment",
            username: "butter_bridge"
          })
          .then(({ body }) => {
            expect(body.comment).to.contain.keys("created_at");
            delete body.comment.created_at;
            expect(body.comment).to.eql({
              article_id: 1,
              comment_id: 19,
              body: "test comment",
              author: "butter_bridge",
              votes: 0
            });
          });
      });
      it("400: when inserted comment has invalid keys, returns 'invalid keys", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(400)
          .send({
            invalid: "test comment",
            key: "butter_bridge"
          })
          .then(({ body }) => {
            expect(body.msg).to.equal("Column does not exist");
          });
      });
      it("400: when inserted comment has invalid values, returns 'invalid keys", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(400)
          .send({
            body: 56,
            username: true
          })
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'Key (author)=(true) is not present in table "users".'
            );
          });
      });
    });
    describe("GET: /article_id/comments returns array of comments using article_id", () => {
      it("200: returns array of comments from single article", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).to.equal(13);
            delete body.comments[0].created_at;
            expect(body.comments[0]).to.eql({
              article_id: 1,
              comment_id: 2,
              body:
                "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
              author: "butter_bridge",
              votes: 14
            });
          });
      });
      it("200: returns array of comments from single article", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).to.equal(13);
            delete body.comments[0].created_at;
            expect(body.comments[0]).to.eql({
              article_id: 1,
              comment_id: 2,
              body:
                "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
              author: "butter_bridge",
              votes: 14
            });
          });
      });
      it("200: sorts by ascending comment_id by default", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments[0]).to.contain({
              comment_id: 2
            });
            expect(body.comments[1]).to.contain({
              comment_id: 3
            });
          });
      });
      it("200: can be ordered in descending order", () => {
        return request(app)
          .get("/api/articles/1/comments?order_by=desc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments[0]).to.contain({
              comment_id: 18
            });
            expect(body.comments[1]).to.contain({
              comment_id: 13
            });
          });
      });
      it("200: can sorted by author if requested", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=author&order_by=desc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments[0]).to.contain({
              author: "icellusedkars"
            });
            expect(body.comments[1]).to.contain({
              author: "icellusedkars"
            });
          });
      });
      it("400: returns 'Invalid input syntax' when passed invalid id ", () => {
        return request(app)
          .get("/api/articles/false_id/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid input syntax");
          });
      });
      it("400: returns 'Column does not exist' when queried with column that does not exist ", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=fake-column")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Column does not exist");
          });
      });
      xit("400: returns 'Invalid input syntax' when passed invalid order ", () => {
        return request(app)
          .get("/api/articles/1/comments?order_by='retff")
          .expect(200)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid input syntax");
          });
      });
      it("404: returns 'Id does not exist.' when passed valid id that does not exist", () => {
        return request(app)
          .get("/api/articles/67685/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Id does not exist.");
          });
      });
    });
  });
});
