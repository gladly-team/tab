/* eslint-env jest */

const MOCK_CAUSE_1 = {
  id: 'abc123',
  charityId: 'some-id-1',
  landingPagePath: '/foo',
}
const MOCK_CAUSE_2 = {
  id: 'def456',
  charityId: 'some-id-2',
  landingPagePath: '/bar',
}

jest.mock('../causes', () => {
  return [MOCK_CAUSE_1, MOCK_CAUSE_2]
})

afterEach(() => {
  jest.resetModules()
})

describe('getCause', () => {
  it('returns the expected causes', async () => {
    expect.assertions(2)
    const getCause = require('../getCause').default
    expect(await getCause('abc123')).toEqual(MOCK_CAUSE_1)
    expect(await getCause('def456')).toEqual(MOCK_CAUSE_2)
  })

  it('throws if the cause does not exist', async () => {
    expect.assertions(1)
    const getCause = require('../getCause').default
    await expect(getCause('blahblah')).rejects.toThrow(
      'The database does not contain an item with these keys.'
    )
  })
})
