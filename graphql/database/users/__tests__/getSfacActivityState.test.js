/* eslint-env jest */
import moment from 'moment'
import {
  getMockUserContext,
  getMockUserInstance,
  mockDate,
} from '../../test-utils'
import getSfacActivityState from '../getSfacActivityState'

const mockCurrentTime = '2017-06-22T01:13:28.000Z'
const userContext = getMockUserContext()

beforeAll(() => {
  mockDate.on(mockCurrentTime, {
    mockCurrentTimeOnly: true,
  })
})

afterAll(() => {
  mockDate.off()
})

describe('getSfacActivityState tests', () => {
  it('returns new if the user has no searches', async () => {
    const user = getMockUserInstance()
    const result = await getSfacActivityState(userContext, user)
    expect(result).toEqual('new')
  })

  it('returns new if no maxSearchesDay object', async () => {
    const user = getMockUserInstance()
    user.searches = 5
    delete user.maxSearchesDay
    const result = await getSfacActivityState(userContext, user)
    expect(result).toEqual('new')
  })

  it('active if last search is within the last 3 weeks', async () => {
    const user = getMockUserInstance()
    const date = moment.utc().subtract(5, 'days')
    user.searches = 5
    user.maxSearchesDay.recentDay.date = date.toISOString()
    const result = await getSfacActivityState(userContext, user)

    expect(result).toEqual('active')
  })

  it('inactive if last search is older than 3 weeks ago', async () => {
    const user = getMockUserInstance()
    const date = moment.utc().subtract(25, 'days')
    user.searches = 5
    user.maxSearchesDay.recentDay.date = date.toISOString()
    const result = await getSfacActivityState(userContext, user)

    expect(result).toEqual('inactive')
  })
})
