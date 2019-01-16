/* eslint-env jest */

import moment from 'moment'

import ExampleModel, { fixturesA } from '../test-utils/ExampleModel'
import ExampleModelRangeKey, {
  fixturesRangeKeyA,
} from '../test-utils/ExampleModelRangeKey'
import {
  addTimestampFieldsToItem,
  DatabaseOperation,
  getMockUserContext,
  mockDate,
  setMockDBResponse,
  setModelPermissions,
} from '../../test-utils'
import {
  DatabaseItemDoesNotExistException,
  UnauthorizedQueryException,
} from '../../../utils/exceptions'

jest.mock('../../databaseClient')

const user = getMockUserContext()

function removeCreatedAndUpdatedFields(item) {
  const newItem = Object.assign({}, item)
  delete newItem.created
  delete newItem.updated
  return newItem
}

beforeAll(() => {
  mockDate.on()
})

afterAll(() => {
  mockDate.off()
})

afterEach(() => {
  jest.resetAllMocks()

  // For some reason, jest.resetModules is failing with
  // ExampleModel (even when using CommonJS requires), so just
  // reset permissions manually.
  setModelPermissions(ExampleModel, {
    get: () => false,
    getAll: () => false,
    update: () => false,
    create: () => false,
  })
})

describe('BaseModel queries', () => {
  it('correctly fetches with `getAll` method', async () => {
    setModelPermissions(ExampleModel, {
      getAll: () => true,
    })

    // Set mock response from DB client.
    const dbQueryMock = setMockDBResponse(DatabaseOperation.GET_ALL, {
      Items: fixturesA,
    })
    const expectedDBParams = {
      TableName: ExampleModel.tableName,
    }
    const response = await ExampleModel.getAll(user)
    expect(dbQueryMock.mock.calls[0][0]).toEqual(expectedDBParams)
    expect(response.length).toBe(fixturesA.length)
    Object.values(response).forEach(index => {
      expect(response[index]).toEqual(fixturesA[index])
    })
  })

  it('fails with unauthorized `getAll`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleModel, {
      getAll: () => false,
    })
    return expect(ExampleModel.getAll(user)).rejects.toEqual(
      new UnauthorizedQueryException()
    )
  })

  it('correctly fetches with `get` method for a model with no range key', async () => {
    setModelPermissions(ExampleModel, {
      get: () => true,
    })

    // Set mock response from DB client.
    const itemToGet = Object.assign({}, fixturesA[0])
    const dbQueryMock = setMockDBResponse(DatabaseOperation.GET, {
      Item: itemToGet,
    })
    const expectedDBParams = {
      TableName: ExampleModel.tableName,
      Key: {
        id: itemToGet.id,
      },
    }
    const response = await ExampleModel.get(user, itemToGet.id)
    expect(dbQueryMock.mock.calls[0][0]).toEqual(expectedDBParams)
    expect(response).toEqual(itemToGet)
  })

  it('throws an error when a `get` returns no item', async () => {
    setModelPermissions(ExampleModel, {
      get: () => true,
    })

    // Set mock response from DB client.
    const itemToGet = Object.assign({}, fixturesA[0])
    setMockDBResponse(DatabaseOperation.GET, {
      Item: null,
    })

    return expect(ExampleModel.get(user, itemToGet.id)).rejects.toEqual(
      new DatabaseItemDoesNotExistException()
    )
  })

  it('correctly uses `get` method for a model with a range key', async () => {
    setModelPermissions(ExampleModelRangeKey, {
      get: () => true,
    })

    // Set mock response from DB client.
    const itemToGet = Object.assign({}, fixturesRangeKeyA[0])
    const dbQueryMock = setMockDBResponse(DatabaseOperation.GET, {
      Item: itemToGet,
    })
    const expectedDBParams = {
      TableName: ExampleModelRangeKey.tableName,
      Key: {
        id: itemToGet.id,
        age: itemToGet.age,
      },
    }
    const response = await ExampleModelRangeKey.get(
      user,
      itemToGet.id,
      itemToGet.age
    )
    expect(dbQueryMock.mock.calls[0][0]).toEqual(expectedDBParams)
    expect(response).toEqual(itemToGet)
  })

  it('fails with unauthorized `get`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleModel, {
      get: () => false,
    })
    const itemToGet = Object.assign({}, fixturesA[0])
    return expect(ExampleModel.get(user, itemToGet.id)).rejects.toEqual(
      new UnauthorizedQueryException()
    )
  })

  it('correctly fetches with `getBatch` method', async () => {
    setModelPermissions(ExampleModel, {
      get: () => true,
    })
    const itemsToGet = [fixturesA[0], fixturesA[1]]
    const keys = [itemsToGet[0].id, itemsToGet[1].id]

    // Set mock response from DB client.
    const dbQueryMock = setMockDBResponse(DatabaseOperation.GET_BATCH, {
      Responses: {
        [ExampleModel.tableName]: itemsToGet,
      },
    })
    const expectedDBParams = {
      RequestItems: {
        [ExampleModel.tableName]: {
          Keys: [
            {
              id: itemsToGet[0].id,
            },
            {
              id: itemsToGet[1].id,
            },
          ],
        },
      },
    }
    const response = await ExampleModel.getBatch(user, keys)
    expect(dbQueryMock.mock.calls[0][0]).toEqual(expectedDBParams)
    expect(response).toEqual(itemsToGet)
  })

  it('correctly fetches with `getBatch` method with range keys', async () => {
    setModelPermissions(ExampleModelRangeKey, {
      get: () => true,
    })
    const itemsToGet = [fixturesRangeKeyA[0], fixturesRangeKeyA[1]]
    const keys = [
      {
        id: fixturesRangeKeyA[0].id,
        age: fixturesRangeKeyA[0].age,
      },
      {
        id: fixturesRangeKeyA[1].id,
        age: fixturesRangeKeyA[1].age,
      },
    ]

    // Set mock response from DB client.
    const dbQueryMock = setMockDBResponse(DatabaseOperation.GET_BATCH, {
      Responses: {
        [ExampleModelRangeKey.tableName]: itemsToGet,
      },
    })
    const expectedDBParams = {
      RequestItems: {
        [ExampleModelRangeKey.tableName]: {
          Keys: keys,
        },
      },
    }
    const response = await ExampleModelRangeKey.getBatch(user, keys)
    expect(dbQueryMock.mock.calls[0][0]).toEqual(expectedDBParams)
    expect(response).toEqual(itemsToGet)
  })

  it('fails with unauthorized `getBatch`', async () => {
    expect.assertions(1)
    const itemsToGet = [fixturesA[0], fixturesA[1]]
    setModelPermissions(ExampleModel, {
      get: () => false,
    })
    return expect(
      ExampleModel.getBatch(user, [itemsToGet[0].id, itemsToGet[1].id])
    ).rejects.toEqual(new UnauthorizedQueryException())
  })

  it('correctly creates item', async () => {
    setModelPermissions(ExampleModel, {
      create: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])
    const dbQueryMock = setMockDBResponse(DatabaseOperation.CREATE, {
      // https://docs.aws.amazon.com/cli/latest/reference/dynamodb/put-item.html#output
      Attributes: {},
    })

    // 'created' and 'updated' field should be automatically added.
    const itemToCreate = removeCreatedAndUpdatedFields(item)
    const createdItem = await ExampleModel.create(user, itemToCreate)

    // Verify DB params.
    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams).toEqual({
      Item: {
        created: moment.utc().toISOString(),
        id: item.id,
        name: item.name,
        updated: moment.utc().toISOString(),
      },
      TableName: ExampleModel.tableName,
      ConditionExpression: '(#id <> :id)',
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':id': item.id,
      },
    })

    // Verify returned object.
    const expectedReturn = addTimestampFieldsToItem(item)
    expect(createdItem).toEqual(expectedReturn)
  })

  it('correctly creates item with default fields', async () => {
    setModelPermissions(ExampleModel, {
      create: () => true,
    })

    // Set mock response from DB client.
    const itemToCreate = {}
    const dbQueryMock = setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: {},
    })
    const createdItem = await ExampleModel.create(user, itemToCreate)

    // Verify DB params.
    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams).toEqual({
      Item: {
        created: moment.utc().toISOString(),
        id: createdItem.id, // non-deterministic
        name: ExampleModel.fieldDefaults.name,
        updated: moment.utc().toISOString(),
      },
      TableName: ExampleModel.tableName,
      ConditionExpression: '(#id <> :id)',
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':id': createdItem.id,
      },
    })

    // Verify returned object.
    expect(createdItem).toEqual({
      created: moment.utc().toISOString(),
      id: createdItem.id, // non-deterministic
      name: ExampleModel.fieldDefaults.name,
      updated: moment.utc().toISOString(),
    })
  })

  it('fails with unauthorized `create`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleModel, {
      create: () => false,
    })
    const itemToCreate = Object.assign({}, fixturesA[0])
    return expect(ExampleModel.create(user, itemToCreate)).rejects.toEqual(
      new UnauthorizedQueryException()
    )
  })

  it('correctly updates item', async () => {
    setModelPermissions(ExampleModel, {
      update: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])
    const expectedReturn = Object.assign({}, item, {
      updated: moment.utc().toISOString(),
    })
    const dbQueryMock = setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedReturn,
    })

    // 'updated' field should be automatically updated.
    const itemToUpdate = removeCreatedAndUpdatedFields(item)
    const updatedItem = await ExampleModel.update(user, itemToUpdate)

    // Verify DB params.
    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams).toEqual({
      TableName: ExampleModel.tableName,
      Key: {
        id: item.id,
      },
      ReturnValues: 'ALL_NEW',
      ExpressionAttributeValues: {
        ':name': item.name,
        ':updated': moment.utc().toISOString(),
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#updated': 'updated',
      },
      UpdateExpression: 'SET #name = :name, #updated = :updated',
      ConditionExpression: 'attribute_exists(id)',
    })

    // Verify returned object.
    expect(updatedItem).toEqual(expectedReturn)
  })

  it('correctly updates item with a range key', async () => {
    setModelPermissions(ExampleModelRangeKey, {
      update: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesRangeKeyA[0])
    const expectedReturn = Object.assign({}, item, {
      updated: moment.utc().toISOString(),
    })
    const dbQueryMock = setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedReturn,
    })

    const itemToUpdate = removeCreatedAndUpdatedFields(item)
    const updatedItem = await ExampleModelRangeKey.update(user, itemToUpdate)

    // Verify  DB params.
    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams).toEqual({
      ExpressionAttributeNames: {
        '#name': 'name',
        '#updated': 'updated',
      },
      ExpressionAttributeValues: {
        ':name': item.name,
        ':updated': moment.utc().toISOString(),
      },
      Key: {
        age: item.age,
        id: item.id,
      },
      ReturnValues: 'ALL_NEW',
      TableName: ExampleModelRangeKey.tableName,
      UpdateExpression: 'SET #name = :name, #updated = :updated',
      ConditionExpression: 'attribute_exists(id)',
    })

    // Verify returned object.
    expect(updatedItem).toEqual(expectedReturn)
  })

  it('passes additional `update` params to the client', async () => {
    setModelPermissions(ExampleModel, {
      update: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])
    const expectedReturn = Object.assign({}, item, {
      updated: moment.utc().toISOString(),
    })
    const dbQueryMock = setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedReturn,
    })

    // 'updated' field should be automatically updated.
    const itemToUpdate = removeCreatedAndUpdatedFields(item)

    // Pass additional params (a conditional update expresssion)
    const params = {}
    params.ConditionExpression = '#name = :newName'
    params.ExpressionAttributeNames = { '#name': 'name' }
    params.ExpressionAttributeValues = { ':newName': 'Bobert' }
    const updatedItem = await ExampleModel.update(user, itemToUpdate, params)

    // Verify DB params.
    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams).toEqual({
      TableName: ExampleModel.tableName,
      Key: {
        id: item.id,
      },
      ReturnValues: 'ALL_NEW',
      ConditionExpression: '#name = :newName AND attribute_exists(id)',
      ExpressionAttributeValues: {
        ':name': item.name,
        ':newName': 'Bobert',
        ':updated': moment.utc().toISOString(),
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#updated': 'updated',
      },
      UpdateExpression: 'SET #name = :name, #updated = :updated',
    })

    // Verify returned object.
    expect(updatedItem).toEqual(expectedReturn)
  })

  it('uses an attribute_exists condition expression during update to require that an item exists before it is updated', async () => {
    setModelPermissions(ExampleModel, {
      update: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])
    const expectedReturn = Object.assign({}, item, {
      updated: moment.utc().toISOString(),
    })
    const dbQueryMock = setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedReturn,
    })

    // 'updated' field should be automatically updated.
    const itemToUpdate = removeCreatedAndUpdatedFields(item)
    await ExampleModel.update(user, itemToUpdate)

    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams.ConditionExpression).toEqual('attribute_exists(id)')
  })

  it('joins an attribute_exists condition expresssion with existing condition expressions during update to require that an item exists before it is updated', async () => {
    setModelPermissions(ExampleModel, {
      update: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])
    const expectedReturn = Object.assign({}, item, {
      updated: moment.utc().toISOString(),
    })
    const dbQueryMock = setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedReturn,
    })

    // 'updated' field should be automatically updated.
    const itemToUpdate = removeCreatedAndUpdatedFields(item)

    // Pass additional params (a conditional update expresssion)
    const params = {}
    params.ConditionExpression = '#name = :newName' //
    params.ExpressionAttributeNames = { '#name': 'name' }
    params.ExpressionAttributeValues = { ':newName': 'Bobert' }
    await ExampleModel.update(user, itemToUpdate, params)

    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams.ConditionExpression).toEqual(
      '#name = :newName AND attribute_exists(id)'
    )
  })

  it('fails with unauthorized `update`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleModel, {
      update: () => false,
    })
    const itemToUpdate = Object.assign({}, fixturesA[0])
    return expect(ExampleModel.update(user, itemToUpdate)).rejects.toEqual(
      new UnauthorizedQueryException()
    )
  })

  it('correctly uses `query` method', async () => {
    setModelPermissions(ExampleModelRangeKey, {
      get: () => true,
    })

    // Set mock response from DB client.
    const itemsToGet = [fixturesRangeKeyA[0]]
    const dbQueryMock = setMockDBResponse(DatabaseOperation.QUERY, {
      Items: itemsToGet,
    })
    const response = await ExampleModelRangeKey.query(
      user,
      itemsToGet[0].id
    ).execute()

    // Verify DB params.
    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams).toEqual({
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':id': itemsToGet[0].id,
      },
      KeyConditionExpression: '(#id = :id)',
      TableName: ExampleModelRangeKey.tableName,
    })

    // Verify response.
    expect(response).toEqual(itemsToGet)
  })

  it('correctly uses `query` method with filters', async () => {
    setModelPermissions(ExampleModelRangeKey, {
      get: () => true,
    })

    // Set mock response from DB client.
    const itemsToGet = [fixturesRangeKeyA[0]]
    const dbQueryMock = setMockDBResponse(DatabaseOperation.QUERY, {
      Items: itemsToGet,
    })
    const response = await ExampleModelRangeKey.query(user, itemsToGet[0].id)
      .where('age')
      .gt(30)
      .execute()

    // Verify DB params.
    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams).toEqual({
      ExpressionAttributeNames: {
        '#age': 'age',
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':age': 30,
        ':id': itemsToGet[0].id,
      },
      KeyConditionExpression: '(#age > :age) AND (#id = :id)',
      TableName: ExampleModelRangeKey.tableName,
    })

    // Verify response.
    expect(response).toEqual(itemsToGet)
  })

  it('fails with unauthorized `query`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleModelRangeKey, {
      get: () => false,
    })
    const itemsToGet = fixturesRangeKeyA
    return expect(
      ExampleModelRangeKey.query(user, itemsToGet[0].id).execute()
    ).rejects.toEqual(new UnauthorizedQueryException())
  })

  it('correctly calls `create` from `getOrCreate` method', async () => {
    setModelPermissions(ExampleModel, {
      create: () => true,
      get: () => true,
    })

    const itemToGetOrCreate = removeCreatedAndUpdatedFields(fixturesA[1])

    const dbCreateQueryMock = setMockDBResponse(DatabaseOperation.CREATE, {
      Attributes: {},
    })
    const response = await ExampleModel.getOrCreate(user, itemToGetOrCreate)
    const createdItem = response.item

    // Verify DB params.
    const dbParams = dbCreateQueryMock.mock.calls[0][0]
    expect(dbParams).toEqual({
      ConditionExpression: '(#id <> :id)',
      ExpressionAttributeNames: { '#id': 'id' },
      ExpressionAttributeValues: {
        ':id': createdItem.id,
      },
      Item: {
        created: moment.utc().toISOString(),
        id: createdItem.id, // non-deterministic
        name: itemToGetOrCreate.name,
        updated: moment.utc().toISOString(),
      },
      TableName: ExampleModel.tableName,
    })

    // Verify returned object.
    expect(createdItem).toEqual({
      created: moment.utc().toISOString(),
      id: createdItem.id, // non-deterministic
      name: itemToGetOrCreate.name,
      updated: moment.utc().toISOString(),
    })

    expect(response.created).toBe(true)
  })

  it('fails with unauthorized `create` in `getOrCreate`', async () => {
    expect.assertions(1)
    const itemToGetOrCreate = fixturesA[1]
    setModelPermissions(ExampleModel, {
      create: () => false,
      get: () => true,
    })
    return expect(
      ExampleModel.getOrCreate(user, itemToGetOrCreate)
    ).rejects.toEqual(new UnauthorizedQueryException())
  })

  it('correctly calls `get` from `getOrCreate` method', async () => {
    setModelPermissions(ExampleModel, {
      create: () => true,
      get: () => true,
    })

    const itemToGetOrCreate = removeCreatedAndUpdatedFields(fixturesA[1])

    // Mock that the item already exists.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      { code: 'ConditionalCheckFailedException' } // simple mock error
    )
    const dbGetQueryMock = setMockDBResponse(DatabaseOperation.GET, {
      Item: itemToGetOrCreate,
    })
    const response = await ExampleModel.getOrCreate(user, itemToGetOrCreate)
    const createdItem = response.item

    // Verify DB params.
    const dbParams = dbGetQueryMock.mock.calls[0][0]
    expect(dbParams).toEqual({
      TableName: ExampleModel.tableName,
      Key: {
        id: itemToGetOrCreate.id,
      },
    })

    // Verify returned object.
    expect(createdItem).toEqual({
      created: moment.utc().toISOString(),
      id: createdItem.id, // non-deterministic
      name: itemToGetOrCreate.name,
      updated: moment.utc().toISOString(),
    })

    expect(response.created).toBe(false)
  })

  it('fails with unauthorized `get` in `getOrCreate`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleModel, {
      create: () => true,
      get: () => false,
    })

    const itemToGetOrCreate = fixturesA[1]

    // Mock that the item already exists.
    setMockDBResponse(
      DatabaseOperation.CREATE,
      null,
      { code: 'ConditionalCheckFailedException' } // simple mock error
    )
    return expect(
      ExampleModel.getOrCreate(user, itemToGetOrCreate)
    ).rejects.toEqual(new UnauthorizedQueryException())
  })

  it('allows overriding the "created" and "updated" timestamp fields during item creation', async () => {
    setModelPermissions(ExampleModel, {
      create: () => true,
    })

    // Set mock response from DB client.
    const dbQueryMock = setMockDBResponse(DatabaseOperation.CREATE, {
      // https://docs.aws.amazon.com/cli/latest/reference/dynamodb/put-item.html#output
      Attributes: {},
    })

    const item = Object.assign({}, fixturesA[0])
    const itemToCreate = removeCreatedAndUpdatedFields(item)

    // Add our overridden "created" and "updated" timestamps.
    itemToCreate.created = '2017-12-24T07:00:00.001Z'
    itemToCreate.updated = '2017-12-25T07:15:02.025Z'
    await ExampleModel.create(user, itemToCreate)

    // Verify DB params.
    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams).toEqual({
      Item: {
        created: '2017-12-24T07:00:00.001Z',
        id: item.id,
        name: item.name,
        updated: '2017-12-25T07:15:02.025Z',
      },
      TableName: ExampleModel.tableName,
      ConditionExpression: '(#id <> :id)',
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':id': item.id,
      },
    })
  })

  it('allows overriding the "updated" timestamp field during item updating', async () => {
    setModelPermissions(ExampleModel, {
      update: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])
    const expectedReturn = Object.assign({}, item, {
      updated: moment.utc().toISOString(),
    })
    const dbQueryMock = setMockDBResponse(DatabaseOperation.UPDATE, {
      Attributes: expectedReturn,
    })

    // Add our overridden updated" timestamp.
    const itemToUpdate = removeCreatedAndUpdatedFields(item)
    itemToUpdate.updated = '2017-12-25T07:15:02.025Z'

    await ExampleModel.update(user, itemToUpdate)

    // Verify DB params.
    const dbParams = dbQueryMock.mock.calls[0][0]
    expect(dbParams).toEqual({
      TableName: ExampleModel.tableName,
      Key: {
        id: item.id,
      },
      ReturnValues: 'ALL_NEW',
      ExpressionAttributeValues: {
        ':name': item.name,
        ':updated': '2017-12-25T07:15:02.025Z',
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#updated': 'updated',
      },
      UpdateExpression: 'SET #name = :name, #updated = :updated',
      ConditionExpression: 'attribute_exists(id)',
    })
  })
})
