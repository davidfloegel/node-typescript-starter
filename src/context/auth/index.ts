import Validator from 'muso-validatejs';
import {
  DUPLICATE_ERROR_CODE,
  EmailExistsError,
  InternalError,
  ValidationError,
} from 'src/lib/errors';
import UserModel from './schema';
import { User } from './interfaces';

export interface IAuthObject {
  user: {
    email: string;
  };
  token: string;
}

export interface ISignupFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const signup = async (formData: ISignupFormData): Promise<User> => {
  const validation = Validator.check(formData, {
    email: { required: true, email: true },
    password: { required: true, type: 'string', min: 4 },
    firstName: { required: true, type: 'alphanum', min: 2 },
    lastName: { required: true, type: 'alphanum', min: 2 },
  });

  if (validation.failed()) {
    const errors = validation.errors().asSentence();
    throw new ValidationError(errors);
  }

  const newUser = new UserModel({
    email: formData.email,
    password: formData.password,
    firstName: formData.firstName,
    lastName: formData.lastName,
  });

  try {
    const persisted = await newUser.save();
    return persisted.toObject();
  } catch (e) {
    if (e.code === DUPLICATE_ERROR_CODE) {
      throw new EmailExistsError();
    }

    throw new InternalError();
  }
};

const confirmAccount = (email: string): boolean => {
  return null;
};

const login = (email: string, password: string): IAuthObject => {
  return null;
};

export default {
  signup,
  confirmAccount,
  login,
};
