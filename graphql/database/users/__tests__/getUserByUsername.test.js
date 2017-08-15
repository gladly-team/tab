/* eslint-env jest */

import UserModel from '../UserModel'
import getUserByUsername from '../getUserByUsername'
import {
  DatabaseOperation,
  getMockUserContext,
  getMockUserInstance,
  setMockDBResponse
} from '../../test-utils'

jest.mock('../../databaseClient')

const userContext = getMockUserContext()

afterEach(() => {
  jest.clearAllMocks()
})

describe('getUserByUsername', () => {
  it('works as expected', async () => {
    const username = 'jonsnow'
    const userContextAuthorized = Object.assign({}, userContext, {
      username: username
    })
    const query = jest.spyOn(UserModel, 'query')
    const queryExec = jest.spyOn(UserModel, '_execAsync')
    await getUserByUsername(userContextAuthorized, username)
    expect(query)
      .toHaveBeenCalledWith(userContextAuthorized, username)
    expect(queryExec).toHaveBeenCalled()
  })

  it('calls the database', async () => {
    const username = 'jonsnow'
    const userContextAuthorized = Object.assign({}, userContext, {
      username: username
    })

    const itemToReturn = getMockUserInstance({
      id: userContextAuthorized.id,
      username: userContextAuthorized.username,
      email: userContextAuthorized.email
    })
    const dbQueryMock = setMockDBResponse(
      DatabaseOperation.QUERY,
      {
        Items: [
          itemToReturn
        ]
      }
    )
    const fetchedUser = await getUserByUsername(
      userContextAuthorized, username)
    expect(dbQueryMock.mock.calls[0][0]).toEqual({
      ExpressionAttributeNames: {
        '#username': 'username'
      },
      ExpressionAttributeValues: {
        ':username': 'jonsnow'
      },
      IndexName: 'UsersByUsername',
      KeyConditionExpression: '(#username = :username)',
      TableName: UserModel.tableName
    })
    expect(fetchedUser).toEqual(itemToReturn)
  })
})
