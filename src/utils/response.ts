interface IResponseFormat {
  message: string | null;
  data?: any;
}

// TODO can this be automatically done in a middleware?
export const generateResponse = ({
  message = null,
  data = {},
}: IResponseFormat) => ({
  status: 'success',
  message,
  data,
});
