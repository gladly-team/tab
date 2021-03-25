/* eslint-env jest */

import getRandomBackgroundImage from '../getRandomBackgroundImage'
import {
  mockLegacyImages,
  mockCatImages,
} from '../__mocks__/BackgroundImageModel'
import { getMockUserContext } from '../../test-utils'
import {
  BACKGROUND_IMAGE_LEGACY_CATEGORY,
  BACKGROUND_IMAGE_CAT_CATEGORY,
} from '../../constants'

jest.mock('../../databaseClient')
jest.mock('../BackgroundImageModel')

const userContext = getMockUserContext()

describe('getRandomBackgroundImage', () => {
  it('works as expected with legacy category', async () => {
    const returnedImg = await getRandomBackgroundImage(
      userContext,
      BACKGROUND_IMAGE_LEGACY_CATEGORY
    )
    expect(mockLegacyImages).toContainEqual(returnedImg)
  })

  it('returns a legacy photo if a category is somehow ommitted', async () => {
    const returnedImg = await getRandomBackgroundImage(userContext)
    expect(mockLegacyImages).toContainEqual(returnedImg)
  })

  it('returns a cat image when the category is cats ', async () => {
    const returnedImg = await getRandomBackgroundImage(
      userContext,
      BACKGROUND_IMAGE_CAT_CATEGORY
    )
    expect(mockCatImages).toContainEqual(returnedImg)
  })
})
