const router = require("express").Router();
const authController = require("../controllers/authController");
const validate = require("../middleware/validate");
const { registerValidation, loginValidation } = require("../validators/authValidators");

router.post("/register", registerValidation, validate, authController.register);
router.post("/login", loginValidation, validate, authController.login);

module.exports = router;
