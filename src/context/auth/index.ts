import validate from 'validate.js';

import {
  BadRequestError,
  CrendentialsInvalidError,
  DUPLICATE_ERROR_CODE,
  EmailExistsError,
  InternalError,
  UnauthorizedError,
  ValidationError,
} from 'src/lib/errors';
import Mailer from 'thirdparty/mailer';
import { generateRandomHash } from 'utils/string';

import { User } from './interfaces';
import RecoveryTokenModel from './schema/recoveryToken';
import UserModel from './schema/user';
import VerificationTokenModel from './schema/verificationToken';

import { generateToken, hashPassword } from './utils';

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

export interface IRecoverAccountFormData {
  email: string;
}

export interface IResetPasswordFormData {
  token: string;
  newPassword: string;
  confirmPassword: string;
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

    const token = generateRandomHash();

    const verificationToken = new VerificationTokenModel({
      userId: persisted._id,
      createdAt: new Date(),
      token,
    });

    await verificationToken.save();

    Mailer.send({
      recipient: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
      subject: 'Welcome!',
    });

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

  try {
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
  } catch (e) {
    throw new InternalError();
  }
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

const recoverAccount = async (
  formData: IRecoverAccountFormData
): Promise<boolean> => {
  const validationFailed = validate(formData, {
    email: { presence: true, email: true },
  });

  if (validationFailed) {
    throw new ValidationError(validationFailed);
  }

  const user = await UserModel.findOne({ email: formData.email });

  if (!user) {
    throw new BadRequestError('Email address is not registered');
  }

  const existingToken = await RecoveryTokenModel.findOne({ userId: user._id });
  if (existingToken) {
    await RecoveryTokenModel.deleteOne({ _id: existingToken._id });
  }

  try {
    const token = new RecoveryTokenModel({
      userId: user._id,
      token: generateRandomHash(32),
      createdAt: new Date(),
    });

    const savedToken = await token.save();

    // @TODO send email

    return true;
  } catch (e) {
    throw new InternalError();
  }
};

const resetPassword = async (
  formData: IResetPasswordFormData
): Promise<boolean> => {
  const findToken = await RecoveryTokenModel.findOne({ token: formData.token });

  if (!findToken) {
    throw new BadRequestError('Recovery token is invalid or expired');
  }

  const user = await UserModel.findById(findToken.userId);

  if (!user) {
    throw new BadRequestError('Recovery token is invalid or expired');
  }

  const validationFailed = validate(formData, {
    newPassword: { presence: true, length: { minimum: 4 } },
    confirmPassword: { presence: true },
  });

  if (validationFailed) {
    throw new ValidationError(validationFailed);
  }

  if (formData.newPassword !== formData.confirmPassword) {
    throw new BadRequestError("New password and confirmation don't match");
  }

  try {
    const updatedUser = await UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashPassword(formData.newPassword),
        },
      }
    );

    if (updatedUser.ok === 1) {
      await RecoveryTokenModel.deleteOne({ token: formData.token });

      // TODO send confirmation email

      return true;
    }
    return false;
  } catch (e) {
    throw new InternalError();
  }
};

export default {
  signup,
  confirmAccount,
  login,
  resetPassword,
  recoverAccount,
};
