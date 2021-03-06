/* tslint:disable:max-classes-per-file*/

import _ from 'lodash';

export const DUPLICATE_ERROR_CODE = 11000;

export class ApiError extends Error {
  public code: string;
  public statusCode: number;
  public errors?: any;
}

export class UnauthorizedError extends ApiError {
  public code: string = 'unauthorized';
  public statusCode: number = 401;

  constructor(msg?: string) {
    super(msg || 'You are not authorized to access this endpoint');

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class CrendentialsInvalidError extends ApiError {
  public code: string = 'credentials-invalid-error';
  public statusCode: number = 401;

  constructor() {
    super('Email address or password incorrect');

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends ApiError {
  public code: string = 'bad-request-error';
  public statusCode: number = 400;

  constructor(msg?: string, errors?: any) {
    super(msg || 'Bad Request');

    Object.setPrototypeOf(this, new.target.prototype);
    this.errors = errors || [];
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

export class YupValidationError extends ApiError {
  public code: string = 'validation-error';
  public statusCode: number = 400;
  public errors?: any;

  constructor(errors?: any) {
    super('Form validation failed');
    Object.setPrototypeOf(this, new.target.prototype);

    const { inner } = errors;
    const formatted: any = {};
    _.forEach(inner, error => {
      const fieldPath = error.path;
      const fieldName = fieldPath.replace(/([A-Z]+)/g, ' $1');
      const message = error.message.replace(fieldPath, fieldName);
      formatted[fieldPath] = _.upperFirst(message);
    });

    this.errors = formatted;
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
