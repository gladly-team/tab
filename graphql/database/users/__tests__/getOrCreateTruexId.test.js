/* eslint-env jest */

import { nanoid } from 'nanoid'
import { getMockUserContext, getMockUserInstance } from '../../test-utils'

import UserModel from '../UserModel'

afterEach(() => {
  jest.clearAllMocks()
})

describe('getOrCreateTruexId', () => {
  it('returns the existing user.truexId property by default', async () => {
    expect.assertions(2)
    const getOrCreateTruexId = require('../getOrCreateTruexId').default
    const updateSpy = jest.spyOn(UserModel, 'update')
    const userContext = getMockUserContext()
    const mockTruexId = nanoid()
    const mockUser = {
      ...getMockUserInstance(),
      truexId: mockTruexId,
    }
    const response = await getOrCreateTruexId(userContext, mockUser)
    expect(response).toEqual(mockTruexId)
    expect(updateSpy).not.toHaveBeenCalled()
  })

  it('creates a truexID and returns the newly created truexId', async () => {
    expect.assertions(2)
    const getOrCreateTruexId = require('../getOrCreateTruexId').default
    const updateSpy = jest.spyOn(UserModel, 'update')
    const userContext = getMockUserContext()
    const mockUser = {
      ...getMockUserInstance(),
    }
    const response = await getOrCreateTruexId(userContext, mockUser)
    expect(updateSpy).toHaveBeenCalled()
    expect(updateSpy.mock.calls[0][1].truexId).toEqual(response)
  })
})
