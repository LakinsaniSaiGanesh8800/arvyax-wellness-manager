const router = require("express").Router();
const sessionController = require("../controllers/sessionController");
const authJwt = require("../middleware/authJwt");
const validate = require("../middleware/validate");
const { saveDraftValidation, publishValidation } = require("../validators/sessionValidators");

// Public
router.get("/sessions", sessionController.listPublished);

// Protected
router.get("/my-sessions", authJwt, sessionController.listMine);
router.get("/my-sessions/:id", authJwt, sessionController.getOne);
router.post("/my-sessions/save-draft", authJwt, saveDraftValidation, validate, sessionController.saveDraft);
router.post("/my-sessions/publish", authJwt, publishValidation, validate, sessionController.publish);

module.exports = router;
