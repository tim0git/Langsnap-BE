const firebase = require("firebase");

// create new user. FireBase Auth. *** no database connected yet! ***
exports.createNewUser = async (req, res, next) => {
  const { password, email } = req.body;
  try {
    const result = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    const token = result.user.xa;
    const uid = result.user.uid;
    // create user in database..
    // Send back token and user profile from database...
    res.status(201).send({ token: token, user: result });
  } catch ({ code, message }) {
    next({ code: code, message: message });
  }
};

// ***i have left this code so that anyone not familiar with asyn can see what is happening above.***
//   firebase
//     .auth()
//     .createUserWithEmailAndPassword(email, password)
//     .then((result) => {
//       res.status(201).send({ result: result });
//     })
//     .catch(({ code, message }) => {
//       next({ code: code, message: message });
//     });
