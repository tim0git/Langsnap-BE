const firebase = require("firebase");
const admin = require("firebase-admin");
const serviceAccount = require("../config/pointtranslate-da844-firebase-adminsdk-prgku-17a5c09beb.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pointtranslate-da844.firebaseio.com",
  });
}
const database = admin.database();
const usersRef = database.ref("/users");
const { createUser, generateToken } = require("../models/firebase.model");

// create new user. FireBase Auth.
exports.createNewUser = async (req, res, next) => {
  const { password, email, name } = req.body;
  let regex = /^\S+@\S+$/;
  if (!name) return next({ status: 400, message: "Name required." });
  if (!password)
    return next({
      status: 400,
      message: "The password must be 6 characters long or more.",
    });

  if (!regex.test(email))
    return next({
      status: 400,
      message: "The email address is badly formatted.",
    });

  try {
    const userNew = await createUser(email, password);
    const { uid } = userNew.user;
    const token = await generateToken(uid);
    const newUser = {
      name,
      email,
    };
    usersRef.child(uid).set(newUser);
    res.status(201).send({ token: token, user: newUser });
  } catch ({ code, message }) {
    next({ code: code, message: message });
  }
};

exports.saveWordsToUserID = (req, res, next) => {
  const { language, englishWord, translatedWord } = req.body;
  if (!language || !englishWord || !translatedWord) {
    return res.status(400).send({
      message:
        "Must have a valid language, englishWord, translatedWord in order to be stored in the database.",
    });
  }
  const { uid } = req;
  const newWord = {
    [language]: {
      [englishWord]: translatedWord,
    },
  };
  ref = database.ref("users/" + uid);
  const newPostKey = ref.push().key;
  const updates = {};
  updates["/words/" + newPostKey] = newWord;
  ref.update(updates);
  const wordsList = ref.child("words").once("value", (snapShot) => {
    return snapShot.val();
  });
  res.status(200).send({ wordsList: wordsList });
};
