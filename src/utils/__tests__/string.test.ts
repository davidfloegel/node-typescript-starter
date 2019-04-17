import { generateRandomHash } from 'utils/string';

describe('Test String Utils', () => {
  it('it generates a hash with default length of 16 characters', () => {
    const hash = generateRandomHash();
    expect(hash).toHaveLength(16);
  });

  it('it generates a hash with custom length', () => {
    const hash = generateRandomHash(4);
    expect(hash).toHaveLength(4);
  });
});
