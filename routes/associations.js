const associationsRouter = require("express").Router();
const { associationsWord } = require("../controller/translate");

//get word associations
associationsRouter.route("/").get(associationsWord);

module.exports = { associationsRouter };
