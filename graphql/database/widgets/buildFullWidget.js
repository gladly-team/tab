
import Widget from './Widget'

/**
  * Merge the user widget with the widget data to create an object
  * with all the widget information.
  * @param {Object<UserWidget>} userWidget
  * @param {Object<UserWidget>} widget
  * @return {Object<UserWidget>}  Returns an instance of UserWidget
  * with all the widget information.
  */
const buildFullWidget = (userWidget, widget) => {
  return Object.assign(
    new Widget(),
    userWidget,
    widget,
    {
      id: userWidget.widgetId,
      data: JSON.stringify(userWidget.data),
      config: JSON.stringify(userWidget.config),
      settings: JSON.stringify(widget.settings)
    }
  )
}

export default buildFullWidget
