exports.handleInvalidMethods = (req, res, next) => {
  res.status(405).send({ msg: "Invalid method" });
};

exports.handleInvalidPaths = (req, res, next) => {
  next({ status: 404, msg: "Route not found" });
};

exports.handle400s = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePSQL = (err, req, res, next) => {
  const badReqCodes = ["22P02", "42703"];
  const notFoundCodes = ["23503"];
  if (badReqCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  } else if (notFoundCodes.includes(err.code)) {
    res.status(404).send({ msg: "Not found" });
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err, "<-- error message");
  res.status(500).send({ msg: "Server error" });
};
