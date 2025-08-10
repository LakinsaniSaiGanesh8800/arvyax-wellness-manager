const { body } = require("express-validator");

exports.saveDraftValidation = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),
  body("tags")
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return true;
      if (typeof value === "string") return true;
      throw new Error("Tags must be a comma-separated string or an array");
    }),
  body("json_file_url")
    .optional()
    .isURL().withMessage("json_file_url must be a valid URL")
];

exports.publishValidation = [
  body("title")
    .optional()
    .isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),
  body("tags")
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return true;
      if (typeof value === "string") return true;
      throw new Error("Tags must be a comma-separated string or an array");
    }),
  body("json_file_url")
    .optional()
    .isURL().withMessage("json_file_url must be a valid URL")
];
