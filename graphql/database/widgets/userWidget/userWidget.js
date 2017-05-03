import BaseModel from '../../base/model';
import database from '../../database';
import tablesNames from '../../tables';

import Async from 'asyncawait/async';
import Await from 'asyncawait/await';

import { logger } from '../../../utils/dev-tools';

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
    this.visible = false,
    this.data = {};
    this.config = {};
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
      'visible',
      'data',
      'config'
    ];
  }

  /**
   * Overrides getKey from BaseModel.
   * Refer to `getKey` in BaseModel for more details.
   */
  static getKey(id) {
    if(typeof id === 'string') {
      return {
        userId: id,
      }
    }
    return id;
  }
}

/**
 * Fetch the  user widget info from the userId and the widgetId.
 * @param {string} userId - The user id. 
 * @param {string} widgetId - The widget id. 
 * @return {Promise<UserWidget>}  Returns a Promise that resolve into
 * a UserWidget instance.
 */
function getUserWidget(userId, widgetId) {
  
  const key = {
    userId: userId,
    widgetId: widgetId
  };

  return UserWidget.get(key, {})
            .then(widget => {
              return widget;
            })
            .catch(err => {
                logger.error("Error while getting the widget.", err);
            });
}

/**
 * Fetch the widgets for a user.
 * @param {string} userId - The user id. 
 * @return {Promise<Widget[]>}  Returns a promise that resolves into a
 * list of widgets.
 */
function getUserWidgets(userId) {
  
  var params = {
      IndexName: "Widgets",
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

/**
 * Fetch the widgets for a user by enabled state.
 * @param {string} userId - The user id. 
 * @param {boolean} enabled - Wether to fetch all enabled or disabled widgets. 
 * @return {Promise<UserWidget[]>}  Returns a promise that resolves into a
 * list of user widgets.
 */
function getUserWidgetsByEnabledState(userId, enabled) {
  
  var params = {
      IndexName: "EnabledWidgets",
      KeyConditionExpression: "#userId = :userId and #enabled = :enabled",
      ExpressionAttributeNames:{
          "#userId": 'userId',
          "#enabled": 'enabled'
      },
      ExpressionAttributeValues: {
          ":userId": userId,
          ":enabled": enabled?1:0
      }
  };

  return UserWidget.query(params)
            .then(widgets => widgets)
            .catch(err => {
                logger.error("Error while getting the widgets.", err);
            });
}

/**
 * Update widget data.
 * @param {string} userId - The user id. 
 * @param {string} widgetId - The widget id. 
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * Widget.
 */
var updateWidgetData =  Async (function(userId, widgetId, data) {

    var updateExpression = `SET #data = :data`;
    var expressionAttributeNames = {
         '#data': 'data'
    };
    var expressionAttributeValues = {
         ':data': data
    };
    
    var params = {
        IndexName: "UserWidget",
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues:"ALL_NEW"
    };

    const key = {
      userId: userId,
      widgetId: widgetId
    };

    return Await (UserWidget.update(key, params));
});

/**
 * Update widget visible state.
 * @param {string} userId - The user id. 
 * @param {string} widgetId - The widget id.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * widget.
 */
var updateWidgetVisibility =  Async (function(userId, widgetId, visible) {

    var updateExpression = `SET #visible = :visible`;
    var expressionAttributeNames = {
         '#visible': 'visible'
    };
    var expressionAttributeValues = {
         ':visible': visible
    };
    
    var params = {
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues:"ALL_NEW"
    };

    const key = {
      userId: userId,
      widgetId: widgetId
    };

    return Await (UserWidget.update(key, params));
});

export {
  UserWidget,
  getUserWidgets,
  getUserWidget,
  getUserWidgetsByEnabledState,
  updateWidgetData,
  updateWidgetVisibility,
};