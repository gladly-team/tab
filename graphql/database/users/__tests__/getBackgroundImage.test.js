/* eslint-env jest */

import { getMockUserContext, getMockUserInstance } from '../../test-utils'

const EXAMPLE_DEPRECATED_IMG_ID = '9308b921-44c7-4b4e-845d-3b01fa73fa2b'
const REPLACEMENT_IMG_ID = '7e73d6d7-b915-4366-b01a-ffc126466d5b'

jest.mock('../setBackgroundImage')
jest.mock('../../../utils/s3', () => ({
  getPrivateBackgroundSignedUrl: jest.fn(
    (key) => `https://signed-url.example.com/${key}`
  ),
  getPublicBackgroundUrl: jest.fn(
    (photo) => `https://prod-tab2017-media.gladly.io/img/backgrounds/${photo}`
  ),
}))

afterEach(() => {
  jest.clearAllMocks()
})

describe('getBackgroundImage', () => {
  it('returns the user.getBackgroundImage property by default', async () => {
    expect.assertions(1)
    const getBackgroundImage = require('../getBackgroundImage').default
    const userContext = getMockUserContext()
    const exampleImg = {
      id: 'some-img-id',
      name: 'I am an image',
      image: 'abc.jpg',
      thumbnail: 'def.jpg',
    }
    const mockUser = {
      ...getMockUserInstance(),
      backgroundImage: exampleImg,
    }
    const response = await getBackgroundImage(userContext, mockUser)
    expect(response).toEqual(exampleImg)
  })

  it('does not call setBackgroundImage by default', async () => {
    expect.assertions(1)
    const getBackgroundImage = require('../getBackgroundImage').default
    const userContext = getMockUserContext()
    const mockUser = getMockUserInstance()
    const setBackgroundImage = require('../setBackgroundImage').default
    await getBackgroundImage(userContext, mockUser)
    expect(setBackgroundImage).not.toHaveBeenCalled()
  })

  it('returns a new background image when the current one is deprecated', async () => {
    expect.assertions(1)
    const getBackgroundImage = require('../getBackgroundImage').default
    const userContext = getMockUserContext()
    const mockUser = {
      ...getMockUserInstance(),
      backgroundImage: {
        id: EXAMPLE_DEPRECATED_IMG_ID,
        name: 'I am Deprecated',
        image: 'abc.jpg',
        thumbnail: 'def.jpg',
      },
    }
    const setBackgroundImage = require('../setBackgroundImage').default
    const newImg = {
      id: REPLACEMENT_IMG_ID,
      name: 'Solitude',
      image: '3acd54614b1d4d7fbce85d965de3de25.jpg',
      thumbnail: '71a27d6823244354acb85e0806d0dff1.jpg',
    }
    setBackgroundImage.mockImplementationOnce(async (_, __, imgId) => {
      if (imgId === REPLACEMENT_IMG_ID) {
        return {
          ...mockUser,
          backgroundImage: newImg,
        }
      }
      return mockUser
    })
    const response = await getBackgroundImage(userContext, mockUser)
    expect(response).toEqual(newImg)
  })

  it('passes the expected values to setBackgroundImage when setting a new one', async () => {
    expect.assertions(1)
    const getBackgroundImage = require('../getBackgroundImage').default
    const userContext = getMockUserContext()
    const mockUser = {
      ...getMockUserInstance(),
      backgroundImage: {
        id: EXAMPLE_DEPRECATED_IMG_ID,
        name: 'I am Deprecated',
        image: 'abc.jpg',
        thumbnail: 'def.jpg',
      },
      backgroundOption: 'photo',
    }
    const setBackgroundImage = require('../setBackgroundImage').default
    const newImg = {
      id: REPLACEMENT_IMG_ID,
      name: 'Solitude',
      image: '3acd54614b1d4d7fbce85d965de3de25.jpg',
      thumbnail: '71a27d6823244354acb85e0806d0dff1.jpg',
    }
    setBackgroundImage.mockImplementationOnce(async (_, __, imgId) => {
      if (imgId === REPLACEMENT_IMG_ID) {
        return {
          ...mockUser,
          backgroundImage: newImg,
        }
      }
      return mockUser
    })
    await getBackgroundImage(userContext, mockUser)
    expect(setBackgroundImage).toHaveBeenCalledWith(
      userContext,
      mockUser.id,
      REPLACEMENT_IMG_ID,
      'photo'
    )
  })

  it('defaults to "daily" image mode when calling setBackgroundImage in the case user does not have a "backgroundOption" field set', async () => {
    expect.assertions(1)
    const getBackgroundImage = require('../getBackgroundImage').default
    const userContext = getMockUserContext()
    const mockUser = {
      ...getMockUserInstance(),
      backgroundImage: {
        id: EXAMPLE_DEPRECATED_IMG_ID,
        name: 'I am Deprecated',
        image: 'abc.jpg',
        thumbnail: 'def.jpg',
      },
      backgroundOption: undefined,
    }
    const setBackgroundImage = require('../setBackgroundImage').default
    const newImg = {
      id: REPLACEMENT_IMG_ID,
      name: 'Solitude',
      image: '3acd54614b1d4d7fbce85d965de3de25.jpg',
      thumbnail: '71a27d6823244354acb85e0806d0dff1.jpg',
    }
    setBackgroundImage.mockImplementationOnce(async (_, __, imgId) => {
      if (imgId === REPLACEMENT_IMG_ID) {
        return {
          ...mockUser,
          backgroundImage: newImg,
        }
      }
      return mockUser
    })
    await getBackgroundImage(userContext, mockUser)
    expect(setBackgroundImage).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(String),
      expect.any(String),
      'daily' // this is the default
    )
  })

  describe('backgroundConfig handling', () => {
    it('returns public URL for photo type backgroundConfig', async () => {
      expect.assertions(1)
      const getBackgroundImage = require('../getBackgroundImage').default
      const userContext = getMockUserContext()
      const mockUser = {
        ...getMockUserInstance(),
        backgroundConfig: {
          type: 'photo',
          collection: 'black-photographers',
          photo: 'abe51098-8ebe-4f85-a637-1bd7d2ee94dd.jpg',
          updatedAt: '2025-12-12T05:36:38Z',
        },
      }
      const response = await getBackgroundImage(userContext, mockUser)
      expect(response).toEqual({
        id: 'abe51098-8ebe-4f85-a637-1bd7d2ee94dd.jpg',
        imageURL:
          'https://prod-tab2017-media.gladly.io/img/backgrounds/abe51098-8ebe-4f85-a637-1bd7d2ee94dd.jpg',
        timestamp: '2025-12-12T05:36:38Z',
      })
    })

    it('returns signed URL for custom type backgroundConfig', async () => {
      expect.assertions(1)
      const getBackgroundImage = require('../getBackgroundImage').default
      const userContext = getMockUserContext()
      const mockUser = {
        ...getMockUserInstance(),
        backgroundConfig: {
          type: 'custom',
          customPhoto: {
            path: 'users/LN5uK6FZWyQDHVf1tslU2BM1bMj1/backgrounds/441b963e-afcc-404c-b9f8-51b868840a1d.jpeg',
          },
          updatedAt: '2025-12-12T05:39:11Z',
        },
      }
      const response = await getBackgroundImage(userContext, mockUser)
      expect(response).toEqual({
        id: 'users/LN5uK6FZWyQDHVf1tslU2BM1bMj1/backgrounds/441b963e-afcc-404c-b9f8-51b868840a1d.jpeg',
        imageURL:
          'https://signed-url.example.com/users/LN5uK6FZWyQDHVf1tslU2BM1bMj1/backgrounds/441b963e-afcc-404c-b9f8-51b868840a1d.jpeg',
        timestamp: '2025-12-12T05:39:11Z',
      })
    })

    it('falls through to legacy code for daily type backgroundConfig', async () => {
      expect.assertions(1)
      const getBackgroundImage = require('../getBackgroundImage').default
      const userContext = getMockUserContext()
      const exampleImg = {
        id: 'some-img-id',
        name: 'I am an image',
        image: 'abc.jpg',
        thumbnail: 'def.jpg',
      }
      const mockUser = {
        ...getMockUserInstance(),
        backgroundImage: exampleImg,
        backgroundConfig: {
          type: 'daily',
          updatedAt: '2025-12-12T05:11:54Z',
        },
      }
      const response = await getBackgroundImage(userContext, mockUser)
      // Should return the legacy backgroundImage since daily type falls through
      expect(response).toEqual(exampleImg)
    })

    it('falls through to legacy code for color type backgroundConfig', async () => {
      expect.assertions(1)
      const getBackgroundImage = require('../getBackgroundImage').default
      const userContext = getMockUserContext()
      const exampleImg = {
        id: 'some-img-id',
        name: 'I am an image',
        image: 'abc.jpg',
        thumbnail: 'def.jpg',
      }
      const mockUser = {
        ...getMockUserInstance(),
        backgroundImage: exampleImg,
        backgroundConfig: {
          type: 'color',
          color: '#0EA5E9',
          updatedAt: '2025-12-12T05:37:21Z',
        },
      }
      const response = await getBackgroundImage(userContext, mockUser)
      // Should return the legacy backgroundImage since color type falls through
      expect(response).toEqual(exampleImg)
    })

    it('falls through to legacy code when backgroundConfig is missing photo field for photo type', async () => {
      expect.assertions(1)
      const getBackgroundImage = require('../getBackgroundImage').default
      const userContext = getMockUserContext()
      const exampleImg = {
        id: 'some-img-id',
        name: 'I am an image',
        image: 'abc.jpg',
        thumbnail: 'def.jpg',
      }
      const mockUser = {
        ...getMockUserInstance(),
        backgroundImage: exampleImg,
        backgroundConfig: {
          type: 'photo',
          collection: 'black-photographers',
          // Missing photo field
          updatedAt: '2025-12-12T05:36:38Z',
        },
      }
      const response = await getBackgroundImage(userContext, mockUser)
      expect(response).toEqual(exampleImg)
    })

    it('falls through to legacy code when backgroundConfig is missing customPhoto for custom type', async () => {
      expect.assertions(1)
      const getBackgroundImage = require('../getBackgroundImage').default
      const userContext = getMockUserContext()
      const exampleImg = {
        id: 'some-img-id',
        name: 'I am an image',
        image: 'abc.jpg',
        thumbnail: 'def.jpg',
      }
      const mockUser = {
        ...getMockUserInstance(),
        backgroundImage: exampleImg,
        backgroundConfig: {
          type: 'custom',
          // Missing customPhoto field
          updatedAt: '2025-12-12T05:39:11Z',
        },
      }
      const response = await getBackgroundImage(userContext, mockUser)
      expect(response).toEqual(exampleImg)
    })

    it('falls through to legacy code when backgroundConfig has unknown type', async () => {
      expect.assertions(1)
      const getBackgroundImage = require('../getBackgroundImage').default
      const userContext = getMockUserContext()
      const exampleImg = {
        id: 'some-img-id',
        name: 'I am an image',
        image: 'abc.jpg',
        thumbnail: 'def.jpg',
      }
      const mockUser = {
        ...getMockUserInstance(),
        backgroundImage: exampleImg,
        backgroundConfig: {
          type: 'unknown-type',
          updatedAt: '2025-12-12T05:39:11Z',
        },
      }
      const response = await getBackgroundImage(userContext, mockUser)
      expect(response).toEqual(exampleImg)
    })

    it('uses legacy code when user has no backgroundConfig', async () => {
      expect.assertions(1)
      const getBackgroundImage = require('../getBackgroundImage').default
      const userContext = getMockUserContext()
      const exampleImg = {
        id: 'some-img-id',
        name: 'I am an image',
        image: 'abc.jpg',
        thumbnail: 'def.jpg',
      }
      const mockUser = {
        ...getMockUserInstance(),
        backgroundImage: exampleImg,
        // No backgroundConfig field
      }
      const response = await getBackgroundImage(userContext, mockUser)
      expect(response).toEqual(exampleImg)
    })
  })
})
