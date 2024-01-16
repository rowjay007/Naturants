// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/utils/redisService.ts",
  ],
  setupFilesAfterEnv: ["./src/tests/setup.ts"],
  detectOpenHandles: true,
};
