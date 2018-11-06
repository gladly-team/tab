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
    const excludeLastTenSeconds = excludeUsersWhoJoinedRecently(10, 'seconds')
    const mockUserInfo = getMockUserInfo()
    mockUserInfo.joined = '2017-05-19T13:59:56.000Z' // 2 seconds ago
    expect(excludeLastTenSeconds(mockUserInfo)).toBe(false)
    mockUserInfo.joined = '2017-05-19T13:59:46.000Z' // 12 seconds ago
    expect(excludeLastTenSeconds(mockUserInfo)).toBe(true)
  })

  test('onlyIncludeNewUsers works as expected', () => {
    const { onlyIncludeNewUsers } = require('js/utils/experimentFilters')
    const mockUserInfo = getMockUserInfo()
    mockUserInfo.isNewUser = true
    expect(onlyIncludeNewUsers(mockUserInfo)).toBe(true)
    mockUserInfo.isNewUser = false
    expect(onlyIncludeNewUsers(mockUserInfo)).toBe(false)
  })

  test('includeIfAnyIsTrue works as expected', () => {
    const { includeIfAnyIsTrue } = require('js/utils/experimentFilters')
    const filtersWithNoneTrue = [
      () => false,
      () => false,
      () => false
    ]
    const filtersWithOneTrue = [
      () => false,
      () => true,
      () => false
    ]
    const filtersWithAllTrue = [
      () => true,
      () => true,
      () => true
    ]
    const mockUserInfo = getMockUserInfo()
    expect(includeIfAnyIsTrue(filtersWithNoneTrue)(mockUserInfo)).toBe(false)
    expect(includeIfAnyIsTrue(filtersWithOneTrue)(mockUserInfo)).toBe(true)
    expect(includeIfAnyIsTrue(filtersWithAllTrue)(mockUserInfo)).toBe(true)
  })

  test('includeIfAnyIsTrue works as expected with user info', () => {
    const {
      includeIfAnyIsTrue,
      excludeUsersWhoJoinedRecently,
      onlyIncludeNewUsers
    } = require('js/utils/experimentFilters')
    const excludeLastTenDays = excludeUsersWhoJoinedRecently(10, 'days')
    const onlyNewUsersOrUsersWhoJoinedTenDaysAgo = [
      excludeLastTenDays,
      onlyIncludeNewUsers
    ]
    const mockUserInfo = getMockUserInfo()

    mockUserInfo.joined = '2017-05-11T13:59:58.000Z' // ~8 days ago
    mockUserInfo.isNewUser = false
    expect(
      includeIfAnyIsTrue(onlyNewUsersOrUsersWhoJoinedTenDaysAgo)(mockUserInfo))
      .toBe(false)

    mockUserInfo.joined = '2017-05-07T13:59:58.000Z' // ~12 days ago
    mockUserInfo.isNewUser = false
    expect(
      includeIfAnyIsTrue(onlyNewUsersOrUsersWhoJoinedTenDaysAgo)(mockUserInfo))
      .toBe(true)

    mockUserInfo.joined = '2017-05-19T13:59:58.000Z' // just now
    mockUserInfo.isNewUser = true
    expect(
      includeIfAnyIsTrue(onlyNewUsersOrUsersWhoJoinedTenDaysAgo)(mockUserInfo))
      .toBe(true)
  })
})
