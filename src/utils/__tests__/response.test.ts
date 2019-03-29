import { generateResponse } from 'utils/response';

describe('Response Util', () => {
  it('it generates a successful response structure', () => {
    expect(generateResponse({ message: 'I was successful' })).toEqual({
      status: 'success',
      message: 'I was successful',
      data: {},
    });
  });

  it('it generates a successful response structure with data', () => {
    expect(
      generateResponse({
        message: 'I was successful',
        data: { user: { name: 'Mark' } },
      })
    ).toEqual({
      status: 'success',
      message: 'I was successful',
      data: { user: { name: 'Mark' } },
    });
  });
});
