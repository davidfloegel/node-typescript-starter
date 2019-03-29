module.exports = {
  roots: ['<rootDir>'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['<rootDir>/src/**/*.test.(ts|js)'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^test(.*)$': '<rootDir>/test/$1',
    '^src(.*)$': '<rootDir>/src/$1',
    '^context(.*)$': '<rootDir>/src/context/$1',
    '^controllers(.*)$': '<rootDir>/src/controllers/$1',
    '^thirdparty(.*)$': '<rootDir>/src/thirdparty/$1',
  },
};
