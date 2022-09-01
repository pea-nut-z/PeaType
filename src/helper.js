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

const langApi = `https://www.googleapis.com/language/translate/v2/languages?key=${process.env.REACT_APP_API_KEY}&target=en`;
const quoteApi = "/api/";
// const quoteApi = "https://api.quotable.io/random";
const translateApi = `https://translation.googleapis.com/language/translate/v2?key=${process.env.REACT_APP_API_KEY}`;

export const timeOptions = [15, 30, 60, 120, 240];

export const noSpaceLangs = [
  "zh-TW", //"Chinese(Traditional)",
  "zh-CN", //"Chinese(Simplified)"
  "zh", //"Chinese(Simplified)"
  "ja", //"Japanese"
  "lo", //"Lao"
  "km", // "Khmer"
  "th", // "Thai"
];

export const rightToLeftLangs = [
  "ar", // Arabic
  "ur", // Urdu
  "iw", // Hebrew
  "fa", // Persian
  "sd", // Sindhi
];
export const fullstop = [".", "!", ":", "।", "።", "|", "။"];

const decodeHtmlEntity = (str) => {
  return str.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  });
};

const addSpace = (quote) => {
  const arr = quote.split("");
  let x = 0;
  while (x < arr.length - 2) {
    const ran = Math.floor(Math.random() * (3 - 1) + 1);
    arr.splice(x + ran, 0, " ");
    x = x + ran + 1;
  }
  const result = arr.join("").split(/(\s+)/);
  return result;
};

const fetchQuote = () => {
  return fetch(quoteApi)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`API status ${res.status} - ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => {
      return data.content.split(/(\s+)/);
    })
    .catch((err) => {
      throw err;
    });
};

export const translateQuote = async (toLang, quote) => {
  let url = translateApi;
  url += "&q=" + encodeURI(quote.join(""));
  url += `&source=en`;
  url += `&target=${toLang}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API status ${res.status} - ${res.statusText}`);
    const json = await res.json();
    let translation = json.data.translations[0].translatedText;

    if (toLang === "fr") {
      translation = decodeHtmlEntity(translation);
    }

    // convert quote to array with spaces
    if (noSpaceLangs.includes(toLang)) {
      translation = addSpace(translation);
    } else {
      translation = translation.split(/(\s+)/);
    }

    return translation;
  } catch (error) {
    throw error;
  }
};

export const getQuotes = async (selectedLang) => {
  const quote1 = fetchQuote();
  const quote2 = fetchQuote();
  let quotes = await Promise.all([quote1, quote2]).catch((error) => {
    throw error;
  });

  if (selectedLang !== "en") {
    const translated1 = translateQuote(selectedLang, quotes[0]);
    const translated2 = translateQuote(selectedLang, quotes[1]);
    quotes = await Promise.all([translated1, translated2]).catch((error) => {
      throw error;
    });
  }
  return quotes;
};

export const getNextQuote = async (selectedLang) => {
  try {
    let quote = await fetchQuote();
    if (selectedLang !== "en") {
      quote = await translateQuote(selectedLang, quote);
    }
    return quote;
  } catch (error) {
    throw error;
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

  // ADD CORRECT SPACING
  if (!isLastWord && inputLen === wordLen) {
    count++;
  }
  return count;
};

export const fetchLangs = async () => {
  return fetch(langApi)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`API status ${res.status} - ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => data.data.languages);
};
