/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/__tests__"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  testMatch: [
    "<rootDir>/src/__tests__/features/**/*.test.ts",
    "<rootDir>/src/__tests__/unit/**/*.test.ts"
  ]
};
