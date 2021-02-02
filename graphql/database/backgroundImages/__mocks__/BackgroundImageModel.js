/* eslint-env jest */

export const mockImages = [
  {
    id: 'fb5082cc-151a-4a9a-9289-06906670fd4e',
    updated: '2017-07-18T20:45:53Z',
    created: '2017-07-18T20:45:53Z',
    name: 'Mountain Lake',
    image: 'lake.jpg',
    category: 'legacy',
    imageURL: 'https://example.com/lake.jpg',
    thumbnail: 'lake.jpg',
    thumbnailURL: 'https://example.com/lake.jpg',
    timestamp: '2017-08-01T21:35:48Z',
  },
  {
    id: '90bfe202-54a9-4eea-9003-5e91572387dd',
    name: 'Puppy Eyes',
    image: 'puppy.jpg',
    imageURL: 'https://example.com/puppy.jpg',
    thumbnail: 'puppy.jpg',
    category: 'legacy',
    thumbnailURL: 'https://example.com/puppy.jpg',
    created: '2017-07-18T20:45:53Z',
    updated: '2017-07-18T20:45:53Z',
  },
]
export const mockCatImages = [
  {
    id: '90bfe202-54a9-4eea-9003-5e91572387dd',
    name: 'Puppy Eyes',
    image: 'puppy.jpg',
    category: 'cats',
    thumbnail: 'puppy.jpg',
    created: '2017-07-18T20:45:53Z',
    updated: '2017-07-18T20:45:53Z',
  },
  {
    id: '3caf69b6-9803-4495-9a5c-5ae0316bf367',
    name: 'Cup of Joe',
    image: 'cup.jpg',
    category: 'cats',
    thumbnail: 'cup.jpg',
    created: '2017-07-18T20:45:53Z',
    updated: '2017-07-18T20:45:53Z',
  },
]
export default {
  get: jest.fn(() => mockImages[1]),
  getAll: jest.fn(() => mockImages.filter(img => img.category === 'legacy')),
  query: jest.fn(() => ({
    usingIndex: () => ({
      execute: () => mockCatImages,
    }),
  })),
}
