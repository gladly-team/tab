/* eslint-env jest */

import BaseModel from '../model'
import moment from 'moment'

jest.mock('../../database')

// Avoid not implemented exception on base class.
BaseModel.getFields = jest.fn()

describe('Base Model class tests', function () {
  it('should include base fields when deserializing a model object', () => {
    BaseModel.getFields.mockReset()

    const modelObj = new BaseModel('some-id')
    modelObj.updated = 'updated'
    modelObj.created = 'created'

    const model = BaseModel.deserialize(modelObj)

    expect(BaseModel.getFields.mock.calls.length).toBe(1)
    expect(model).not.toBe(null)
    expect(model.id).toBe('some-id')
    expect(model.updated).toBe(modelObj.updated)
    expect(model.created).toBe(modelObj.created)
  })

  it('should include base fields when deserializing an array of model objects', () => {
    BaseModel.getFields.mockReset()

    const modelObj0 = new BaseModel('some-id-0')
    modelObj0.updated0 = 'updated-0'
    modelObj0.created0 = 'created-0'

    const modelObj1 = new BaseModel('some-id-1')
    modelObj1.updated = 'updated-1'
    modelObj1.created = 'created-1'

    const modelObj2 = new BaseModel('some-id-2')
    modelObj2.updated = 'updated-2'
    modelObj2.created = 'created-2'

    const modelObjs = [
      modelObj0, modelObj1, modelObj2
    ]

    const models = BaseModel.deserialize(modelObjs)
    expect(BaseModel.getFields.mock.calls.length).toBe(3)

    for (var index in models) {
      expect(models[index]).not.toBe(null)
      expect(models[index].id).toBe(modelObjs[index].id)
      expect(models[index].updated).toBe(modelObjs[index].updated)
      expect(models[index].created).toBe(modelObjs[index].created)
    }
  })

  it('should build the update expression correctly', () => {
    var expressionObjs = [
      { set: ['attr1 = value1', 'attr2 = value2', 'attr3 = value3'] },
      { set: ['attr1 = value1'], add: ['attr2 value2', 'attr3 value3'] },
      { add: ['attr1 value1'] }
    ]

    var expectedExpressions = [
      'SET attr1 = value1,attr2 = value2,attr3 = value3,#updated = :updated,#created = if_not_exists(#created, :created)',
      'SET attr1 = value1,#updated = :updated,#created = if_not_exists(#created, :created) ADD attr2 value2,attr3 value3',
      'SET #updated = :updated,#created = if_not_exists(#created, :created) ADD attr1 value1'
    ]

    for (var index in expressionObjs) {
      var expression = BaseModel.updateExpressionBuilder(expressionObjs[index])
      expect(expression).toBe(expectedExpressions[index])
    }
  })

  it('should build the expression args correctly', () => {
    var args = {
      ReturnValues: 'ALL_NEW'
    }

    var newArgs = BaseModel.updateArgsBuilder(args)

    expect(newArgs['ExpressionAttributeNames']).not.toBe(null)
    expect(newArgs['ExpressionAttributeValues']).not.toBe(null)

    expect(newArgs['ExpressionAttributeNames']['#created']).not.toBe(null)
    expect(newArgs['ExpressionAttributeNames']['#created']).toBe('created')

    expect(newArgs['ExpressionAttributeValues'][':created']).not.toBe(null)

    const created = moment.utc(newArgs['ExpressionAttributeValues'][':created'])
    var now = moment.utc()
    var diff = now.diff(created, 'seconds')
    expect(diff).toBeLessThan(3)

    expect(newArgs['ExpressionAttributeNames']['#updated']).not.toBe(null)
    expect(newArgs['ExpressionAttributeNames']['#updated']).toBe('updated')

    expect(newArgs['ExpressionAttributeValues'][':updated']).not.toBe(null)

    const updated = moment.utc(newArgs['ExpressionAttributeValues'][':updated'])
    now = moment.utc()
    diff = now.diff(updated, 'seconds')
    expect(diff).toBeLessThan(3)
  })

  it('should build the expression args correctly when other attr are defined', () => {
    var args = {
      ExpressionAttributeNames: {
        '#attr1': 'name1',
        '#attr2': 'name2'
      },
      ExpressionAttributeValues: {
        ':attr1': 'value1',
        ':attr2': 'value2'
      },
      ReturnValues: 'ALL_NEW'
    }

    var newArgs = BaseModel.updateArgsBuilder(args)

    expect(newArgs['ExpressionAttributeNames']).not.toBe(null)
    expect(newArgs['ExpressionAttributeValues']).not.toBe(null)

    expect(newArgs['ExpressionAttributeNames']['#attr1'])
      .toBe(args.ExpressionAttributeNames['#attr1'])
    expect(newArgs['ExpressionAttributeNames']['#attr2'])
      .toBe(args.ExpressionAttributeNames['#attr2'])

    expect(newArgs['ExpressionAttributeValues'][':attr1'])
      .toBe(args.ExpressionAttributeValues[':attr1'])
    expect(newArgs['ExpressionAttributeValues'][':attr2'])
      .toBe(args.ExpressionAttributeValues[':attr2'])

    expect(newArgs['ExpressionAttributeNames']['#created']).not.toBe(null)
    expect(newArgs['ExpressionAttributeNames']['#created']).toBe('created')

    expect(newArgs['ExpressionAttributeValues'][':created']).not.toBe(null)

    const created = moment.utc(newArgs['ExpressionAttributeValues'][':created'])
    var now = moment.utc()
    var diff = now.diff(created, 'seconds')
    expect(diff).toBeLessThan(3)

    expect(newArgs['ExpressionAttributeNames']['#updated']).not.toBe(null)
    expect(newArgs['ExpressionAttributeNames']['#updated']).toBe('updated')

    expect(newArgs['ExpressionAttributeValues'][':updated']).not.toBe(null)

    const updated = moment.utc(newArgs['ExpressionAttributeValues'][':updated'])
    now = moment.utc()
    diff = now.diff(updated, 'seconds')
    expect(diff).toBeLessThan(3)
  })
})
