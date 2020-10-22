const authentication = require("../services/crawlers-manager").authentication;

const crawlers_auth_middleware = async (req, res, next) => {
  try {
    if (!req.get("authorization")) {
      res.status(403).send("authorization header empty");
      return;
    }

    const result = await authentication(req.get("authorization"));

    if (!result) {
      res.status(403).send("authentication result empty");
      return;
    }

    req.session = result;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = crawlers_auth_middleware;
