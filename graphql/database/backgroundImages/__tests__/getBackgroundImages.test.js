/* eslint-env jest */

import getBackgroundImages from '../getBackgroundImages'
import {
  mockLegacyImages,
  mockCatImages,
} from '../__mocks__/BackgroundImageModel'
import { getMockUserContext } from '../../test-utils'
import { BACKGROUND_IMAGE_LEGACY_CATEGORY } from '../../constants'

jest.mock('../../databaseClient')
jest.mock('../BackgroundImageModel')

const userContext = getMockUserContext()

describe('getBackgroundImages', () => {
  it('works as expected with legacy category', async () => {
    expect.assertions(1)
    const images = await getBackgroundImages(
      userContext,
      BACKGROUND_IMAGE_LEGACY_CATEGORY
    )
    expect(images).toEqual(mockLegacyImages)
  })

  it('returns legacy images if a category is somehow omitted', async () => {
    expect.assertions(1)
    const images = await getBackgroundImages(userContext)
    expect(images).toEqual(mockLegacyImages)
  })

  it('returns a cat image when the category is cats ', async () => {
    expect.assertions(1)
    const images = await getBackgroundImages(userContext, 'cats')
    expect(images).toEqual(mockCatImages)
  })
})
