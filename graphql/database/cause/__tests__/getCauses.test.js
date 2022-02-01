/* eslint-env jest */
import { getMockUserContext } from '../../test-utils'

const MOCK_CAUSE_1 = {
  id: 'abc123',
  charityId: 'some-id-1',
  landingPagePath: '/foo',
  isAvailableToSelect: true,
}
const MOCK_CAUSE_2 = {
  id: 'def456',
  charityId: 'some-id-2',
  landingPagePath: '/bar',
  isAvailableToSelect: false,
}
const MOCK_CAUSE_3 = {
  id: 'defe56',
  charityId: 'some-id-3',
  landingPagePath: '/bart',
  isAvailableToSelect: true,
}

jest.mock('../causes', () => {
  return [MOCK_CAUSE_1, MOCK_CAUSE_2, MOCK_CAUSE_3]
})

afterEach(() => {
  jest.resetModules()
})

describe('getCause', () => {
  it('returns the expected causes', async () => {
    expect.assertions(3)
    const getCauses = require('../getCauses').default
    const causes = await getCauses()

    expect(causes[0]).toEqual(MOCK_CAUSE_1)
    expect(causes[1]).toEqual(MOCK_CAUSE_2)
    expect(causes[2]).toEqual(MOCK_CAUSE_3)
  })

  it('filters on isAvailableToSelect when a filter is provided', async () => {
    expect.assertions(3)
    const mockUserContext = getMockUserContext()
    const getCauses = require('../getCauses').default
    const causes = await getCauses(mockUserContext, {
      isAvailableToSelect: true,
    })
    // Get only permanent partner charities.
    expect(causes[0]).toEqual(MOCK_CAUSE_1)
    expect(causes[1]).toEqual(MOCK_CAUSE_3)
    expect(causes[2]).toBe(undefined)
  })

  it('includes hidden causes for internal users', async () => {
    expect.assertions(3)
    const mockUserContext = getMockUserContext()
    mockUserContext.email = 'test@tabforacause.org'
    const getCauses = require('../getCauses').default
    const causes = await getCauses(mockUserContext, {
      isAvailableToSelect: true,
    })
    // Get only permanent partner charities.
    expect(causes[0]).toEqual(MOCK_CAUSE_1)
    expect(causes[1]).toEqual(MOCK_CAUSE_2)
    expect(causes[2]).toBe(MOCK_CAUSE_3)
  })
})
