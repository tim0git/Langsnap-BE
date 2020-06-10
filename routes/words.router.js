wordsRouter = require("express").Router();
const { saveWordsToUserID } = require("../controller/user.controller");
const { auth } = require("../controller/auth.controller");

wordsRouter.route("/").post(auth, saveWordsToUserID);

module.exports = { wordsRouter };
