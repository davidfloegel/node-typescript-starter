import request from 'supertest';

import app from '../src/app';

describe('GET /', () => {
  it('should return 200 OK', () => {
    return request(app)
      .get('/')
      .expect(200);
  });

  it('should return 404', done => {
    return request(app)
      .get('/not-found')
      .expect(404, done);
  });
});
