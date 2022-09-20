/* eslint-env jest */

import moment from 'moment'
import Redis from 'ioredis'
import ExampleRedisModel, { fixturesA } from '../test-utils/ExampleRedisModel'
import {
  addTimestampFieldsToItem,
  getMockUserContext,
  mockDate,
  setModelPermissions,
} from '../../test-utils'
import {
  DatabaseItemDoesNotExistException,
  FieldDoesNotExistException,
  NotImplementedException,
  UnauthorizedQueryException,
} from '../../../utils/exceptions'

jest.mock('ioredis', () => jest.requireActual('ioredis-mock'))

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
  jest.clearAllMocks()
  const client = new Redis(process.env.UPSTASH_HOST)
  client.flushall()

  setModelPermissions(ExampleRedisModel, {
    get: () => false,
    getAll: () => false,
    update: () => false,
    create: () => false,
  })
})

describe('RedisModel queries', () => {
  it('RedisModel does not implement getAll', async () => {
    setModelPermissions(ExampleRedisModel, {
      getAll: () => true,
    })

    expect(ExampleRedisModel.getAll(user)).rejects.toEqual(
      new NotImplementedException()
    )
  })

  it('correctly fetches with `get` method', async () => {
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
      get: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])

    // 'created' and 'updated' field should be automatically added.
    const itemToCreate = removeCreatedAndUpdatedFields(item)
    const createdItem = await ExampleRedisModel.create(user, itemToCreate)
    const response = await ExampleRedisModel.get(user, item.id)
    expect(response).toEqual(createdItem)
  })

  it('throws an error when a `get` returns no item', async () => {
    setModelPermissions(ExampleRedisModel, {
      get: () => true,
    })

    return expect(ExampleRedisModel.get(user, fixturesA[0].id)).rejects.toEqual(
      new DatabaseItemDoesNotExistException()
    )
  })

  it('fails with unauthorized `get`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      get: () => false,
    })
    const itemToGet = Object.assign({}, fixturesA[0])
    return expect(ExampleRedisModel.get(user, itemToGet.id)).rejects.toEqual(
      new UnauthorizedQueryException()
    )
  })

  it('correctly fetches with `getBatch` method', async () => {
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
      get: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])
    const item2 = Object.assign({}, fixturesA[1])

    // 'created' and 'updated' field should be automatically added.
    const itemToCreate = removeCreatedAndUpdatedFields(item)
    const itemToCreate2 = removeCreatedAndUpdatedFields(item2)
    const createdItem = await ExampleRedisModel.create(user, itemToCreate)
    const createdItem2 = await ExampleRedisModel.create(user, itemToCreate2)

    // Verify returned object.
    const expectedReturn = addTimestampFieldsToItem(item)
    expect(createdItem).toEqual(expectedReturn)

    const itemsToGet = [createdItem, createdItem2]
    const keys = [itemsToGet[0].id, itemsToGet[1].id]

    const response = await ExampleRedisModel.getBatch(user, keys)
    expect(response).toEqual(itemsToGet)
  })

  it('fails with unauthorized `getBatch`', async () => {
    expect.assertions(1)
    const itemsToGet = [fixturesA[0], fixturesA[1]]
    setModelPermissions(ExampleRedisModel, {
      get: () => false,
    })
    return expect(
      ExampleRedisModel.getBatch(user, [itemsToGet[0].id, itemsToGet[1].id])
    ).rejects.toEqual(new UnauthorizedQueryException())
  })

  it('correctly creates item', async () => {
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])

    // 'created' and 'updated' field should be automatically added.
    const itemToCreate = removeCreatedAndUpdatedFields(item)
    const createdItem = await ExampleRedisModel.create(user, itemToCreate)

    // Verify returned object.
    const expectedReturn = addTimestampFieldsToItem(item)
    expect(createdItem).toEqual(expectedReturn)
  })

  it('correctly creates item with default fields', async () => {
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
    })

    // Set mock response from DB client.
    const itemToCreate = {}
    const createdItem = await ExampleRedisModel.create(user, itemToCreate)

    // Verify returned object.
    expect(createdItem).toEqual({
      created: moment.utc().toISOString(),
      id: createdItem.id, // non-deterministic
      name: ExampleRedisModel.fieldDefaults.name,
      updated: moment.utc().toISOString(),
    })
  })

  it('fails with unauthorized `create`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      create: () => false,
    })
    const itemToCreate = Object.assign({}, fixturesA[0])
    return expect(ExampleRedisModel.create(user, itemToCreate)).rejects.toEqual(
      new UnauthorizedQueryException()
    )
  })

  it('correctly updates item', async () => {
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
      update: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])
    const expectedReturn = Object.assign({}, item, {
      name: 'Thing B',
      updated: moment.utc().toISOString(),
      created: moment.utc().toISOString(),
    })

    const itemToCreate = removeCreatedAndUpdatedFields(item)
    await ExampleRedisModel.create(user, itemToCreate)

    // 'updated' field should be automatically updated.
    const itemToUpdate = {
      ...removeCreatedAndUpdatedFields(item),
      name: 'Thing B',
    }
    const updatedItem = await ExampleRedisModel.update(user, itemToUpdate)

    // Verify returned object.
    expect(updatedItem).toEqual(expectedReturn)
  })

  it('fails with unauthorized `update`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      update: () => false,
    })
    const itemToUpdate = Object.assign({}, fixturesA[0])
    return expect(ExampleRedisModel.update(user, itemToUpdate)).rejects.toEqual(
      new UnauthorizedQueryException()
    )
  })

  it('correctly calls `create` from `getOrCreate` method', async () => {
    expect.assertions(2)
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
      get: () => true,
    })

    const itemToGetOrCreate = fixturesA[1]

    const response = await ExampleRedisModel.getOrCreate(
      user,
      itemToGetOrCreate
    )
    const createdItem = response.item

    expect(createdItem).toEqual(itemToGetOrCreate)
    expect(response.created).toBe(true)
  })

  it('fails with unauthorized `create` in `getOrCreate`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      create: () => false,
      get: () => true,
    })

    const itemToGetOrCreate = fixturesA[1]

    return expect(
      ExampleRedisModel.getOrCreate(user, itemToGetOrCreate)
    ).rejects.toEqual(new UnauthorizedQueryException())
  })

  it('correctly calls `get` from `getOrCreate` method', async () => {
    expect.assertions(2)
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
      get: () => true,
    })

    const itemToGetOrCreate = fixturesA[1]
    const createdItem = await ExampleRedisModel.create(user, itemToGetOrCreate)

    const response = await ExampleRedisModel.getOrCreate(
      user,
      itemToGetOrCreate
    )
    const responseItem = response.item

    expect(createdItem).toEqual(responseItem)
    expect(response.created).toBe(false)
  })

  it('fails with unauthorized `get` in `getOrCreate`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
      get: () => false,
    })

    const itemToGetOrCreate = fixturesA[1]
    await ExampleRedisModel.create(user, itemToGetOrCreate)

    return expect(
      ExampleRedisModel.getOrCreate(user, itemToGetOrCreate)
    ).rejects.toEqual(new UnauthorizedQueryException())
  })

  it('allows overriding the "created" and "updated" timestamp fields during item creation', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])

    // 'created' and 'updated' field should be automatically added.
    const itemToCreate = removeCreatedAndUpdatedFields(item)

    // Add our overridden "created" and "updated" timestamps.
    itemToCreate.created = '2017-12-24T07:00:00.001Z'
    itemToCreate.updated = '2017-12-25T07:15:02.025Z'
    const createdItem = await ExampleRedisModel.create(user, itemToCreate)

    expect(createdItem).toEqual(itemToCreate)
  })

  it('allows overriding the "updated" timestamp field during item updating', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
      update: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])

    // 'created' and 'updated' field should be automatically added.
    const itemToCreate = removeCreatedAndUpdatedFields(item)
    const createdItem = await ExampleRedisModel.create(user, itemToCreate)

    // Add our overridden updated" timestamp.
    const itemToUpdate = removeCreatedAndUpdatedFields(createdItem)
    itemToUpdate.updated = '2017-12-25T07:15:02.025Z'

    const updatedEntry = await ExampleRedisModel.update(user, itemToUpdate)
    expect(updatedEntry.updated).toEqual(itemToUpdate.updated)
  })

  it('fails with unauthorized `updateField`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      update: () => false,
    })
    return expect(
      ExampleRedisModel.updateField(user, 'name', 'abc')
    ).rejects.toEqual(new UnauthorizedQueryException())
  })

  it('updateField correctly updates field', async () => {
    expect.assertions(2)
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
      update: () => true,
      get: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])

    // 'created' and 'updated' field should be automatically added.
    const itemToCreate = removeCreatedAndUpdatedFields(item)
    const createdItem = await ExampleRedisModel.create(user, itemToCreate)

    const field = await ExampleRedisModel.updateField(
      user,
      createdItem.id,
      'name',
      'test-name'
    )
    expect(field).toEqual('test-name')

    const model = await ExampleRedisModel.get(user, createdItem.id)
    expect(model).toEqual({
      ...createdItem,
      name: 'test-name',
    })
  })

  it('updateField throws if field does not exist', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
      update: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])

    // 'created' and 'updated' field should be automatically added.
    const itemToCreate = removeCreatedAndUpdatedFields(item)
    const createdItem = await ExampleRedisModel.create(user, itemToCreate)
    return expect(
      ExampleRedisModel.updateField(user, createdItem.id, 'dummy', 'dummy')
    ).rejects.toEqual(new FieldDoesNotExistException())
  })

  it('updateField throws if record does not exist', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
      update: () => true,
    })

    return expect(
      ExampleRedisModel.updateField(user, 'dummy', 'name')
    ).rejects.toEqual(new DatabaseItemDoesNotExistException())
  })

  it('fails with unauthorized `updateIntegerFieldBy`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      update: () => false,
    })
    return expect(
      ExampleRedisModel.updateIntegerFieldBy(user, 'name', 'abc')
    ).rejects.toEqual(new UnauthorizedQueryException())
  })

  it('fails with non-numeric increment for `updateIntegerFieldBy`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      update: () => true,
    })
    return expect(
      ExampleRedisModel.updateIntegerFieldBy(user, 'name', 'abc', 'fgh')
    ).rejects.toEqual(new Error('Increment amount should be an integer'))
  })

  it('fails with non-numeric field for `updateIntegerFieldBy`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
      update: () => true,
      get: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])

    // 'created' and 'updated' field should be automatically added.
    const itemToCreate = removeCreatedAndUpdatedFields(item)
    const createdItem = await ExampleRedisModel.create(user, itemToCreate)

    return expect(
      ExampleRedisModel.updateIntegerFieldBy(user, createdItem.id, 'name', 5)
    ).rejects.toEqual(new Error('Field to update should be an integer'))
  })

  it('updateIntegerFieldBy correctly updates field', async () => {
    expect.assertions(2)
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
      update: () => true,
      get: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])

    // 'created' and 'updated' field should be automatically added.
    const itemToCreate = removeCreatedAndUpdatedFields(item)
    const createdItem = await ExampleRedisModel.create(user, itemToCreate)

    const field = await ExampleRedisModel.updateIntegerFieldBy(
      user,
      createdItem.id,
      'count',
      5
    )
    expect(field).toEqual(6)

    const model = await ExampleRedisModel.get(user, createdItem.id)
    expect(model).toEqual({
      ...createdItem,
      count: 6,
    })
  })

  it('updateField throws if field does not exist', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
      update: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])

    // 'created' and 'updated' field should be automatically added.
    const itemToCreate = removeCreatedAndUpdatedFields(item)
    const createdItem = await ExampleRedisModel.create(user, itemToCreate)
    return expect(
      ExampleRedisModel.updateField(user, createdItem.id, 'dummy', 'dummy')
    ).rejects.toEqual(new FieldDoesNotExistException())
  })

  it('updateField throws if record does not exist', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
      update: () => true,
    })

    return expect(
      ExampleRedisModel.updateField(user, 'dummy', 'name')
    ).rejects.toEqual(new DatabaseItemDoesNotExistException())
  })

  it('fails with unauthorized `getField`', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      get: () => false,
    })
    return expect(ExampleRedisModel.getField(user, 'name')).rejects.toEqual(
      new UnauthorizedQueryException()
    )
  })

  it('getField correctly gets field', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
      get: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])

    // 'created' and 'updated' field should be automatically added.
    const itemToCreate = removeCreatedAndUpdatedFields(item)
    const createdItem = await ExampleRedisModel.create(user, itemToCreate)
    const field = await ExampleRedisModel.getField(user, createdItem.id, 'name')
    expect(field).toEqual(createdItem.name)
  })

  it('getField throws if field does not exist', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
      get: () => true,
    })

    // Set mock response from DB client.
    const item = Object.assign({}, fixturesA[0])

    // 'created' and 'updated' field should be automatically added.
    const itemToCreate = removeCreatedAndUpdatedFields(item)
    const createdItem = await ExampleRedisModel.create(user, itemToCreate)
    return expect(
      ExampleRedisModel.getField(user, createdItem.id, 'dummy')
    ).rejects.toEqual(new FieldDoesNotExistException())
  })

  it('getField throws if record does not exist', async () => {
    expect.assertions(1)
    setModelPermissions(ExampleRedisModel, {
      create: () => true,
      get: () => true,
    })

    return expect(
      ExampleRedisModel.getField(user, 'dummy', 'name')
    ).rejects.toEqual(new DatabaseItemDoesNotExistException())
  })
})
