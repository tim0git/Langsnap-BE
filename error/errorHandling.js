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
  //console.log(err);
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
  };
  if (code in codes) {
    const { status, message } = codes[err.code];
    res.status(status).send({ message });
  } else {
    next(err);
  }
};

exports.handleCustomError = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

exports.handleInternalError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};
