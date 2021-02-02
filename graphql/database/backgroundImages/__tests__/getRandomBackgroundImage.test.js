/* eslint-env jest */

import getRandomBackgroundImage from '../getRandomBackgroundImage'
import { mockImages, mockCatImages } from '../__mocks__/BackgroundImageModel'
import { getMockUserContext } from '../../test-utils'
import { BACKGROUND_IMAGE_LEGACY_CATEGORY } from '../../constants'

jest.mock('../../databaseClient')
jest.mock('../BackgroundImageModel')

const userContext = getMockUserContext()

describe('getRandomBackgroundImage', () => {
  it('works as expected with legacy category', async () => {
    const returnedImg = await getRandomBackgroundImage(
      userContext,
      BACKGROUND_IMAGE_LEGACY_CATEGORY
    )
    expect(mockImages).toContainEqual(returnedImg)
    const returnedImgTwo = await getRandomBackgroundImage(
      userContext,
      BACKGROUND_IMAGE_LEGACY_CATEGORY
    )
    expect(mockImages).toContainEqual(returnedImgTwo)
  })
  it('returns a legacy photo if a category is somehow ommitted', async () => {
    const returnedImg = await getRandomBackgroundImage(userContext)
    expect(mockImages).toContainEqual(returnedImg)
    const returnedImgTwo = await getRandomBackgroundImage(userContext)
    expect(mockImages).toContainEqual(returnedImgTwo)
  })
  it('returns a cat image when the category is cats ', async () => {
    const returnedImg = await getRandomBackgroundImage(userContext, 'cats')
    expect(mockCatImages).toContainEqual(returnedImg)
    const returnedImgTwo = await getRandomBackgroundImage(userContext, 'cats')
    expect(mockCatImages).toContainEqual(returnedImgTwo)
  })
})
