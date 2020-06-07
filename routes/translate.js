const translateRouter = require("express").Router();
const { translateWord } = require("../controller/translate");


//signIn user
translateRouter.route("/").get(translateWord);

module.exports = { translateRouter };
