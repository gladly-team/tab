/* eslint-env jest */

import getRandomBackgroundImage from '../getRandomBackgroundImage'
import { mockImages } from '../__mocks__/BackgroundImageModel'
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
})
