process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
chai.use(chaiSorted);

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
    it("405: return invalid method when invalid method called", () => {
      return request(app)
        .patch("/api/topics")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid method");
        });
    });
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
    it("405: return invalid method when invalid method called", () => {
      return request(app)
        .delete("/api/users/1")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid method");
        });
    });
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
    it("405: return invalid method when invalid method called", () => {
      return request(app)
        .delete("/api/articles")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Invalid method");
        });
    });
    describe("GET: returns all articles", () => {
      it("200: returns all articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.contain({
              article_id: 1,
              title: "Living in the shadow of a great man",
              author: "butter_bridge",
              body: "I find this existence challenging",
              topic: "mitch",
              created_at: "2018-11-15T12:21:54.171Z",
              votes: 100,
              comment_count: "13"
            });
            expect(body.articles.length).to.equal(12);
          });
      });
      it("200: each article has a comment count", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.contain({
              comment_count: "13"
            });
            expect(body.articles.length).to.equal(12);
          });
      });
      it("200: articles are sorted by created_at by default, in descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("created_at");
            expect(body.articles.length).to.equal(12);
          });
      });
      it("200: articles can be sorted by article_id", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.descendingBy("article_id");
            expect(body.articles.length).to.equal(12);
          });
      });
      it("200: articles can be ordered by ascending", () => {
        return request(app)
          .get("/api/articles?order_by=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.ascendingBy("created_at");
            expect(body.articles.length).to.equal(12);
          });
      });
      it("200: articles can be filtered by author", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.contain({
              author: "butter_bridge"
            });
            expect(body.articles.length).to.equal(3);
          });
      });
      it("200: articles can be filtered by topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.contain({
              topic: "mitch"
            });
            expect(body.articles.length).to.equal(11);
          });
      });
      it("200: can accept an author and a topic", () => {
        return request(app)
          .get("/api/articles?author=rogersop&&topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.contain({
              topic: "mitch",
              author: "rogersop"
            });
            expect(body.articles.length).to.equal(2);
          });
      });
      it("404: if queried with author that does not exist, returns 'Input does not exist in database'", () => {
        return request(app)
          .get("/api/articles?author=does-not-exist")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Input does not exist in database");
          });
      });
      it("404: returns 'Input does not exist in database' when passed topic that doesn't exist", () => {
        return request(app)
          .get("/api/articles?topic=5r47r")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Input does not exist in database");
          });
      });
      it("200: when passed a topic that does exist, but has no associated articles, returns empty array", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.eql([]);
          });
      });
      it("200: when passed an author that does exist, but has no associated articles, returns empty array", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.eql([]);
          });
      });
      it("404: returns 'Column does not exist' when passed sort_by that doesn't exist", () => {
        return request(app)
          .get("/api/articles?sort_by=5r47r")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Column does not exist");
          });
      });
      it("200: returns empty array when passed topic and author that doesn't exist", () => {
        return request(app)
          .get("/api/articles?topic=paper&author=lurker")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.eql([]);
          });
      });
      it("404: returns 'Input does not exist in database' when passed topic that doesn't exist but author that does", () => {
        return request(app)
          .get("/api/articles?topic=fefwe&author=lurker")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Input does not exist in database");
          });
      });
      it("404: returns 'Input does not exist in database' when passed author that doesn't exist but topic that does", () => {
        return request(app)
          .get("/api/articles?topic=paper&author=fhdfd")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Input does not exist in database");
          });
      });
    });
    describe("GET: returns single article using :article_id", () => {
      it("405: return invalid method when invalid method called", () => {
        return request(app)
          .delete("/api/articles/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid method");
          });
      });
      it("200: returns single article", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0]).to.contain({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              votes: 100,
              commentCount: "13"
            });
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
            expect(body.msg).to.equal("Input does not exist in database");
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
            expect(body.article[0]).to.contain({
              votes: 80
            });
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
            expect(body.msg).to.equal("Input does not exist in database");
          });
      });
      it("400: when passed invalid inc_count, returns invalid syntax", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "dog" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid input syntax");
          });
      });
      it("400: when passed misspelt inc_count, returns unchanged comment", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ ind_votes: 23 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0]).to.contain({ votes: 100 });
          });
      });
      it("400: when passed bigint, returns 'Invalid input syntax'", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            inc_votes: 23758475748975943574759849875243825454957892475897239573472894
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid input syntax");
          });
      });
      it("200: when sent empty object returns unchanged article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0]).to.eql({
              article_id: 1,
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2018-11-15T12:21:54.171Z",
              title: "Living in the shadow of a great man",
              topic: "mitch",
              votes: 100
            });
          });
      });
      it("200: when sent no body returns unchanged article", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0]).to.eql({
              article_id: 1,
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2018-11-15T12:21:54.171Z",
              title: "Living in the shadow of a great man",
              topic: "mitch",
              votes: 100
            });
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
            expect(body.comment).to.contain({
              article_id: 1,
              comment_id: 19,
              body: "test comment",
              author: "butter_bridge",
              votes: 0
            });
          });
      });
      it("400: when sent empty object, returns 'No body in patch/post request'", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(400)
          .send({})
          .then(({ body }) => {
            expect(body.msg).to.equal("No body in patch/post request");
          });
      });
      it("400: when passed no body returns 'No body in patch/post request'", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("No body in patch/post request");
          });
      });
      it("400: when inserted comment has invalid values, returns custom error message", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .expect(400)
          .send({
            body: 56,
            username: 897
          })
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'Key (author)=(897) is not present in table "users".'
            );
          });
      });
      it("404: returns custom error when passed valid input that does not exist", () => {
        return request(app)
          .post("/api/articles/898/comments")
          .expect(400)
          .send({
            body: "hello",
            username: "butter_bridge"
          })
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'Key (article_id)=(898) is not present in table "articles".'
            );
          });
      });
      describe("GET: /article_id/comments returns array of comments using article_id", () => {
        it("405: return invalid method when invalid method called", () => {
          return request(app)
            .delete("/api/articles/1/comments")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid method");
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
        it("200: sorts by descending created_at by default", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.descendingBy("created_at");
            });
        });
        it("200: can be ordered in ascending order", () => {
          return request(app)
            .get("/api/articles/1/comments?order_by=asc")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.ascendingBy("created_at");
            });
        });
        it("200: can sorted by author if requested", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=author&order_by=desc")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.descendingBy("author");
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
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Column does not exist");
            });
        });
        it("200: when passed invalid order, orders by default ", () => {
          return request(app)
            .get("/api/articles/1/comments?order_by=6")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).to.be.descendingBy("created_at");
            });
        });
        it("404: returns 'Id does not exist.' when passed valid id that does not exist", () => {
          return request(app)
            .get("/api/articles/67685/comments")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Input does not exist in database");
            });
        });
      });
    });
    describe("/api/comments/:comment_id", () => {
      it("405: return invalid method when invalid method called", () => {
        return request(app)
          .get("/api/comments/1")
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal("Invalid method");
          });
      });
      describe("PATCH: updates comment using comment_id", () => {
        it("200: updates votes on comment using comment_id and inc_votes", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 10 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment[0]).to.contain({
                votes: 26,
                comment_id: 1
              });
            });
        });
        it("400: returns invalid input syntax when passed invalid comment_id", () => {
          return request(app)
            .patch("/api/comments/invalid")
            .send({ inc_votes: 10 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid input syntax");
            });
        });
        it("404: returns 'Input does not exist in database' when passed valid comment_id that does not exist", () => {
          return request(app)
            .patch("/api/comments/9090")
            .send({ inc_votes: 10 })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Input does not exist in database");
            });
        });
        it("400: returns 'Invalid input syntax' when passed invalid inc_votes", () => {
          return request(app)
            .patch("/api/comments/2")
            .send({ inc_votes: "thr" })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid input syntax");
            });
        });
        it("200: returns unchanged comment when passed missplet inc_votess", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_volts: 7 })
            .expect(200)
            .then(({ body }) => {
              expect(body.comment[0]).to.contain({
                votes: 16,
                comment_id: 1
              });
            });
        });
        it("400: returns 'Invalid input syntax' when passed bigint", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 587578475745758748397548975847558494 })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid input syntax");
            });
        });
        it("200: when sent empty object returns unchanged object", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({})
            .expect(200)
            .then(({ body }) => {
              expect(body.comment[0]).to.contain({
                votes: 16,
                comment_id: 1
              });
            });
        });
        it("200: when sent no body returns unchanged object", () => {
          return request(app)
            .patch("/api/comments/1")
            .expect(200)
            .then(({ body }) => {
              expect(body.comment[0]).to.contain({
                votes: 16,
                comment_id: 1
              });
            });
        });
      });
      describe("DELETE: deletes comment using comment_id", () => {
        it("204: deletes comment", () => {
          return request(app)
            .delete("/api/comments/1")
            .expect(204);
        });
        it("404: returns 'Input does not exist' when passed valid input that does not exist", () => {
          return request(app)
            .delete("/api/comments/686")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).to.equal("Input does not exist");
            });
        });
        it("400: returns 'Invalid input syntax' when passed invalid input", () => {
          return request(app)
            .delete("/api/comments/invalid")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).to.equal("Invalid input syntax");
            });
        });
      });
    });
  });
});
