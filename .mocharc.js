process.env.NODE_ENV = "test";

module.exports = {
  extension: ["ts"],
  require: ["ts-node/register/transpile-only", "earljs/mocha"],
  spec: ["test/**/*.test.ts"],
  watchExtensions: ["ts"],
};
