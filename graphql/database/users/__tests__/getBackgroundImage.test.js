/* eslint-env jest */

import { getMockUserContext, getMockUserInstance } from '../../test-utils'

const EXAMPLE_DEPRECATED_IMG_ID = '9308b921-44c7-4b4e-845d-3b01fa73fa2b'
const REPLACEMENT_IMG_ID = '7e73d6d7-b915-4366-b01a-ffc126466d5b'

jest.mock('../setBackgroundImage')

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
})
