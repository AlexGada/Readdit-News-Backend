const ENV = process.env.NODE_env || "dev";

const devData = require("./development-data");
const testData = require("./test-data");

const data = {
  dev: devData,
  test: testData,
};

module.exports = data[ENV];
