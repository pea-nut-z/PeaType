import * as helper from "../helper";

export const defaultLayout = () => {
  jest.spyOn(helper, "getQuotes").mockImplementationOnce((lang) => {
    return Promise.resolve([
      ["First", " ", "English."],
      ["Second", " ", "English."],
    ]);
  });
};

export const style = () => {
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

export const fetchSuccess = () => {
  jest
    .spyOn(helper, "getQuotes")
    .mockImplementationOnce(() =>
      Promise.resolve([
        ["First", " ", "English."],
        ["Second", " ", "English."],
      ])
    )
    .mockImplementationOnce(() =>
      Promise.resolve([
        ["Third", " ", "English."],
        ["Fourth", " ", "English."],
      ])
    );

  jest
    .spyOn(helper, "getNextQuote")
    .mockImplementationOnce(() => Promise.resolve(["Third", " ", "English."]))
    .mockImplementationOnce(() => Promise.resolve(["Fourth", " ", "English."]))
    .mockImplementationOnce(() => Promise.resolve(["Fifth", " ", "English."]));
};

export const quotesError = () => {
  jest.spyOn(helper, "getQuotes").mockImplementationOnce(() => Promise.reject());
};

export const nextQuoteError = () => {
  jest.spyOn(helper, "getQuotes").mockImplementationOnce(() =>
    Promise.resolve([
      ["First", " ", "English."],
      ["Second", " ", "English."],
    ])
  );
  jest.spyOn(helper, "getNextQuote").mockImplementation(() => Promise.reject());
};

export const noPunctuation = () => {
  jest.spyOn(helper, "getQuotes").mockImplementationOnce((lang) => {
    return Promise.resolve([
      ["First", " ", "line"],
      ["Second", " ", "line"],
    ]);
  });

  jest
    .spyOn(helper, "getNextQuote")
    .mockImplementation(() => Promise.resolve(["Third", " ", "line"]));
};

export const fetchLangs = () => {
  jest.spyOn(helper, "fetchLangs").mockImplementation(() =>
    Promise.resolve([
      { language: "es", name: "Spanish" },
      { language: "en", name: "English" },
      { language: "nl", name: "Dutch" },
    ])
  );
};

export const translate = () => {
  jest
    .spyOn(helper, "getQuotes")
    .mockImplementationOnce((lang) => {
      return Promise.resolve([
        ["First", " ", "English."],
        ["Second", " ", "English."],
      ]);
    })
    .mockImplementationOnce((lang) => {
      return Promise.resolve([
        ["First", " ", "Spanish."],
        ["Second", " ", "Spanish."],
      ]);
    });
};
