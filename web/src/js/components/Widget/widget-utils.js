
import BookmarkBorderIcon from 'material-ui/svg-icons/action/bookmark-border'
import ClockIcon from 'material-ui/svg-icons/action/schedule'
// import ListIcon from 'material-ui/svg-icons/action/list'
import FormatListBulletedIcon from 'material-ui/svg-icons/editor/format-list-bulleted'
// import NoteIcon from 'material-ui/svg-icons/av/note'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import SearchIcon from 'material-ui/svg-icons/action/search'
import GenericWidgetsIcon from 'material-ui/svg-icons/device/widgets'
import {
  WIDGET_TYPE_BOOKMARKS,
  WIDGET_TYPE_CLOCK,
  WIDGET_TYPE_NOTES,
  WIDGET_TYPE_SEARCH,
  WIDGET_TYPE_TODOS
} from '../../constants'

export const getWidgetIconFromWidgetType = (widgetType) => {
  var icon
  switch (widgetType) {
    case WIDGET_TYPE_BOOKMARKS:
      icon = BookmarkBorderIcon
      break

    case WIDGET_TYPE_CLOCK:
      icon = ClockIcon
      break

    case WIDGET_TYPE_NOTES:
      icon = EditIcon
      break

    case WIDGET_TYPE_SEARCH:
      icon = SearchIcon
      break

    case WIDGET_TYPE_TODOS:
      icon = FormatListBulletedIcon
      break

    default:
      icon = GenericWidgetsIcon
  }
  return icon
}
