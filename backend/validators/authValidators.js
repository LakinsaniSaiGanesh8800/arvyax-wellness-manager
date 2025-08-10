const { body } = require("express-validator");

exports.registerValidation = [
  body("email")
    .isEmail().withMessage("Valid email required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 chars long")
];

exports.loginValidation = [
  body("email")
    .isEmail().withMessage("Valid email required")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required")
];
