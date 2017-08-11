// TODO: delete me

import BaseModel from '../../base/model'
import tablesNames from '../../tables'

import Async from 'asyncawait/async'
import Await from 'asyncawait/await'

import { logger } from '../../../utils/dev-tools'

/*
 * Represents a  UserWidget.
 * @extends BaseModel
 */
class UserWidget extends BaseModel {
  /**
   * Creates a Widget instance.
   * @param {string} id - The instance id in the database.
   */
  constructor (id) {
    super(id)

    this.widgetId = ''
    this.enabled = false
    this.visible = false
    this.data = {}
    this.config = {}
    this.icon = null
  }

  /**
   * Overrides getTableName from BaseModel.
   * Refer to `getTableName` in BaseModel for more details.
   */
  static getTableName () {
    return tablesNames.userWidgets
  }

  /**
   * Overrides getFields from BaseModel.
   * Refer to `getFields` in BaseModel for more details.
   */
  static getFields () {
    return [
      'userId',
      'widgetId',
      'enabled',
      'visible',
      'data',
      'config'
    ]
  }

  /**
   * Overrides getKey from BaseModel.
   * Refer to `getKey` in BaseModel for more details.
   */
  static getKey (id) {
    if (typeof id === 'string') {
      return {
        userId: id
      }
    }
    return id
  }
}

/**
 * Fetch the  user widget info from the userId and the widgetId.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @return {Promise<UserWidget>}  Returns a Promise that resolve into
 * a UserWidget instance.
 */
function getUserWidget (userId, widgetId) {
  const key = {
    userId: userId,
    widgetId: widgetId
  }

  return UserWidget.get(key, {})
    .then(widget => {
      return widget
    })
    .catch(err => {
      logger.error('Error while getting the widget.', err)
    })
}

/**
 * Fetch the widgets for a user.
 * @param {string} userId - The user id.
 * @return {Promise<Widget[]>}  Returns a promise that resolves into a
 * list of widgets.
 */
function getUserWidgets (userId) {
  var params = {
    IndexName: 'Widgets',
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': 'userId'
    },
    ExpressionAttributeValues: {
      ':id': userId
    }
  }

  return UserWidget.query(params)
    .then(widgets => widgets)
    .catch(err => {
      logger.error('Error while getting the widgets.', err)
    })
}

/**
 * Update widget visible state.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {boolean} visible - The new visible state.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * widget.
 */
var updateWidgetVisibility = Async(function (userId, widgetId, visible) {
  var updateExpression = {
    set: ['#visible = :visible']
  }

  var expressionAttributeNames = {
    '#visible': 'visible'
  }
  var expressionAttributeValues = {
    ':visible': visible
  }

  var params = {
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  }

  const key = {
    userId: userId,
    widgetId: widgetId
  }

  return Await(UserWidget.update(key, updateExpression, params))
})

/**
 * Update widget enabled state.
 * @param {string} userId - The user id.
 * @param {string} widgetId - The widget id.
 * @param {boolean} enabled - The new enabled state.
 * @return {Promise<Widget>}  Returns a promise that resolves into a
 * widget.
 */
var updateWidgetEnabled = Async(function (userId, widgetId, enabled) {
  var updateExpression = {
    set: ['#enabled = :enabled']
  }
  var expressionAttributeNames = {
    '#enabled': 'enabled'
  }
  var expressionAttributeValues = {
    ':enabled': enabled
  }

  var params = {
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  }

  const key = {
    userId: userId,
    widgetId: widgetId
  }

  return Await(UserWidget.update(key, updateExpression, params))
})

export {
  UserWidget,
  getUserWidgets,
  getUserWidget,
  updateWidgetVisibility,
  updateWidgetEnabled
}
