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

const signup = (formData: ISignupFormData): IAuthObject => {
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
