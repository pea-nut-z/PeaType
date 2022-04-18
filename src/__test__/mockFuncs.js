import * as helper from "../helper";

export const mockFetchLangData = () => {
  jest.spyOn(helper, "fetchLangData").mockImplementation(() => [
    { language: "es", name: "Spanish" },
    { language: "nl", name: "Dutch" },
  ]);
};

export const mockFetchQuote = () => {
  jest
    .spyOn(helper, "fetchQuote")
    .mockImplementationOnce(() => ["First", " ", "English."])
    .mockImplementationOnce(() => ["Second", " ", "English."])
    .mockImplementationOnce(() => ["Third", " ", "English."])
    .mockImplementationOnce(() => ["Fourth", " ", "English."])
    .mockImplementationOnce(() => ["Fifth", " ", "English."]);
};
export const mockFetchQuoteForStyleTest = () => {
  jest
    .spyOn(helper, "fetchQuote")
    .mockImplementationOnce(() => [
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
    ])
    .mockImplementationOnce(() => ["Second", " ", "Quote."]);
};

export const mockTranslateQuote = () => {
  jest
    .spyOn(helper, "translateQuote")
    .mockImplementationOnce(() => ["First", " ", "Spanish."])
    .mockImplementationOnce(() => ["Second", " ", "Spanish."])
    .mockImplementationOnce(() => ["Third", " ", "Spanish."])
    .mockImplementationOnce(() => ["Fourth", " ", "Spanish."])
    .mockImplementationOnce(() => ["Fifth", " ", "Spanish."]);
};

export const mockTranslateQuoteInThai = () => {
  jest
    .spyOn(helper, "translateQuote")
    .mockImplementationOnce(() => ["First", " ", "Thai"])
    .mockImplementationOnce(() => ["Second", " ", "Thai"])
    .mockImplementationOnce(() => ["Third", " ", "Thai"]);
};
