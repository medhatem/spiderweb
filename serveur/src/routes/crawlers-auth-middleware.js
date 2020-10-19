const authentication = require("../services/crawlers-manager").authentication;

const crawlers_auth_middleware = async (req, res, next) => {
  if (!req.get("authorization")) {
    return res.status(403);
  }

  const result = await authentication(req.get("authorization"));

  if (!result) {
    return res.status(403);
  }

  req.session = result;

  next();
};

module.exports = crawlers_auth_middleware;
