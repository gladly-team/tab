import BaseModel from '../base/model';
import database from '../database';
import tablesNames from '../tables';

import { logger } from '../../utils/dev-tools';

/*
 * Represents a User BackgroundImage. 
 * @extends BaseModel
 */
class BackgroundImage extends BaseModel {

  /**
   * Creates a User BackgroundImage instance.
   * @param {string} id - The instance id in the database.
   */
  constructor(id) {
  	super(id);

    this.name = '';
  }

  /**
   * Overrides getTableName from BaseModel.
   * Refer to `getTableName` in BaseModel for more details.
   */
  static getTableName() {
  	return tablesNames.backgroundImages;
  }

  /**
   * Overrides getFields from BaseModel.
   * Refer to `getFields` in BaseModel for more details.
   */
  static getFields() {
    return [
      'name',
      'fileName'
    ];
  }
}


/**
 * Fetch the background image by id.
 * @param {string} id - The background image id. 
 * @return {Promise<BackgroundImage>}  A promise that resolve
 * into a BackgroundImage instance.
 */
function getBackgroundImage(id) {
	return BackgroundImage.get(id)
        		.then(image => image)
        		.catch(err => {
                logger.error("Error while getting the background image.", err);
        		});
}

/**
 * Get all the background images.
 * @return {Promise<BackgroundImage[]>}  A promise that resolve 
 * into a BackgroundImage array instance.
 */
function getBackgroundImages() {
  var params = {
      ProjectionExpression: "#id, #name, #fileName",
      ExpressionAttributeNames: {
          "#id": "id",
          "#name": "name",
          "#fileName": "fileName"
      }
  };
  return BackgroundImage.getAll(params)
            .then(bkgImages => bkgImages)
            .catch(err => {
                logger.error("Error while fetching the background images.", err);
            });
}


export {
  BackgroundImage,
  getBackgroundImage,
  getBackgroundImages
};
