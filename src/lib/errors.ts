/* tslint:disable:max-classes-per-file*/

export const DUPLICATE_ERROR_CODE = 11000;

export class ApiError extends Error {
  public code: string;
  public statusCode: number;
  public errors?: any;
}

export class UnauthorizedError extends ApiError {
  public code: string = 'unauthorized';
  public statusCode: number = 401;

  constructor() {
    super('You are not authorized to access this endpoint');

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InternalError extends ApiError {
  public code: string = 'internal-server-error';
  public statusCode: number = 500;

  constructor() {
    super('Internal Server Error');

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends ApiError {
  public code: string = 'validation-error';
  public statusCode: number = 400;
  public errors?: any;

  constructor(errors?: any) {
    super('Form validation failed');
    Object.setPrototypeOf(this, new.target.prototype);

    this.errors = errors;
  }
}

export class EmailExistsError extends ApiError {
  public code: string = 'email-exists';
  public statusCode: number = 400;
  public errors?: any;

  constructor() {
    super('Email address is already registered');
    Object.setPrototypeOf(this, new.target.prototype);

    this.errors = [{ email: 'Email address is already registered' }];
  }
}

/* tslint:enable:max-classes-per-file*/
