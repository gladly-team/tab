/* eslint-env jest */

const jsSHAInstance = {
  getHash: jest.fn(),
  update: jest.fn(),
}

const jsSHAMock = jest.fn(() => jsSHAInstance)

export default jsSHAMock
