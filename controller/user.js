const firebase = require("firebase");

exports.createNewUser = (req, res, next) => {
  const { password, email } = req.body;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((result) => {
      res.status(200).send({ result: result });
    })
    .catch(({ code, message }) => {
      next({ code: code, message: message });
    });
};
