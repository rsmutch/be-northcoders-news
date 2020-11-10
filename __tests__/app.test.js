
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

    describe.only('GET /not-a-route', () => {
        test('should respond with 404', () => {
            return request(app)
                .get('/api/not-a-route')
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Route not found')
                });
        });
    });

    describe('GET /API/TOPICS', () => {
        test('should respond with status code 200 and an array of all topics', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({ body: { topics } }) => {
                    expect(topics[0]).toEqual(expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    }))
                    expect(topics[1]).toEqual(expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    }))
                    expect(topics[2]).toEqual(expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    }))
                })
        });
    });




});