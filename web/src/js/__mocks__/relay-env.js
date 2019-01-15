/* eslint-env jest */

export default {
  network: {},
  store: {
    create: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
    getRoot: jest.fn(),
    getRootField: jest.fn(),
    getPluralRootField: jest.fn(),
  },
}
