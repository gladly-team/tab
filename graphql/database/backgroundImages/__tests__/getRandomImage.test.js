/* eslint-env jest */

import mockDatabase from '../../__mocks__/database'
import { DatabaseOperation, OperationType } from '../../../utils/test-utils'
import { getRandomImage, BackgroundImage } from '../backgroundImage'

jest.mock('../../database', () => {
  return mockDatabase
})

function setup () {
  mockDatabase.init()
  return mockDatabase
}

test('fetch all background Images', () => {
  const database = setup()
  const items = [
     {id: 'image0', name: 'image0', fileName: 'image0.png'},
     {id: 'image1', name: 'image1', fileName: 'image1.png'},
     {id: 'image2', name: 'image2', fileName: 'image2.png'}
  ]

  database.pushDatabaseOperation(
     new DatabaseOperation(OperationType.SCAN, (params) => {
       return { Items: items }
     })
   )

  return getRandomImage()
    .then(response => {
      expect(response).not.toBe(null)
      expect(response instanceof BackgroundImage).toBe(true)
      var fromItems = false
      for (var index in items) {
        if (response.id === items[index].id) {
          fromItems = true
          break
        }
      }
      expect(fromItems).toBe(true)
    })
})
