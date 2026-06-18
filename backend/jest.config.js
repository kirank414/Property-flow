process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/zillow_rentalmanager_test?schema=public";
process.env.DIRECT_URL = "postgresql://postgres:postgres@localhost:5432/zillow_rentalmanager_test?schema=public";

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
};
