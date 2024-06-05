const app = require('../../app');
const supertest = require('supertest');

describe('GET /launches', () => {
    it('should respond with a 200 response', async () => {
        const response = await supertest(app).get('/launches');

        expect(response.status).toStrictEqual(200);
    });
});

describe('POST /launches', () => {
    it('should respond with a 201 response', async () => {
        const postBody = {
            mission: 'mission',
            rocket: 'rocket',
            target: 'target',
            launchDate: new Date('June 06, 2030')
        };
        const response = await supertest(app)
            .post('/launches')
            .send(postBody)
            .expect(201); // shorthand for line 24

        // expect(response.status).toBe(200);
    });
});
