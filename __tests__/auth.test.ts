import request from 'supertest';

import Auth from 'context/auth';
import app from 'src/app';
import db from 'test/db';

beforeAll(async () => db.setup());
afterAll(async () => db.teardown());

describe('Authentication', () => {
  it('it registers a new user', () => {
    return request(app)
      .post('/signup')
      .send({
        email: 'mark@gmail.com',
        password: 'mark12345',
        firstName: 'Mark',
        lastName: 'Dyson',
      })
      .expect(200, {
        user: {
          firstName: 'Mark',
          lastName: 'Dyson',
          email: 'mark@gmail.com',
        },
      });
  });
});
