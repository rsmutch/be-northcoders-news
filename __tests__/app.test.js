const app = require('../app');
const request = require('supertest');
const connection = require('../db/connection');
const { response } = require('express');

describe('Endpoints', () => {
  afterAll(() => {
    return connection.destroy();
  });

  beforeEach(() => {
    return connection.seed.run();
  });

  describe('/not-a-route', () => {
    test('GET should respond with 404', () => {
      return request(app)
        .get('/api/not-a-route')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Route not found');
        });
    });
  });
  describe('/api/topics', () => {
    describe('GET', () => {
      test('should respond with status code 200 and an array of all topics', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics[0]).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
            expect(topics[1]).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
            expect(topics[2]).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
      });
    });
  });
  describe('/api/users', () => {
    describe('/:username', () => {
      describe('GET', () => {
        it('should respond with code 200 and correct user object', () => {
          return request(app)
            .get('/api/users/lurker')
            .expect(200)
            .then((response) => {
              expect(response.body).toEqual({
                user: [
                  {
                    username: 'lurker',
                    avatar_url:
                      'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    name: 'do_nothing',
                  },
                ],
              });
            });
        });
        it('should respond with 404 if username does not exist', () => {
          return request(app)
            .get('/api/users/notAUser')
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toEqual('Username not found');
            });
        });
      });
    });
  });
  describe('/api/articles', () => {
    describe('/', () => {
      describe('GET', () => {
        it('should respond with 200 and an array of article objects', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
              articles.forEach((article) => {
                expect(article).toEqual(
                  expect.objectContaining({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    comment_count: expect.any(String),
                    votes: expect.any(Number),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                  })
                );
              });
            });
        });
        it('default sort & order is descending created_at', () => {
          return request(app)
            .get('/api/articles/')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy('created_at', {
                descending: true,
              });
            });
        });
        it('accepts sort_by query', () => {
          return request(app)
            .get('/api/articles?sort_by=topic')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy('topic', {
                descending: true,
              });
            })
            .then(() => {
              return request(app)
                .get('/api/articles?sort_by=author')
                .expect(200)
                .then(({ body: { articles } }) => {
                  expect(articles).toBeSortedBy('author', {
                    descending: true,
                  });
                });
            });
        });
        it('accepts query order', () => {
          return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy('created_at', {
                descending: false,
              });
            })
            .then(() => {
              return request(app)
                .get('/api/articles?sort_by=author&order=asc')
                .expect(200)
                .then(({ body: { articles } }) => {
                  expect(articles).toBeSortedBy('author', {
                    descending: false,
                  });
                });
            });
        });
        it('if sort_by is provided an invalid column, will default to created_at', () => {
          return request(app)
            .get('/api/articles?sort_by=body')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy('created_at', {
                descending: true,
              });
            });
        });
        it('if order is provided an invalid order, will default to desc', () => {
          return request(app)
            .get('/api/articles?order=ascending')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy('created_at', {
                descending: true,
              });
            });
        });
      });
    });
    describe('/:article_id', () => {
      describe('GET', () => {
        it('should respond with 200 and an article object', () => {
          return request(app)
            .get('/api/articles/5')
            .expect(200)
            .then((response) => {
              expect(response.body.articles[0]).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: 5,
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: '2',
              });
            })
            .then(() => {
              return request(app)
                .get('/api/articles/2')
                .expect(200)
                .then((response) => {
                  expect(response.body.articles[0]).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: '0',
                  });
                });
            });
        });
        it('should respond with status 404 and article not found if article_id is not found', () => {
          return request(app)
            .get('/api/articles/9999')
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toEqual('Article not found');
            });
        });
        it('should respond with status 404 and Invalid Article ID when passed a non-numerical ID', () => {
          return request(app)
            .get('/api/articles/notAnId')
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toEqual('Article not found');
            });
        });
      });
      describe('PATCH', () => {
        it('should respond with 200 and updated article', () => {
          return request(app)
            .patch('/api/articles/3')
            .send({ inc_votes: 64 })
            .expect(200)
            .then((response) => {
              expect(response.body.article[0]).toMatchObject({
                article_id: 3,
                title: 'Eight pug gifs that remind me of mitch',
                body: 'some gifs',
                votes: 64,
                topic: 'mitch',
                author: 'icellusedkars',
                created_at: expect.any(String),
              });
            })
            .then(() => {
              return request(app)
                .patch('/api/articles/3')
                .send({ inc_votes: -60 })
                .expect(200)
                .then((response) => {
                  expect(response.body.article[0]).toMatchObject({
                    article_id: 3,
                    title: 'Eight pug gifs that remind me of mitch',
                    body: 'some gifs',
                    votes: 4,
                    topic: 'mitch',
                    author: 'icellusedkars',
                    created_at: expect.any(String),
                  });
                });
            });
        });
        it('should respond with status 400 and Bad Request when not passed an object containing inc_votes', () => {
          return request(app)
            .patch('/api/articles/6')
            .send({})
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toEqual('Bad Request');
            });
        });
        it('should respond with status 400 and Bad Request when passed containing anything else other than inc_votes', () => {
          return request(app)
            .patch('/api/articles/6')
            .send({ inc_votes: 10, name: 'Ted' })
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toEqual('Bad Request');
            });
        });
        it('should respond with status 400 and Bad Request when inc_votes is not numerical', () => {
          return request(app)
            .patch('/api/articles/6')
            .send({ inc_votes: 'two' })
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toEqual('Bad Request');
            });
        });
        it('should respond with status 404 and article not found if article_id is not found', () => {
          return request(app)
            .patch('/api/articles/999')
            .send({ inc_votes: 20 })
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toBe('Article not found');
            });
        });
        it('should respond with status 404 and Invalid Article ID when passed a non-numerical ID', () => {
          return request(app)
            .patch('/api/articles/notAnId')
            .send({ inc_votes: 20 })
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toEqual('Article not found');
            });
        });
      });
      describe('DELETE', () => {
        it('should respond with 204 and no content returned', () => {
          return request(app)
            .delete('/api/articles/3')
            .expect(204)
            .then((response) => {
              expect(response.res.statusMessage).toEqual('No Content');
            });
        });
        it('article should not be present in table after deletion', () => {
          return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then((response) => {
              expect(response.body).toMatchObject({
                articles: expect.any(Array),
              });
            })
            .then(() => {
              return request(app)
                .delete('/api/articles/3')
                .expect(204)
                .then((response) => {
                  expect(response.body).toEqual({});
                });
            })
            .then(() => {
              return request(app)
                .get('/api/articles/3')
                .expect(404)
                .then((response) => {
                  expect(response.body.msg).toEqual('Article not found');
                });
            });
        });
        it('should respond with status 404 and article not found if article_id is not found', () => {
          return request(app)
            .delete('/api/articles/999')
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toBe('Article not found');
            });
        });
        it('should respond with status 404 and Invalid Article ID when passed a non-numerical ID', () => {
          return request(app)
            .delete('/api/articles/notAnId')
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toEqual('Article not found');
            });
        });
      });
      describe('/comments', () => {
        describe('GET', () => {
          it('should respond with 200 and an array of comment objects', () => {
            return request(app)
              .get('/api/articles/5/comments')
              .expect(200)
              .then((response) => {
                expect(response.body.comments.length).toBe(2);
                expect(response.body.comments[0]).toMatchObject({
                  comment_id: 14,
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                });
                expect(response.body.comments[1]).toMatchObject({
                  comment_id: 15,
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                });
              });
          });
          it('accepts query sort_by (defaults to created_at)', () => {
            return request(app)
              .get('/api/articles/5/comments')
              .expect(200)
              .then((response) => {
                expect(response.body.comments).toBeSortedBy('created_at', {
                  descending: true,
                });
              })
              .then(() => {
                return request(app)
                  .get('/api/articles/5/comments?sort_by=comment_id')
                  .expect(200)
                  .then((response) => {
                    expect(response.body.comments).toBeSortedBy('comment_id', {
                      descending: true,
                    });
                  });
              })
              .then(() => {
                return request(app)
                  .get('/api/articles/5/comments?sort_by=author')
                  .expect(200)
                  .then((response) => {
                    expect(response.body.comments).toBeSortedBy('author', {
                      descending: true,
                    });
                  });
              });
          });
          it('accepts query order (defaults to descending)', () => {
            return request(app)
              .get('/api/articles/5/comments')
              .expect(200)
              .then((response) => {
                expect(response.body.comments).toBeSortedBy('created_at', {
                  descending: true,
                });
              })
              .then(() => {
                return request(app)
                  .get('/api/articles/5/comments?order=asc')
                  .expect(200)
                  .then((response) => {
                    expect(response.body.comments).toBeSortedBy('created_at', {
                      descending: false,
                    });
                  });
              })
              .then(() => {
                return request(app)
                  .get('/api/articles/1/comments?sort_by=author&order=asc')
                  .expect(200)
                  .then((response) => {
                    expect(response.body.comments).toBeSortedBy('author', {
                      descending: false,
                    });
                  });
              });
          });
        });
        describe('POST', () => {
          it('should respond with 201 and the newly added object', () => {
            return request(app)
              .post('/api/articles/5/comments')
              .send({
                username: 'rogersop',
                body: 'Beautifully written!',
              })
              .expect(201)
              .then((response) => {
                expect(response.body.comment).toMatchObject({});
              });
          });
        });
      });
    });
  });
});
