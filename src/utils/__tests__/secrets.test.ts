import config from 'utils/secrets';

// TODO improve
describe('Test Secrets', () => {
  it('tests the config', () => {
    expect(config).toBeDefined();
  });
});
