import * as helper from "../helper";

export const mockFetchLangData = () => {
  jest.spyOn(helper, "fetchLangData").mockImplementation(() => [
    { language: "es", name: "Spanish" },
    { language: "nl", name: "Dutch" },
  ]);
};

export const initial = () => {
  jest.spyOn(helper, "getQuotes").mockImplementationOnce((lang) => {
    if (lang === "en") {
      return Promise.resolve([
        ["First", " ", "English."],
        ["Second", " ", "English."],
      ]);
    }
    throw new Error();
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
    .mockImplementation(() => Promise.resolve(["Third", " ", "English."]));
};
// export const forDefault = () => {
//   jest
//     .spyOn(helper, "getQuotes")
//     .mockImplementationOnce((lang) => {
//       switch (lang) {
//         case "en":
//           return Promise.resolve([
//             ["First", " ", "English."],
//             ["Second", " ", "English."],
//           ]);
//         case "es":
//           return Promise.resolve([
//             ["First", " ", "Spanish."],
//             ["Second", " ", "Spanish."],
//           ]);
//         case "th":
//           return Promise.resolve([
//             ["First", " ", "Thai"],
//             ["Second", " ", "Thai"],
//           ]);
//         case "ar":
//           return Promise.resolve([
//             ["First", " ", "Arabic."],
//             ["Second", " ", "Arabic."],
//           ]);
//         default:
//           return Promise.reject();
//       }
//     })
//     .mockImplementationOnce((lang) => {
//       switch (lang) {
//         case "en":
//           return Promise.resolve([
//             ["Third", " ", "English."],
//             ["Fourth", " ", "English."],
//           ]);
//         case "es":
//           return Promise.resolve([
//             ["First", " ", "Spanish."],
//             ["Second", " ", "Spanish."],
//           ]);
//         default:
//           return Promise.reject();
//       }
//     });
// };

// jest
// .spyOn(helper, "getNextQuote")
// .mockImplementationOnce((lang) => {
// switch (lang) {
//   case "en":
//     return Promise.resolve(["Third", " ", "English."]);
//   case "es":
//     return Promise.resolve(["Third", " ", "Spanish."]);
//   case "th":
//     return Promise.resolve(["Third", " ", "Spanish."]);
//   default:
//     return Promise.reject();
// }
// Promise.resolve([
//   ["First", " ", "Thai"],
//   ["Second", " ", "Thai"],
// ])

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
    if (helper.noSpaceLangs.includes(lang)) {
      return Promise.resolve([
        ["First", " ", "line"],
        ["Second", " ", "line"],
      ]);
    }
    throw new Error();
  });

  jest
    .spyOn(helper, "getNextQuote")
    .mockImplementation(() => Promise.resolve(["Third", " ", "line"]));
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

export const mockTranslateQuoteInThai = () => {
  jest
    .spyOn(helper, "translateQuote")
    .mockImplementationOnce(() => ["First", " ", "Thai"])
    .mockImplementationOnce(() => ["Second", " ", "Thai"])
    .mockImplementationOnce(() => ["Third", " ", "Thai"]);
};
