const {
  generateToken,
  signIn,
  signInToken,
  getUserProfile,
} = require("../models/firebase.model");

exports.signinUser = async (req, res, next) => {
  const { password, email } = req.body;

  if (!password)
    return next({
      status: 400,
      message: "The password must be 6 characters long or more.",
    });
  const regex = /^\S+@\S+$/;
  if (!regex.test(email))
    return next({
      status: 400,
      message: "The email address is badly formatted.",
    });

  try {
    const uid = await signIn(email, password);

    const customToken = await generateToken(uid);

    const user = await getUserProfile(uid);

    res.status(200).send({ token: customToken, user: user });
  } catch ({ code, message }) {
    next({ code: code, message: message });
  }
};

exports.auth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send({ message: "no token, authorisation denied" });
  }
  try {
    const authorised = await signInToken(token);
    req.uid = authorised.user.uid;
    req.email = authorised.user.email;
    next();
  } catch (err) {
    res.status(401).send({ message: "token is not valid" });
  }
};
