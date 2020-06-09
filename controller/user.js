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
    const result = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    const uid = result.user.uid;

    const token = await admin.auth().createCustomToken(uid);

    const user = {
      name,
      email,
    };

    usersRef.child(uid).set(user);
    // create user in database..
    // Send back token and user profile from database...
    res.status(201).send({ token: token, user: user });
  } catch ({ code, message }) {
    next({ code: code, message: message });
  }
};

exports.saveWordsToUserID = (req, res, next) => {
  const { language, englishWord, translatedWord } = req.body;
  const { uid } = req;

  const newWord = {
    [language]: {
      [englishWord]: translatedWord,
    },
  };

  ref = database.ref("users/" + uid + "/words");

  const newPostKey = ref.child("words").push().key;

  const updates = {};
  updates["/words/" + newPostKey] = newWord;
  ref.update(updates);

  ref.once("value", (snapShot) => {
    console.log(snapShot.val());
  });

  res.status(200).send({ message: "wip on routes" });
};

const words = {
  "-M9Oh-_Kc6ViGpVzVbwK": { german: { eng: "germ1" } },
  "-M9Oh3l_04Zn7MOyiDW8": { german: { eng: "germ2" } },
  "-M9Oh5vGmhsvltovbpOr": { german: { eng: "germ3" } },
  "-M9OhzLPDtgdl7DV38m1": { german: { eng: "germ4" } },
};

const mappy = Object.entries(words).map(([key, obj]) => {
  return obj["german"];
});

console.log(mappy);
