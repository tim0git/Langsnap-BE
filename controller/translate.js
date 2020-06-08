const axios = require("axios");

//call to translated word api
exports.translateWord = (req, res, next) => {
  const { word, langpair } = req.body;
  const valid = /^[a-zA-Z\s]*$/;
  if (!valid.test(word)) return next({ status: 400, message: "Invalid word." });
  axios
    .get("https://api.mymemory.translated.net/get", {
      params: { q: word, langpair: langpair },
    })
    .then(({ data }) => {
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
}; //done returns the translated word

//call to word associaton api
exports.associationsWord = (req, res, next) => {
  const { text, lang, filter } = req.body;

  const apikeyFixed = "82c44cd0-21d2-4e27-b134-6c24d6e55e6c";
  axios
    .get("https://api.wordassociations.net/associations/v1.0/json/search", {
      params: { apiKey: apikeyFixed, text: text, lang: lang },
    })
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
      console.log(res);

      next({ status: status, message: statusText });
    });
}; //done return an array of 3 nouns.
