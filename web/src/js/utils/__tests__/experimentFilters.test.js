/* eslint-env jest */
import moment from 'moment'
import MockDate from 'mockdate'

const getMockUserInfo = () => ({
  joined: '2017-05-19T13:59:58.000Z',
  isNewUser: true
})

const mockNow = '2017-05-19T13:59:58.000Z'

beforeEach(() => {
  MockDate.set(moment(mockNow))
})

afterEach(() => {
  MockDate.reset()
})

/* Tests for the Experiment and ExperimentGroup objects */
describe('experiment filter', () => {
  test('excludeUsersWhoJoinedRecently works as expected with the default "days" unit', () => {
    const { excludeUsersWhoJoinedRecently } = require('js/utils/experimentFilters')
    const excludeLastThirtyDays = excludeUsersWhoJoinedRecently(30)
    const mockUserInfo = getMockUserInfo()
    mockUserInfo.joined = '2017-05-17T13:59:58.000Z' // ~2 days ago
    expect(excludeLastThirtyDays(mockUserInfo)).toBe(false)
    mockUserInfo.joined = '2017-03-19T13:59:58.000Z' // ~60 days ago
    expect(excludeLastThirtyDays(mockUserInfo)).toBe(true)
  })

  test('excludeUsersWhoJoinedRecently works as expected with "seconds" unit', () => {
    const { excludeUsersWhoJoinedRecently } = require('js/utils/experimentFilters')
    const excludeLastThirtyDays = excludeUsersWhoJoinedRecently(10, 'seconds')
    const mockUserInfo = getMockUserInfo()
    mockUserInfo.joined = '2017-05-19T13:59:56.000Z' // 2 seconds ago
    expect(excludeLastThirtyDays(mockUserInfo)).toBe(false)
    mockUserInfo.joined = '2017-05-19T13:59:46.000Z' // 12 seconds days ago
    expect(excludeLastThirtyDays(mockUserInfo)).toBe(true)
  })
})
