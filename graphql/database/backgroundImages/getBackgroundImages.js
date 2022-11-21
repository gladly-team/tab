import BackgroundImageModel from './BackgroundImageModel'
import { BACKGROUND_IMAGE_LEGACY_CATEGORY } from '../constants'

/**
 * Fetch all background images, filtering by categorry.
 * @return {Promise<BackgroundImage[]>}  A promise that resolves
 * into an array of BackgroundImages.
 */

export default async (
  userContext,
  category = BACKGROUND_IMAGE_LEGACY_CATEGORY
) => {
  let images = []
  if (category === BACKGROUND_IMAGE_LEGACY_CATEGORY) {
    // We're assuming legacy photo items in the DB don't have a category.
    // Can remove this if we migrate that field to all items.
    images = await BackgroundImageModel.getAll(userContext)
    images = images.filter(
      (image) =>
        !image.category || image.category === BACKGROUND_IMAGE_LEGACY_CATEGORY
    )
  } else {
    images = await BackgroundImageModel.query(userContext, category)
      .usingIndex('ImagesByCategory')
      .execute()
  }
  return images
}
