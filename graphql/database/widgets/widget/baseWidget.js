import BaseModel from '../../base/model';
import database from '../../database';
import tablesNames from '../../tables';

import Async from 'asyncawait/async';
import Await from 'asyncawait/await';

import { logger } from '../../../utils/dev-tools';

/*
 * Represents a Base Widget. 
 * @extends BaseModel
 */
class Widget extends BaseModel {

  /**
   * Creates a Widget instance.
   * @param {string} id - The instance id in the database.
   */
  constructor(id) {
    super(id);

    this.name = '';
    this.type = '';
    this.icon = null;
    this.settings = {};
  }

  /**
   * Overrides getTableName from BaseModel.
   * Refer to `getTableName` in BaseModel for more details.
   */
  static getTableName() {
    return tablesNames.widgets;
  }

  /**
   * Overrides getFields from BaseModel.
   * Refer to `getFields` in BaseModel for more details.
   */
  static getFields() {
    return [
      'name',
      'type',
      'icon',
      'settings'
    ];
  }
}

/**
 * Fetch the widget by id.
 * @param {string} id - The widget id. 
 * @return {Promise<Widget>}  A promise that resolve into a Widget instance.
 */
function getWidget(id) {
  return Widget.get(id)
            .then(widget => widget)
            .catch(err => {
                logger.error("Error while getting the widget.", err);
            });
}

/**
 * Fetch all the widgets.
 * @return {Promise<Widgets[]>}  A promise that resolve into a list 
 * of Widget instances.
 */
function getWidgets() {
  var params = {
      ProjectionExpression: "#id, #name, #type, #icon, #settings",
      ExpressionAttributeNames: {
          "#id": "id",
          "#name": "name",
          "#type": "type",
          "#icon": "icon",
          "#settings": "settings"
      }
  };
  
  return Widget.getAll(params)
            .then(widgets => widgets)
            .catch(err => {
                logger.error("Error while fetching the widgets.", err);
            });
}

export {
  Widget,
  getWidget,
  getWidgets
};
