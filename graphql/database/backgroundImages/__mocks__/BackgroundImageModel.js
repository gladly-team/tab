/* eslint-env jest */

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

export default {
  get: jest.fn(() => mockImages[1]),
  getAll: jest.fn(() => mockImages)
}
