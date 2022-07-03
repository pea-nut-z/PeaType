import * as helper from "../helper";

export const mockFetchLangData = () => {
  jest.spyOn(helper, "fetchLangData").mockImplementation(() => [
    { language: "es", name: "Spanish" },
    { language: "nl", name: "Dutch" },
  ]);
};

export const mockGetQuotes = () => {
  jest
    .spyOn(helper, "getQuotes")
    .mockImplementationOnce((lang) => {
      switch (lang) {
        case "en":
          return Promise.resolve([
            ["First", " ", "English."],
            ["Second", " ", "English."],
          ]);
        case "es":
          return Promise.resolve([
            ["First", " ", "Spanish."],
            ["Second", " ", "Spanish."],
          ]);
        case "th":
          return Promise.resolve([
            ["First", " ", "Thai"],
            ["Second", " ", "Thai"],
          ]);
        case "ar":
          return Promise.resolve([
            ["First", " ", "Arabic."],
            ["Second", " ", "Arabic."],
          ]);
        default:
          return Promise.reject();
      }
    })
    .mockImplementationOnce((lang) => {
      switch (lang) {
        case "en":
          return Promise.resolve([
            ["Third", " ", "English."],
            ["Fourth", " ", "English."],
          ]);
        case "es":
          return Promise.resolve([
            ["First", " ", "Spanish."],
            ["Second", " ", "Spanish."],
          ]);
        default:
          return Promise.reject();
      }
    });
};

export const mockGetNextQuote = () => {
  jest
    .spyOn(helper, "getNextQuote")
    .mockImplementationOnce((lang) => {
      switch (lang) {
        case "en":
          return Promise.resolve(["Third", " ", "English."]);
        case "es":
          return Promise.resolve(["Third", " ", "Spanish."]);
        case "th":
          return Promise.resolve(["Third", " ", "Spanish."]);
        default:
          return Promise.reject();
      }
    })
    .mockImplementationOnce((lang) => {
      switch (lang) {
        case "es":
          return Promise.resolve(["Fourth", " ", "Spanish."]);
        default:
          return Promise.reject();
      }
    })
    .mockImplementationOnce((lang) => {
      switch (lang) {
        case "es":
          return Promise.resolve(["Fifth", " ", "Spanish."]);
        default:
          return Promise.reject();
      }
    });
};

export const mockGetQuotesForErrorTest = () => {
  jest
    .spyOn(helper, "getQuotes")
    // .mockImplementationOnce(() => Promise.reject())
    .mockImplementationOnce(() =>
      Promise.resolve([
        ["First", " ", "English."],
        ["Second", " ", "English."],
      ])
    );

  jest.spyOn(helper, "getNextQuote").mockImplementation(() => Promise.reject());
};

export const mockGetQuotesForStyleTest = () => {
  jest.spyOn(helper, "getQuotes").mockImplementationOnce(() =>
    Promise.resolve([
      [
        "One",
        " ",
        "of",
        " ",
        "the",
        " ",
        "most",
        " ",
        "beautiful",
        " ",
        "qualities",
        " ",
        "of",
        " ",
        "true",
        " ",
        "friendship",
        " ",
        "is",
        " ",
        "to",
        " ",
        "understand",
        " ",
        "and",
        " ",
        "to",
        " ",
        "be",
        " ",
        "understood.",
      ],
      ["Second", " ", "Quote."],
    ])
  );
};

export const mockTranslateQuoteInThai = () => {
  jest
    .spyOn(helper, "translateQuote")
    .mockImplementationOnce(() => ["First", " ", "Thai"])
    .mockImplementationOnce(() => ["Second", " ", "Thai"])
    .mockImplementationOnce(() => ["Third", " ", "Thai"]);
};
