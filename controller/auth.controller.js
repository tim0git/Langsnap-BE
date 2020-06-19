const {
  generateToken,
  signIn,
  signInToken,
  getUserProfile,
} = require("../models/firebase.model");

exports.signinUser = async (req, res, next) => {
  const { password, email } = req.body;

  // moved email above password, more semantic if email is read first, top to botttom...
  const regex = /^\S+@\S+$/;
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
    const uid = await signIn(email, password);

    const customToken = await generateToken(uid);

    const user = await getUserProfile(uid);

    res.status(200).send({ token: customToken, user: user });
  } catch (err) {
    // destructuring in a constant rather than in the function call on line 32
    const { code, message } = err;
    next({ code: code, message: message });
  }
};

exports.auth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send({ message: "No token, authorisation denied" }); //capitalised 'no'
  }
  try {
    const authorised = await signInToken(token);
    req.uid = authorised.user.uid;
    req.email = authorised.user.email;
    next();
  } catch (err) {
    res.status(401).send({ message: "Token is not valid" }); //capitalised 'token'
  }
};
