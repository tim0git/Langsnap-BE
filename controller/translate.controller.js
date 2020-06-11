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
  const apiKeyFixed = "82c44cd0-21d2-4e27-b134-6c24d6e55e6c";

  fetchAssociatedWords(apiKeyFixed, text, lang)
    .then(({ data: { response } }) => {
      if (filter) {
        const wordsArray = response[0].items
          .filter((word) => word.pos !== filter)
          .slice(0, 3);
        const associatedWord = response[0].text;
        res
          .status(200)
          .send({ message: { word: associatedWord, wordsArray: wordsArray } });
      } else {
        const wordsArray = response[0].items.slice(0, 3);
        const associatedWord = response[0].text;
        res
          .status(200)
          .send({ message: { word: associatedWord, wordsArray: wordsArray } });
      }
    })
    .catch(({ response: { status, statusText } }) => {
      next({ status: status, message: statusText });
    });
}; 