const {
  createUser,
  generateToken,
  createUserDB,
  saveWordToUserDB,
} = require("../models/firebase.model");

// create new user. FireBase Auth.
exports.createNewUser = async (req, res, next) => {
  const { password, email, name } = req.body;
  let regex = /^\S+@\S+$/;

  if (!name) return next({ status: 400, message: "Name required." });
  // moved email err above password, more semantic
  if (!regex.test(email))
    return next({
      status: 400,
      message: "The email address is badly formatted.",
    });
  if (!password)
    return next({
      status: 400,
      message: "The password must be 6 characters long or more.",
    });

  try {
    const userNew = await createUser(email, password);

    const { uid } = userNew.user;

    const token = await generateToken(uid);

    const newUser = {
      name,
      email,
    };
    await createUserDB(newUser, uid);
    res.status(201).send({ token: token, user: newUser });
  } catch (err) {
    const { code, message } = err; //destructured from the err object in a constant rather than in a function
    next({ code: code, message: message });
  }
};

exports.saveWordsToUserID = async (req, res, next) => {
  const { language, englishWord, translatedWord } = req.body;
  if (!language || !englishWord || !translatedWord) {
    return res.status(400).send({
      message:
        "Must have a valid language, englishWord, translatedWord in order to be stored in the database.",
    });
  }

  try {
    const { uid } = req;
    const newWord = {
      [language]: {
        [englishWord]: translatedWord,
      },
    };
    const wordsList = await saveWordToUserDB(uid, newWord);

    res.status(200).send({ wordsList: wordsList });
  } catch (err) {
    const { code, message } = err; //destructured from the err object in a constant rather than in a function
    next({ code: code, message: message });
  }
};
