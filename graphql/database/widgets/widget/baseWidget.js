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
      'icon'
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



export {
  Widget,
  getWidget
};
