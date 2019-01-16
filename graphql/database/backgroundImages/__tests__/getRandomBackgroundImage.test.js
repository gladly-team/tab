/* eslint-env jest */

import getRandomBackgroundImage from '../getRandomBackgroundImage'
import { mockImages } from '../__mocks__/BackgroundImageModel'
import { getMockUserContext } from '../../test-utils'

jest.mock('../../databaseClient')
jest.mock('../BackgroundImageModel')

const userContext = getMockUserContext()

describe('getRandomBackgroundImage', () => {
  it('works as expected', async () => {
    const returnedImg = await getRandomBackgroundImage(userContext)
    expect(mockImages).toContainEqual(returnedImg)
    const returnedImgTwo = await getRandomBackgroundImage(userContext)
    expect(mockImages).toContainEqual(returnedImgTwo)
  })
})
