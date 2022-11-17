/* eslint-env jest */
import uuid from 'uuid/v4'
import {
  getMockUserContext,
  getMockUserInstance,
  getMockUserInfo,
  mockDate,
  DatabaseOperation,
  setMockDBResponse,
} from '../../test-utils'
import { UnauthorizedQueryException } from '../../../utils/exceptions'
import { SFAC_EXTENSION_PROMPT } from '../../logs/logTypes'

jest.mock('../../databaseClient')
jest.mock('uuid/v4')
beforeEach(() => {
  setMockDBResponse(DatabaseOperation.UPDATE, {
    // Like original user but with modified email.
    Attributes: getMockUserInstance(),
  })
})

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})
const userContext = getMockUserContext()
const user = getMockUserInfo()
describe('createSfacExtensionPromptResponse tests', () => {
  it('updates User model and creates UserEventLogModel', async () => {
    const uuidVal = 'ab5082cc-151a-4a9a-9289-06906670fd42'
    uuid.mockReturnValueOnce(uuidVal)
    expect.assertions(3)
    const createSfacExtensionPromptResponse =
      require('../createSfacExtensionPromptResponse').default
    const UserEventLogModel = require('../../logs/UserEventLogModel').default
    const UserModel = require('../UserModel').default
    const createQuery = jest.spyOn(UserEventLogModel, 'create')
    const userUpdateQuery = jest.spyOn(UserModel, 'update')
    const result = await createSfacExtensionPromptResponse(
      userContext,
      user.id,
      'chrome',
      true
    )
    expect(result).toEqual(getMockUserInstance())
    expect(createQuery).toHaveBeenCalledWith(userContext, {
      id: uuidVal,
      userId: userContext.id,
      type: SFAC_EXTENSION_PROMPT,
      eventData: {
        accepted: true,
        browser: 'chrome',
      },
      timestamp: '2017-05-19T13:59:46.000Z',
      created: '2017-05-19T13:59:46.000Z',
      updated: '2017-05-19T13:59:46.000Z',
    })
    expect(userUpdateQuery).toHaveBeenCalledWith(userContext, {
      id: userContext.id,
      sfacPrompt: {
        hasRespondedToPrompt: true,
        timestamp: '2017-05-19T13:59:46.000Z',
      },
      updated: '2017-05-19T13:59:46.000Z',
    })
  })

  it('does not allow invalid browser', async () => {
    const uuidVal = 'ab5082cc-151a-4a9a-9289-06906670fd42'
    uuid.mockReturnValueOnce(uuidVal)
    expect.assertions(1)
    const createSfacExtensionPromptResponse =
      require('../createSfacExtensionPromptResponse').default
    await expect(
      createSfacExtensionPromptResponse(
        userContext,
        user.id,
        'fake-browser',
        true
      )
    ).rejects.toThrow()
  })

  it('throws if user id does not match user context', async () => {
    expect.assertions(1)
    const createSfacExtensionPromptResponse =
      require('../createSfacExtensionPromptResponse').default
    await expect(
      createSfacExtensionPromptResponse(userContext, 'wrong-id', 'chrome', true)
    ).rejects.toThrow(new UnauthorizedQueryException())
  })
})
