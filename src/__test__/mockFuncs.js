import * as helper from "../helper";

export const mockFetchLangData = () => {
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          data: {
            languages: [
              { language: "es", name: "Spanish" },
              { language: "nl", name: "Dutch" },
            ],
          },
        }),
    })
  );
};

export const mock2FetchQuotes = () => {
  jest
    .spyOn(helper, "fetchQuote")
    .mockImplementationOnce(() => ["First", " ", "English."])
    .mockImplementationOnce(() => ["Second", " ", "English."]);
};

export const mock3FetchQuotes = () => {
  jest
    .spyOn(helper, "fetchQuote")
    .mockImplementationOnce(() => ["First", " ", "English."])
    .mockImplementationOnce(() => ["Second", " ", "English."])
    .mockImplementationOnce(() => ["Third", " ", "English."]);
};

export const mock4FetchQuotes = () => {
  jest
    .spyOn(helper, "fetchQuote")
    .mockImplementationOnce(() => ["First", " ", "English."])
    .mockImplementationOnce(() => ["Second", " ", "English."])
    .mockImplementationOnce(() => ["Third", " ", "English."])
    .mockImplementationOnce(() => ["Fourth", " ", "English."]);
};

export const mock2TranslateQuotes = () => {
  jest
    .spyOn(helper, "translateQuote")
    .mockImplementationOnce(() => ["First", " ", "Spanish."])
    .mockImplementationOnce(() => ["Second", " ", "Spanish."]);
};
