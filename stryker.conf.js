module.exports = function(config) {
  config.set({
    mutator: ['typescript'],
    packageManager: 'yarn',
    reporters: ['clear-text', 'progress'],
    testRunner: 'jest',
    testFramework: 'jest',
    transpilers: [],
    coverageAnalysis: 'off',
    tsconfigFile: './tsconfig.json',
    files: ['src/**/*.ts'],
    mutate: ['src/**/*.ts'],
  });
};
