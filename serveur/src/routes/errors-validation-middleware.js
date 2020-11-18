const { validationResult } = require("express-validator");
/**
 * Code tirer de: https://www.npmjs.com/package/express-validator
 */
exports.ErrorsValidation = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  } catch (error) {
    next(error);
  }
};
