const app = require('../app');
const request = require('supertest');
const connection = require('../db/connection');

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
  xdescribe('/api/', () => {
    xdescribe('GET', () => {
      it('should return api JSON', () => {
        return request(app)
          .get('/api')
          .expect(200)
          .then(({ body: { api } }) => {
            expect(api).toEqual({});
          });
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
                description: expect.any(String)
              })
            );
            expect(topics[1]).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String)
              })
            );
            expect(topics[2]).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String)
              })
            );
          });
      });
    });
    describe('POST', () => {
      it('should respond with 201 and the newly added object', () => {
        return request(app)
          .post('/api/topics/')
          .send({
            slug: 'New Slug',
            description: 'New Description'
          })
          .expect(201)
          .then(({ body: { topic } }) => {
            expect(topic).toEqual({
              slug: 'New Slug',
              description: 'New Description'
            });
          });
      });
      it('should respond with 400 Bad Request if slug is omitted', () => {
        return request(app)
          .post('/api/topics/')
          .send({
            description: 'New Description'
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toEqual('Bad Request');
          });
      });
    });
  });
  describe('/api/users', () => {
    describe('POST', () => {
      it('should respond with 201 and the newly added object', () => {
        return request(app)
          .post('/api/users/')
          .send({
            username: 'Newusername',
            avatar_url: 'www.google.co.uk',
            name: 'New Name'
          })
          .expect(201)
          .then(({ body: { user } }) => {
            expect(user).toEqual({
              username: 'Newusername',
              avatar_url: 'www.google.co.uk',
              name: 'New Name'
            });
          });
      });
      it('should respond with 400 Bad Request if username is omitted', () => {
        return request(app)
          .post('/api/users/')
          .send({
            avatar_url: 'www.google.co.uk',
            name: 'New Name'
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toEqual('Bad Request');
          });
      });
    });
    describe('GET', () => {
      it('should respond with 200 and an array of user objects', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then(({ body: { users } }) => {
            users.forEach((user) => {
              expect(user).toMatchObject(
                expect.objectContaining({
                  username: expect.any(String)
                })
              );
            });
          });
      });
      it('default sort & order is descending username', () => {
        return request(app)
          .get('/api/users/')
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toBeSortedBy('username', {
              descending: true
            });
          });
      });
      it('accepts sort_by query', () => {
        return request(app)
          .get('/api/users?sort_by=avatar_url')
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toBeSortedBy('avatar_url', {
              descending: true
            });
          })
          .then(() => {
            return request(app)
              .get('/api/users?sort_by=name')
              .expect(200)
              .then(({ body: { users } }) => {
                expect(users).toBeSortedBy('name', {
                  descending: true
                });
              });
          });
      });
      it('accepts query order', () => {
        return request(app)
          .get('/api/users?order=asc')
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toBeSortedBy('username', {
              descending: false
            });
          })
          .then(() => {
            return request(app)
              .get('/api/users?sort_by=name&order=asc')
              .expect(200)
              .then(({ body: { users } }) => {
                expect(users).toBeSortedBy('name', {
                  descending: false
                });
              });
          });
      });
      it('if sort_by is provided an invalid column, will default to username', () => {
        return request(app)
          .get('/api/users?sort_by=fullname')
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toBeSortedBy('username', {
              descending: true
            });
          });
      });
      it('if order is provided an invalid order, will default to desc', () => {
        return request(app)
          .get('/api/users?order=ascending')
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toBeSortedBy('username', {
              descending: true
            });
          });
      });
    });
    describe('/:username', () => {
      describe('GET', () => {
        it('should respond with code 200 and correct user object', () => {
          return request(app)
            .get('/api/users/lurker')
            .expect(200)
            .then(({ body }) => {
              expect(body).toEqual({
                users: {
                  username: 'lurker',
                  avatar_url:
                    'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                  name: 'do_nothing'
                }
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
                    created_at: expect.any(String)
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
                descending: true
              });
            });
        });
        it('accepts sort_by query', () => {
          return request(app)
            .get('/api/articles?sort_by=topic')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy('topic', {
                descending: true
              });
            })
            .then(() => {
              return request(app)
                .get('/api/articles?sort_by=author')
                .expect(200)
                .then(({ body: { articles } }) => {
                  expect(articles).toBeSortedBy('author', {
                    descending: true
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
                descending: false
              });
            })
            .then(() => {
              return request(app)
                .get('/api/articles?sort_by=author&order=asc')
                .expect(200)
                .then(({ body: { articles } }) => {
                  expect(articles).toBeSortedBy('author', {
                    descending: false
                  });
                });
            });
        });
        it('accepts topic query', () => {
          return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then(({ body: { articles } }) => {
              articles.forEach((article) => {
                expect(article.topic).toEqual('cats');
              });
            })
            .then(() => {
              return request(app)
                .get('/api/articles?topic=mitch')
                .expect(200)
                .then(({ body: { articles } }) => {
                  articles.forEach((article) => {
                    expect(article.topic).toEqual('mitch');
                  });
                });
            });
        });
        it('accepts author query', () => {
          return request(app)
            .get('/api/articles?author=butter_bridge')
            .expect(200)
            .then(({ body: { articles } }) => {
              articles.forEach((article) => {
                expect(article.author).toEqual('butter_bridge');
              });
            })
            .then(() => {
              return request(app)
                .get('/api/articles?author=icellusedkars')
                .expect(200)
                .then(({ body: { articles } }) => {
                  articles.forEach((article) => {
                    expect(article.author).toEqual('icellusedkars');
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
                descending: true
              });
            });
        });
        it('if order is provided an invalid order, will default to desc', () => {
          return request(app)
            .get('/api/articles?order=ascending')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy('created_at', {
                descending: true
              });
            });
        });
      });
      describe('POST', () => {
        it('should respond with 201 and the newly added object', () => {
          return request(app)
            .post('/api/articles/')
            .send({
              title: 'Article Title',
              body: 'Article body...',
              topic: 'paper',
              author: 'rogersop'
            })
            .expect(201)
            .then(({ body: { article } }) => {
              expect(article).toEqual({
                article_id: expect.any(Number),
                author: 'rogersop',
                title: 'Article Title',
                body: 'Article body...',
                topic: 'paper',
                created_at: expect.any(String),
                comment_count: expect.any(String),
                votes: expect.any(Number)
              });
            });
        });
        it('should respond with 400 Bad Request if an item is omitted', () => {
          return request(app)
            .post('/api/articles/')
            .send({
              title: 'No body',
              topic: 'paper',
              author: 'rogersop'
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toEqual('Bad Request');
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
              expect(response.body.articles).toEqual({
                author: expect.any(String),
                title: expect.any(String),
                article_id: 5,
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: '2'
              });
            })
            .then(() => {
              return request(app)
                .get('/api/articles/2')
                .expect(200)
                .then((response) => {
                  expect(response.body.articles).toEqual({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: '0'
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
        it('should respond with status 400 and Invalid Article ID when passed a non-numerical ID', () => {
          return request(app)
            .get('/api/articles/notAnId')
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toEqual('Invalid Article ID');
            });
        });
      });
      describe('PATCH', () => {
        it('should respond with 200 and updated article', () => {
          return request(app)
            .patch('/api/articles/3')
            .send({ inc_votes: 64 })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).toEqual({
                article_id: 3,
                title: 'Eight pug gifs that remind me of mitch',
                body: 'some gifs',
                votes: 64,
                topic: 'mitch',
                author: 'icellusedkars',
                created_at: expect.any(String)
              });
            })
            .then(() => {
              return request(app)
                .patch('/api/articles/3')
                .send({ inc_votes: -60 })
                .expect(200)
                .then((response) => {
                  expect(response.body.article).toEqual({
                    article_id: 3,
                    title: 'Eight pug gifs that remind me of mitch',
                    body: 'some gifs',
                    votes: 4,
                    topic: 'mitch',
                    author: 'icellusedkars',
                    created_at: expect.any(String)
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
        it('should respond with status 400 and Invalid Article ID when passed a non-numerical ID', () => {
          return request(app)
            .patch('/api/articles/notAnId')
            .send({ inc_votes: 20 })
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toEqual('Invalid Article ID');
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
              expect(response.body).toEqual({
                articles: expect.any(Object)
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
        it('should respond with status 400 and Invalid Article ID when passed a non-numerical ID', () => {
          return request(app)
            .delete('/api/articles/notAnId')
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toEqual('Invalid Article ID');
            });
        });
      });
      describe('/comments', () => {
        describe('/', () => {
          describe('GET', () => {
            it('should respond with 200 and an array of comment objects', () => {
              return request(app)
                .get('/api/articles/5/comments')
                .expect(200)
                .then((response) => {
                  expect(response.body.comments.length).toBe(2);
                  expect(response.body.comments[0]).toEqual({
                    comment_id: 14,
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String)
                  });
                  expect(response.body.comments[1]).toEqual({
                    comment_id: 15,
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String)
                  });
                });
            });
            it('accepts query sort_by (defaults to created_at)', () => {
              return request(app)
                .get('/api/articles/5/comments')
                .expect(200)
                .then((response) => {
                  expect(response.body.comments).toBeSortedBy('created_at', {
                    descending: true
                  });
                })
                .then(() => {
                  return request(app)
                    .get('/api/articles/5/comments?sort_by=comment_id')
                    .expect(200)
                    .then((response) => {
                      expect(response.body.comments).toBeSortedBy(
                        'comment_id',
                        {
                          descending: true
                        }
                      );
                    });
                })
                .then(() => {
                  return request(app)
                    .get('/api/articles/5/comments?sort_by=author')
                    .expect(200)
                    .then((response) => {
                      expect(response.body.comments).toBeSortedBy('author', {
                        descending: true
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
                    descending: true
                  });
                })
                .then(() => {
                  return request(app)
                    .get('/api/articles/5/comments?order=asc')
                    .expect(200)
                    .then((response) => {
                      expect(response.body.comments).toBeSortedBy(
                        'created_at',
                        {
                          descending: false
                        }
                      );
                    });
                })
                .then(() => {
                  return request(app)
                    .get('/api/articles/1/comments?sort_by=author&order=asc')
                    .expect(200)
                    .then((response) => {
                      expect(response.body.comments).toBeSortedBy('author', {
                        descending: false
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
                  body: 'Beautifully written!'
                })
                .expect(201)
                .then((response) => {
                  expect(response.body.comment).toEqual({
                    article_id: 5,
                    author: 'rogersop',
                    body: 'Beautifully written!',
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String)
                  });
                });
            });
            it('should respond with 400 Bad Request if an item is omitted', () => {
              return request(app)
                .post('/api/articles/5/comments')
                .send({
                  username: 'rogersop'
                })
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toEqual('Bad Request');
                });
            });
            it('should respond with status 404 and article not found if article_id is not found', () => {
              return request(app)
                .post('/api/articles/999/comments')
                .send({ username: 'rogersop', body: 'Comment Body' })
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).toBe('Article not found');
                });
            });
            it('should respond with status 400 and Invalid Article ID when passed a non-numerical article ID', () => {
              return request(app)
                .post('/api/articles/notAnId/comments')
                .send({ username: 'rogersop', body: 'Comment Body' })
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).toEqual('Invalid Article ID');
                });
            });
          });
        });
      });
    });
  });
  describe('/api/comments', () => {
    describe('/:comment_id', () => {
      describe('PATCH', () => {
        it('should respond with 200 and updated article', () => {
          return request(app)
            .patch('/api/comments/3')
            .send({ inc_votes: 50 })
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment).toEqual({
                comment_id: 3,
                body: expect.any(String),
                votes: 150,
                article_id: 1,
                author: 'icellusedkars',
                created_at: expect.any(String)
              });
            });
        });
        it('should respond with status 400 and Bad Request when not passed an object containing inc_votes', () => {
          return request(app)
            .patch('/api/comments/3')
            .send({})
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toEqual('Bad Request');
            });
        });
        it('should respond with status 400 and Bad Request when passed containing anything else other than inc_votes', () => {
          return request(app)
            .patch('/api/comments/6')
            .send({ inc_votes: 10, name: 'Dog' })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toEqual('Bad Request');
            });
        });
        it('should respond with status 400 and Bad Request when inc_votes is not numerical', () => {
          return request(app)
            .patch('/api/comments/6')
            .send({ inc_votes: 'two' })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toEqual('Bad Request');
            });
        });
        it('should respond with status 404 and article not found if article_id is not found', () => {
          return request(app)
            .patch('/api/comments/999')
            .send({ inc_votes: 20 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Comment not found');
            });
        });
        it('should respond with status 400 and Invalid Comment ID when passed a non-numerical ID', () => {
          return request(app)
            .patch('/api/comments/notAnId')
            .send({ inc_votes: 20 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toEqual('Invalid Comment ID');
            });
        });
      });
      describe('DELETE', () => {
        it('should respond with 204 and no content returned', () => {
          return request(app)
            .delete('/api/comments/3')
            .expect(204)
            .then(({ res: { statusMessage } }) => {
              expect(statusMessage).toEqual('No Content');
            });
        });
        it('article should not be present in table after deletion', () => {
          return request(app)
            .delete('/api/comments/3')
            .then(() => {
              return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).toEqual(12);
                });
            });
        });
        it('should respond with status 404 and article not found if article_id is not found', () => {
          return request(app)
            .delete('/api/comments/999')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('Comment not found');
            });
        });
        it('should respond with status 400 and Invalid Article ID when passed a non-numerical ID', () => {
          return request(app)
            .delete('/api/comments/notAnId')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toEqual('Invalid Comment ID');
            });
        });
      });
    });
  });
});
