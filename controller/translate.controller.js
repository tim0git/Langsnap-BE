const {
  fetchAssociatedWords,
  fetchTranslatedWords,
} = require("../models/translate.model");

exports.translateWord = (req, res, next) => {
  const { word, langpair } = req.body;
  const valid = /^[a-zA-Z\s]*$/;
  if (!valid.test(word)) return next({ status: 400, message: "Invalid word." });
  fetchTranslatedWords(word, langpair).then(({ data }) => {
    const { translatedText } = data.responseData;

    if (data.responseStatus !== 200) {
      next({
        status: data.responseStatus,
        message: translatedText,
        type: "translate",
      });
    } else {
      res.send({ message: translatedText });
    }
  });
};

exports.associationsWord = (req, res, next) => {
  const { text, lang, filter } = req.body;
  const apiKeyFixed = "c84ee5d6-e066-4675-8b57-94abd955b091";

  if (!text || !lang) {
    return next({
      status: 400,
      message: "Must have a valid language and input text.",
    });
  }

  const wordTypes = ["noun", "adjective", "verb", "adverb"];
  const validWordType = wordTypes.includes(filter);

  if (filter && !validWordType) {
    return res
      .status(400)
      .send({ message: "Filter must equal noun, adjective, verb or adverb" });
  }

  fetchAssociatedWords(apiKeyFixed, text, lang, filter)
    .then(({ data: { response } }) => {
      const wordsArray = response[0].items.slice(0, 3);
      const associatedWord = response[0].text;
      res.status(200).send({
        message: { word: associatedWord, wordsArray: wordsArray },
      });
    })
    .catch(({ response: { status, statusText } }) => {
      next({ status: status, message: statusText });
    });
};

exports.associationsWordGame = (req, res, next) => {
  const { text, lang } = req.body;
  const apiKeyFixed = "c84ee5d6-e066-4675-8b57-94abd955b091";

  if (!text || !lang) {
    return next({
      status: 400,
      message: "Must have a valid language and input text.",
    });
  }

  fetchAssociatedWords(apiKeyFixed, text, lang)
    .then(({ data: { response } }) => {
      const wordsArray = response[0].items.slice(0, 3);
      const associatedWord = response[0].text
      const capitalised =
        associatedWord.charAt(0).toUpperCase() + associatedWord.slice(1);

      const justWords = wordsArray.map((wordObj) => {
        return wordObj.item;
      });

      const randomIndex = Math.floor(Math.random() * justWords.length);

      justWords.splice(randomIndex, 0, capitalised);

      res.status(200).send({
        message: { word: associatedWord, wordsArray: justWords },
      });
    })
    .catch(({ response: { status, statusText } }) => {
      next({ status: status, message: statusText });
    });
};
