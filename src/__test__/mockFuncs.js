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
    .mockImplementationOnce(() => ["Fourth", " ", "English."]);
};

export const mockTranslateQuote = () => {
  jest
    .spyOn(helper, "translateQuote")
    .mockImplementationOnce(() => ["First", " ", "Spanish."])
    .mockImplementationOnce(() => ["Second", " ", "Spanish."])
    .mockImplementationOnce(() => ["Third", " ", "Spanish."]);
};
