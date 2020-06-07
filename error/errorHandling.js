exports.send404 = (req, res, next) => {
  res.status(404).send({
    availableRoutes: {
      message: "tbc",
    },
  });
};

exports.handle405 = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};

exports.handleFirebase_Error = (err, req, res, next) => {
  const { code } = err;
  const codes = {
    "auth/wrong-password": {
      status: 400,
      message: "The password must be 6 characters long or more.",
    },
    "auth/weak-password": {
      status: 400,
      message: "The password must be 6 characters long or more.",
    },
    "auth/user-not-found": {
      status: 404,
      message:
        "There is no user record corresponding to this identifier. The user may have been deleted.",
    },
    "auth/email-already-in-use": {
      status: 400,
      message: "The email address is already in use by another account.",
    },
    "auth/invalid-api-key": {
      status: 500,
      message:
        "Your API key is invalid, please check you have copied it correctly.",
    },
    "auth/quota-exceeded": {
      status: 400,
      message: "Exceeded quota for verifying passwords.",
    },
    "auth/argument-error": {
      status: 400,
      message:
        'createUserWithEmailAndPassword failed: Second argument "password" must be a valid string.',
    },
  };
  if (code in codes) {
    //console.log("handled firebase error");
    const { status, message } = codes[err.code];
    res.status(status).send({ message });
  } else {
    console.log("passed next firebase error");
    next(err);
  }
};

exports.handleCustomError = (err, req, res, next) => {
  if (err.status) {
    console.log("handled custom error");
    res.status(err.status).send({ message: err.message });
  } else {
    console.log("passed next custom error");
    next(err);
  }
};

exports.handleInternalError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};
