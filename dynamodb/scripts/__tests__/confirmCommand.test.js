/* eslint-env jest */

import confirmCommand from "../confirmCommand";
jest.mock("../promptUserInput");
const prompt = require("../promptUserInput").default;

const standardDevDatabaseEndpoint = "http://localhost:8000";

beforeEach(() => {
  process.exit = jest.fn();
  console.log = jest.fn(); // just to hide messages during test
});

afterEach(() => {
  delete process.env.DYNAMODB_ENDPOINT;
});

describe("database command confirmation", () => {
  it("calls the callback when no prompt is needed", () => {
    process.env.DYNAMODB_ENDPOINT = standardDevDatabaseEndpoint;
    const mockCallbackFn = jest.fn();
    confirmCommand(mockCallbackFn);
    expect(mockCallbackFn).toHaveBeenCalled();
  });

  it("does not automatically call the callback when DB endpoint is non-standard", () => {
    process.env.DYNAMODB_ENDPOINT = "http://someotheraddress:8000";
    const mockCallbackFn = jest.fn();
    confirmCommand(mockCallbackFn);
    expect(mockCallbackFn).not.toHaveBeenCalled();
  });

  it("calls the callback when user responds affirmatively", () => {
    process.env.DYNAMODB_ENDPOINT = "http://someotheraddress:8000";
    const mockCallbackFn = jest.fn();
    prompt.mockImplementation((question, callback) => {
      callback("y"); // eslint-disable-line
    });
    confirmCommand(mockCallbackFn);
    expect(mockCallbackFn).toHaveBeenCalled();
  });

  it("does not call the callback when user responds negatively", () => {
    process.env.DYNAMODB_ENDPOINT = "http://someotheraddress:8000";
    const mockCallbackFn = jest.fn();
    prompt.mockImplementation((question, callback) => {
      callback("n"); // eslint-disable-line
    });
    confirmCommand(mockCallbackFn);
    expect(mockCallbackFn).not.toHaveBeenCalled();
  });

  it("does not call the callback when user responds nonsensically", () => {
    process.env.DYNAMODB_ENDPOINT = "http://someotheraddress:8000";
    const mockCallbackFn = jest.fn();
    prompt.mockImplementation((question, callback) => {
      callback("abc"); // eslint-disable-line
    });
    confirmCommand(mockCallbackFn);
    expect(mockCallbackFn).not.toHaveBeenCalled();
  });
});
