const userRouter = require("express").Router();
const firebase = require("firebase");

userRouter.route("/").get((req, res) => {
  res.send({ message: "working GET /api/user" });
});

//signIn user
userRouter.route("/").post((req, res) => {
  const { password, email } = req.body;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((result) => {
      res.status(200).send({ result: result });
    })
    .catch(function ({ code, message }) {
      res.status(404).send({ code: code, message: message });
    });
});

module.exports = { userRouter };
