/* eslint-env jest */

const Promise = require('bluebird')

const addVc = jest.fn(() =>
  Promise.resolve({
    id: 'abc-123',
    vcCurrent: 4,
    vcAllTime: 4,
    heartsUntilNextLevel: 1,
  })
)

export default addVc
