/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Integration tests share one database; parallel files would race on deleteMany / fixtures.
  maxWorkers: 1,
  roots: ["<rootDir>/src/__tests__"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  testMatch: [
    "<rootDir>/src/__tests__/features/**/*.test.ts",
    "<rootDir>/src/__tests__/unit/**/*.test.ts"
  ]
};
