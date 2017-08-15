
import { sample } from 'lodash/collection'
import BackgroundImageModel from './BackgroundImageModel'

/**
 * Fetch a Random image from the image base.
 * @return {Promise<BackgroundImage>}  A promise that resolve
 * into a BackgroundImage instance.
 */
export default async (userContext) => {
  const images = await BackgroundImageModel.getAll(userContext)
  return sample(images)
}
