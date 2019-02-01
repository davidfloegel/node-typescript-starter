import UserModel, { User } from './schema';

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
  // @TODO form validation

  const newUser = new UserModel({
    email: formData.email,
    password: formData.password,
    firstName: formData.firstName,
    lastName: formData.lastName,
  });

  // @TODO try catch to handle insert errors?
  const persisted = await newUser.save();

  if (persisted) {
    return persisted.toObject();
  }

  return null;
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
