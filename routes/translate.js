const translateRouter = require("express").Router();
const { translateWord } = require("../controller/translate");

//signIn user
translateRouter.route("/").post(translateWord);

module.exports = { translateRouter };
