type ResponseFormat = {
  message: string | null;
  data?: any;
};

// TODO can this be automatically done in a middleware?
export const generateResponse = ({
  message = null,
  data = {},
}: ResponseFormat) => ({
  status: 'success',
  message,
  data,
});
