/* eslint-env jest */

import { sample } from 'lodash/collection'
import BackgroundImageModel from '../BackgroundImageModel'
import getRandomBackgroundImage from '../getRandomBackgroundImage'
import {
  getMockUserContext
} from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('lodash/collection')

const userContext = getMockUserContext()
const mockImages = [
  {
    id: 'fb5082cc-151a-4a9a-9289-06906670fd4e',
    updated: '2017-07-18T20:45:53Z',
    created: '2017-07-18T20:45:53Z',
    name: 'Mountain Lake',
    fileName: 'lake.jpg',
    timestamp: '2017-08-01T21:35:48Z'
  },
  {
    id: '90bfe202-54a9-4eea-9003-5e91572387dd',
    name: 'Puppy Eyes',
    fileName: 'puppy.jpg',
    created: '2017-07-18T20:45:53Z',
    updated: '2017-07-18T20:45:53Z'
  }
]

afterEach(() => {
  jest.clearAllMocks()
})

describe('getRandomBackgroundImage', () => {
  it('works as expected', async () => {
    jest.spyOn(BackgroundImageModel, 'getAll')
      .mockImplementationOnce(() => {
        return mockImages
      })
    sample.mockImplementationOnce(() => {
      return mockImages[0]
    })
    const returnedImg = await getRandomBackgroundImage(userContext)
    expect(returnedImg).toEqual(mockImages[0])

    sample.mockImplementationOnce(() => {
      return mockImages[1]
    })
    const returnedImgTwo = await getRandomBackgroundImage(userContext)
    expect(returnedImgTwo).toEqual(mockImages[1])
  })
})
