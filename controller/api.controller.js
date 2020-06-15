exports.serveEndpoints = (req, res, next) => {
  res.send({
    availableEndpoints: {
      "POST /api/auth": {
        description: "Sign in user.",
        "request format": {
          password: "examplePassword",
          email: "example-email@email.com",
        },
      },
      "POST /api/users": {
        description: "Create a new user.",
        "request format": {
          password: "examplePassword",
          email: "example-email@email.com",
          name: "Example Name",
        },
      },
      "POST /api/users/words": {
        description: "Adds translated word if signed in.",
        "request format": {
          englishWord: "example",
          language: "German",
          translatedWord: "das Beispiel",
        },
      },
      "POST /api/translate": {
        description: "Retrieve a translated word.",
        "request format": {
          word: "example",
          langpair: "en|fr",
        },
      },
      "POST /api/associations": {
        description:
          "Retrieves 3 associated words for a given word. Can be filtered by word type.",
        "request format": {
          text: "example",
          lang: "en",
          filter: "null or adjective, verb or noun",
        },
      },
      "POST /api/associations/game": {
        description:
          "Retrieves 3 associated words and returns them in an array with the original word included",
        "request format": {
          text: "example",
          lang: "en",
        },
      },
    },
  });
};