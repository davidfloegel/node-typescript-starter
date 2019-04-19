import {
  BadRequestError,
  DUPLICATE_ERROR_CODE,
  EmailExistsError,
  InternalError,
  ValidationError,
} from 'src/lib/errors';
import validate from 'validate.js';
import { User } from './interfaces';
import UserModel from './schema/user';
import VerificationTokenModel from './schema/verificationToken';

import { generateRandomHash } from 'utils/string';

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
  const validation = validate(formData, {
    email: { presence: true, email: true },
    password: { presence: true, length: { minimum: 4 } },
    firstName: { presence: true, length: { minimum: 2 } },
    lastName: { presence: true, length: { minimum: 2 } },
  });

  if (validation) {
    throw new ValidationError(validation);
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

    // TODO send an email

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

    return true;
  }

  return false;
};

const login = (email: string, password: string): IAuthObject => {
  return null;
};

export default {
  signup,
  confirmAccount,
  login,
};
