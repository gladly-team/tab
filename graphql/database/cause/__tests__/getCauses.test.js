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
    const getCauses = require('../getCauses').default
    const causes = await getCauses()

    expect(causes[0]).toEqual(MOCK_CAUSE_1)
    expect(causes[1]).toEqual(MOCK_CAUSE_2)
  })
})
