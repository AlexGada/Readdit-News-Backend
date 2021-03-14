exports.handleInvalidPaths = (req, res, next) => {
  next({ status: 404, msg: "Route not found" });
};

exports.handleInvalidMethods = (req, res, next) => {
  res.status(405).send({ msg: "Invalid method" });
};

exports.handle400s = (err, req, res, next) => {
  console.log("in our handle 400s");
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

exports.handlePSQL = (err, req, res, next) => {
  console.log("in our handle PSQL");
  if (err.code) res.status(400).send({ msg: "Bad request" });
  else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log("in our handle 500s");
  console.log(err);
  res.status(500).send({ msg: "Server error" });
};
