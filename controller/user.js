const firebase = require("firebase");

// create new user. FireBase Auth.
exports.createNewUser = (req, res, next) => {
  const { password, email } = req.body;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((result) => {
      res.status(201).send({ result: result });
    })
    .catch(({ code, message }) => {
      next({ code: code, message: message });
    });
};
