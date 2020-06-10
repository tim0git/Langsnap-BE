const axios = require("axios");

exports.fetchTranslatedWords = (word, langpair) => {
  return axios.get("https://api.mymemory.translated.net/get", {
    params: { q: word, langpair: langpair },
  });
};

exports.fetchAssociatedWords = (apiKeyFixed, text, lang) => {
  return axios.get(
    "https://api.wordassociations.net/associations/v1.0/json/search",
    {
      params: { apiKey: apiKeyFixed, text: text, lang: lang },
    }
  );
};
