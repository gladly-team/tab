import { sample } from 'lodash/collection'
import BackgroundImageModel from './BackgroundImageModel'

/**
 * Fetch a Random image from the image base.
 * @return {Promise<BackgroundImage>}  A promise that resolve
 * into a BackgroundImage instance.
 */

export default async (userContext, category) => {
  try {
    console.log(category, userContext, 'inside get random')
    const images = await BackgroundImageModel.query(userContext, 'id')
      .usingIndex('ImagesByCategory')
      .where('category')
      .equals(category)
      .execute()
    console.log(images, 'images')
    return sample(images)
  } catch (e) {
    console.log(e, 'error')
    // throw e
  }
}
