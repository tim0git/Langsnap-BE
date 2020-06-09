wordsRouter = require("express").Router();
const { saveWordsToUserID } = require("../controller/user");
const { auth } = require("../controller/auth");

wordsRouter.route("/").post(auth, saveWordsToUserID);

module.exports = { wordsRouter };
