import BaseModel from '../base/model';
import database from '../database';
import tablesNames from '../tables';
import { getNextLevelFor } from '../userLevels/userLevel';
import { getBackgroundImage } from '../backgroundImages/backgroundImage';
import { UserReachedMaxLevelException } from '../../utils/exceptions';
import { logger } from '../../utils/dev-tools';

import Async from 'asyncawait/async';
import Await from 'asyncawait/await';

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

/*
 * Represents a  UserWidget. 
 * @extends BaseModel
 */
class UserWidget extends BaseModel {

  /**
   * Creates a Widget instance.
   * @param {string} id - The instance id in the database.
   */
  constructor(id) {
    super(id);

    this.widgetId = '';
    this.enabled = false;
    this.data = {};
    this.icon = null;
  }

  /**
   * Overrides getTableName from BaseModel.
   * Refer to `getTableName` in BaseModel for more details.
   */
  static getTableName() {
    return tablesNames.userWidgets;
  }

  /**
   * Overrides getFields from BaseModel.
   * Refer to `getFields` in BaseModel for more details.
   */
  static getFields() {
    return [
      'userId',
      'widgetId',
      'enabled',
      'data'
    ];
  }

  /**
   * Overrides getKey from BaseModel.
   * Refer to `getKey` in BaseModel for more details.
   */
  static getKey(id) {
    const key = {}
    key['userId'] = id
    return key;
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
 * Fetch the widgets for a user. The result includes the widget data 
 * as well as the user-widget related data.
 * The user-widget data field gets serialized into a string.
 * @param {string} userId - The user id. 
 * @return {Object[]}  Returns a list of object that with the widget and 
 * the user data on the widget information.
 */

var getUserWidgets =  Async (function(userId) {

    const userWidgets = Await (getWidgets(userId));

    const keys = [];
    const indexMapper = {}

    for(var index in userWidgets) {
        if(!userWidgets[index].enabled)
          continue;

        var widgetId = userWidgets[index].widgetId;

        keys.push({
          id: widgetId
        });

        indexMapper[widgetId] = index;
    }

    if(!keys.length)
      return [];

    const args = {
      ProjectionExpression: "id, name, type, icon"
    };

    const widgets = Await (Widget.getBatch(keys, args));

    const result = [];
    for(var index in widgets) {

        var widgetId = widgets[index].id;
        var userWidget = userWidgets[indexMapper[widgetId]];

        result.push(Object.assign({}, 
          userWidget,
          widgets[index],
          { 
            data: JSON.stringify(userWidget.data)
          }
        ));  
    }
    return result;
});

/**
 * Fetch the widgets for a user.
 * @param {string} userId - The user id. 
 * @return {Promise<Widget[]>}  Returns a promise that resolves into a
 * list of widgets.
 */
function getWidgets(userId) {
  
  var params = {
      KeyConditionExpression: "#id = :id",
      ExpressionAttributeNames:{
          "#id": 'userId'
      },
      ExpressionAttributeValues: {
          ":id": userId
      }
  };

  return UserWidget.query(params)
            .then(widgets => widgets)
            .catch(err => {
                logger.error("Error while getting the widgets.", err);
            });
}

export {
  Widget,
  UserWidget,
  getWidget,
  getUserWidgets,
  getWidgets
};


