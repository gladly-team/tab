/* eslint-env jest */

import UserModel from '../users/UserModel'

import {
  getMockUserContext,
  getMockUserInfo,
  getMockUserInstance,
  mockDate
} from '../test-utils'

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

describe('test-utils', () => {
  test('getMockUserContext returns expected object', () => {
    expect(getMockUserContext()).toEqual({
      id: 'abcdefghijklmno',
      username: 'MyName',
      email: 'foo@bar.com',
      emailVerified: true
    })
  })

  test('getMockUserInfo returns expected object', () => {
    expect(getMockUserInfo()).toEqual({
      id: 'abcdefghijklmno',
      username: 'MyName',
      email: 'foo@bar.com'
    })
  })

  test('getMockUserInstance returns expected object', () => {
    const expectedUser = new UserModel(getMockUserInfo())
    expectedUser.created = mockDate.defaultDateISO
    expectedUser.updated = mockDate.defaultDateISO
    expectedUser.joined = mockDate.defaultDateISO
    expect(getMockUserInstance()).toEqual(expectedUser)
  })

  test('getMockUserInstance allows customized attributes', () => {
    const expectedUser = new UserModel(getMockUserInfo())
    expectedUser.username = 'Bob'
    expectedUser.heartsUntilNextLevel = 12
    expectedUser.created = mockDate.defaultDateISO
    expectedUser.updated = mockDate.defaultDateISO
    expectedUser.joined = mockDate.defaultDateISO
    expect(getMockUserInstance({ username: 'Bob', heartsUntilNextLevel: 12 }))
      .toEqual(expectedUser)
  })
})
