const translateRouter = require("express").Router();
const { translateWord } = require("../controller/translate.controller");
const { handle405s } = require("../error/errorHandling");

translateRouter.route("/").post(translateWord).all(handle405s);

module.exports = { translateRouter };
