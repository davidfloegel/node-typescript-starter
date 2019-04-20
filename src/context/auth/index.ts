import {
  BadRequestError,
  CrendentialsInvalidError,
  DUPLICATE_ERROR_CODE,
  EmailExistsError,
  InternalError,
  UnauthorizedError,
  ValidationError,
} from 'src/lib/errors';
import validate from 'validate.js';

import { generateRandomHash } from 'utils/string';

import { User } from './interfaces';
import UserModel from './schema/user';
import VerificationTokenModel from './schema/verificationToken';

import { generateToken } from './utils';

export interface IAuthObject {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
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

export interface ISigninFormData {
  email: string;
  password: string;
}

const signup = async (formData: ISignupFormData): Promise<User> => {
  const validationFailed = validate(formData, {
    email: { presence: true, email: true },
    password: { presence: true, length: { minimum: 4 } },
    firstName: { presence: true, length: { minimum: 2 } },
    lastName: { presence: true, length: { minimum: 2 } },
  });

  if (validationFailed) {
    throw new ValidationError(validationFailed);
  }

  const newUser = new UserModel({
    email: formData.email,
    password: formData.password,
    firstName: formData.firstName,
    lastName: formData.lastName,
  });

  try {
    const persisted = await newUser.save();

    const verificationToken = new VerificationTokenModel({
      userId: persisted._id,
      token: generateRandomHash(),
      createdAt: new Date(),
    });

    await verificationToken.save();

    // TODO send an email with verification link

    return persisted.toObject();
  } catch (e) {
    if (e.code === DUPLICATE_ERROR_CODE) {
      throw new EmailExistsError();
    }

    throw new InternalError();
  }
};

const confirmAccount = async (token: string): Promise<boolean> => {
  const findToken = await VerificationTokenModel.findOne({ token });

  if (!findToken) {
    throw new BadRequestError('The provided token is invalid');
  }

  const findUser = await UserModel.findById(findToken.userId);

  if (!findUser) {
    throw new BadRequestError('There is no user linked to this token');
  }

  if (findUser.flags.accountConfirmedAt) {
    throw new BadRequestError('This account has already been verified');
  }

  const updatedUser = await UserModel.updateOne(
    { _id: findUser._id },
    {
      $set: {
        'flags.accountConfirmedAt': new Date(),
      },
    }
  );

  if (updatedUser.ok === 1) {
    await VerificationTokenModel.deleteOne({ token });

    // TODO send verification email

    return true;
  }

  return false;
};

const login = async (formData: ISigninFormData): Promise<IAuthObject> => {
  const validationFailed = validate(formData, {
    email: { presence: true, email: true },
    password: { presence: true },
  });

  if (validationFailed) {
    throw new ValidationError(validationFailed);
  }

  const user = await UserModel.findOne(
    { email: formData.email },
    {
      email: 1,
      password: 1,
      firstName: 1,
      lastName: 1,
      'flags.accountConfirmedAt': 1,
    }
  );

  if (!user) {
    throw new CrendentialsInvalidError();
  }

  if (!user.flags.accountConfirmedAt) {
    throw new UnauthorizedError("Your account hasn't been verified yet");
  }

  if (!(await user.comparePassword(formData.password))) {
    throw new CrendentialsInvalidError();
  }

  return {
    user: {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    token: generateToken(user._id),
  };
};

export default {
  signup,
  confirmAccount,
  login,
};
