const secrets = {
  type: process.env.REACT_APP_type,
  project_id: process.env.REACT_APP_project_id,
  private_key_id: process.env.REACT_APP_private_key_id,
  private_key: process.env.REACT_APP_private_key,
  client_email: process.env.REACT_APP_client_email,
  client_id: process.env.REACT_APP_client_id,
  auth_uri: process.env.REACT_APP_auth_uri,
  token_uri: process.env.REACT_APP_token_uri,
  auth_provider_x509_cert_url: process.env.REACT_APP_auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.REACT_APP_client_x509_cert_url,
};

export const credentials = JSON.parse(JSON.stringify(secrets));
export const LANG_LIST_API_URL = `https://www.googleapis.com/language/translate/v2/languages?key=${process.env.REACT_APP_API_KEY}&target=en`;
export const RANDOM_QUOTE_API_URL = "http://api.quotable.io/random";

export const fetchQuote = async () => {
  try {
    return await fetch(RANDOM_QUOTE_API_URL)
      .then((res) => res.json())
      .then((result) => result.content.split(/(\s+)/));
  } catch (error) {
    console.log("Fetch quote error", error);
  }
};

export const getNumOfCorrectChar = (word, input, isLastWord) => {
  const wordLen = word.length;
  const inputLen = input.length;
  let count = 0;

  if (input === word) {
    count = inputLen;
  } else {
    const wordArr = word.split("");
    const inputArr = input.split("");

    inputArr.forEach((char, idx) => {
      char === wordArr[idx] && count++;
    });
  }

  if (!isLastWord && inputLen === wordLen) {
    count++;
  }
  return count;
};

export const translateQuote = async (toLang, quote) => {
  let url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_API_KEY}`;
  url += "&q=" + encodeURI(quote.join(""));
  url += `&source=en`;
  url += `&target=${toLang}`;
  try {
    return await fetch(url)
      .then((res) => res.json())
      .then((result) => result.data.translations[0].translatedText.split(/(\s+)/));
  } catch (error) {
    console.log("Translate quote error", error);
  }
};
