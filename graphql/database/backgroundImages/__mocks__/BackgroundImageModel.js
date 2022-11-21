/* eslint-env jest */

export const mockImages = [
  {
    id: 'fb5082cc-151a-4a9a-9289-06906670fd4e',
    name: 'Mountain Lake',
    image: 'lake.jpg',
    thumbnail: 'lake.jpg',
    created: '2017-07-18T20:45:53Z',
    updated: '2017-07-18T20:45:53Z',
  },
  {
    id: '90bfe202-54a9-4eea-9003-5e91572387dd',
    name: 'Puppy Eyes',
    image: 'puppy.jpg',
    thumbnail: 'puppy.jpg',
    created: '2017-07-18T20:45:53Z',
    updated: '2017-07-18T20:45:53Z',
  },
  {
    id: '3caf69b6-9803-4495-9a5c-5ae0316bf367',
    name: 'Cup of Joe',
    image: 'cup.jpg',
    thumbnail: 'cup.jpg',
    created: '2017-07-18T20:45:53Z',
    updated: '2017-07-18T20:45:53Z',
  },
  {
    id: '9308b921-44c7-4b4e-845d-3b01fa73fa2b',
    name: 'Into the Blue',
    image: '94bbd29b17fe4fa3b45777281a392f21.jpg',
    thumbnail: '5d4dfd0b34134879903f0480720bd746.jpg',
    created: '2017-07-18T20:45:53Z',
    updated: '2017-07-18T20:45:53Z',
  },
  {
    id: '7bd681cf-850d-42eb-9a1f-7b9620bfb82a',
    image: '7bd681cf-850d-42eb-9a1f-7b9620bfb82a.jpg',
    thumbnail: '5d4dfd0b34134879903f0480720bd746.jpg',
    category: 'cats',
    created: '2021-02-16T23:17:05.806Z',
    updated: '2021-02-16T23:17:05.806Z',
  },
  {
    id: '7c33e7df-fdc6-4f57-bb13-646de15e58bb',
    image: '7c33e7df-fdc6-4f57-bb13-646de15e58bb.jpg',
    thumbnail: '5d4dfd0b34134879903f0480720bd746.jpg',
    category: 'cats',
    created: '2021-02-16T23:17:05.806Z',
    updated: '2021-02-16T23:17:05.806Z',
  },
  {
    id: '8a5ca2a1-fa90-42c1-820a-9029303c9ccd',
    image: '8a5ca2a1-fa90-42c1-820a-9029303c9ccd.jpg',
    thumbnail: '5d4dfd0b34134879903f0480720bd746.jpg',
    category: 'cats',
    created: '2021-02-16T23:17:05.806Z',
    updated: '2021-02-16T23:17:05.806Z',
  },
  {
    id: '8f54a3b0-9788-4a19-a818-efc40950e97d',
    image: '8f54a3b0-9788-4a19-a818-efc40950e97d.jpg',
    thumbnail: '5d4dfd0b34134879903f0480720bd746.jpg',
    category: 'cats',
    created: '2021-02-16T23:17:05.806Z',
    updated: '2021-02-16T23:17:05.806Z',
  },
]
export const mockLegacyImages = mockImages.filter((img) => !img.category)
export const mockCatImages = mockImages.filter((img) => img.category === 'cats')
export default {
  get: jest.fn(() => mockImages[1]),
  getAll: jest.fn(() => mockImages),
  query: jest.fn(() => ({
    usingIndex: () => ({
      execute: () => mockCatImages,
    }),
  })),
}
