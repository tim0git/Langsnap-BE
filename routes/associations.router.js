const associationsRouter = require("express").Router();
const { associationsWord } = require("../controller/translate.controller");
const { handle405s } = require("../error/errorHandling");

//get word associations
associationsRouter.route("/").post(associationsWord).all(handle405s);

module.exports = { associationsRouter };
