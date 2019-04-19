import { Request, Response } from 'express';
import errorHandler from 'middlewares/errorhandler';
import { ApiError } from 'src/lib/errors';

class MyError extends ApiError {
  public code: string = 'custom-error';
  public statusCode: number = 400;

  constructor() {
    super('My Custom Error');
    Object.setPrototypeOf(this, new.target.prototype);

    this.errors = {
      ping: 'pong',
    };
  }
}

describe('Error Handler Middleware', () => {
  let req: any;
  let res: any;
  const next = jest.fn();

  beforeEach(() => {
    req = { params: {}, body: {} };

    res = {
      data: null,
      code: null,
      status(status: any) {
        this.code = status;
        return this;
      },
      send(payload: any) {
        this.data = payload;
      },
    };

    next.mockClear();
  });

  it('it should handle unknown errors', () => {
    errorHandler(new Error(), req, res, next);

    expect(res.code).toBeDefined();
    expect(res.code).toBe(500);

    const { data } = res;
    expect(data).toHaveProperty('code', 'unknown');
    expect(data).toHaveProperty('statusCode', 500);
    expect(data).toHaveProperty('error', 'Internal Server Error');
    expect(data).toHaveProperty('data.errors', {});
  });

  it('it should handle custom errors', () => {
    errorHandler(new MyError(), req, res, next);

    expect(res.code).toBeDefined();
    expect(res.code).toBe(400);

    const { data } = res;
    expect(data).toHaveProperty('code', 'custom-error');
    expect(data).toHaveProperty('statusCode', 400);
    expect(data).toHaveProperty('error', 'My Custom Error');
    expect(data).toHaveProperty('data.errors', { ping: 'pong' });
  });
});
