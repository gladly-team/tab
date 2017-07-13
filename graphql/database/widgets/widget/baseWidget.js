import BaseModel from '../../base/model'
import tablesNames from '../../tables'

import { logger } from '../../../utils/dev-tools'

/*
 * Represents a Base Widget.
 * @extends BaseModel
 */
class Widget extends BaseModel {
  /**
   * Creates a Widget instance.
   * @param {string} id - The instance id in the database.
   */
  constructor (id) {
    super(id)

    this.position = 0
    this.name = ''
    this.type = ''
    this.icon = null
    this.settings = {}
  }

  /**
   * Overrides getTableName from BaseModel.
   * Refer to `getTableName` in BaseModel for more details.
   */
  static getTableName () {
    return tablesNames.widgets
  }

  /**
   * Overrides getFields from BaseModel.
   * Refer to `getFields` in BaseModel for more details.
   */
  static getFields () {
    return [
      'position',
      'name',
      'type',
      'icon',
      'settings'
    ]
  }

  static sorted (widgets) {
    widgets.sort((widget1, widget2) => {
      if (!widget1.position) return 1
      if (!widget2.position) return -1
      return (widget1.position > widget2.position) ? 1 : ((widget2.position > widget1.position) ? -1 : 0)
    })
  }
}

/**
 * Fetch the widget by id.
 * @param {string} id - The widget id.
 * @return {Promise<Widget>}  A promise that resolve into a Widget instance.
 */
function getWidget (id) {
  return Widget.get(id)
            .then(widget => widget)
            .catch(err => {
              logger.error('Error while getting the widget.', err)
            })
}

/**
 * Fetch all the widgets.
 * @return {Promise<Widgets[]>}  A promise that resolve into a list
 * of Widget instances.
 */
function getWidgets () {
  var params = {
    ProjectionExpression: '#id, #position, #name, #type, #icon, #settings',
    ExpressionAttributeNames: {
      '#id': 'id',
      '#position': 'position',
      '#name': 'name',
      '#type': 'type',
      '#icon': 'icon',
      '#settings': 'settings'
    }
  }

  return Widget.getAll(params)
            .then(widgets => widgets)
            .catch(err => {
              logger.error('Error while fetching the widgets.', err)
            })
}

export {
  Widget,
  getWidget,
  getWidgets
}
