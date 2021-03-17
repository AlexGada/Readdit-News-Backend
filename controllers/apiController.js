const { fetchEndpoints } = require("../models/apiModels");

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints().then((endpoints) => {
    res.status(200).send({ endpoints });
  });
};
