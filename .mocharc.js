process.env.NODE_ENV = "test";

module.exports = {
  extension: ["ts"],
  recursive: true,
  require: ["earljs/mocha", "ts-node/register/transpile-only", "source-map-support/register"],
  spec: ["test/**/*.test.ts"],
  watchExtensions: ["ts"],
};
