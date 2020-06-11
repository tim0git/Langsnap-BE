wordsRouter = require("express").Router();
const { saveWordsToUserID } = require("../controller/user.controller");
const { auth } = require("../controller/auth.controller");
const { handle405s } = require("../error/errorHandling");

wordsRouter.route("/").post(auth, saveWordsToUserID).all(handle405s);

module.exports = { wordsRouter };
