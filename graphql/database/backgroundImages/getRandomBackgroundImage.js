import { sample } from 'lodash/collection'
import getBackgroundImages from './getBackgroundImages'

/**
 * Fetch a random background image by category.
 * @return {Promise<BackgroundImage>}  A promise that resolves
 * into a BackgroundImage instance.
 */

export default async (userContext, category) => {
  const images = await getBackgroundImages(userContext, category)
  return sample(images)
}
