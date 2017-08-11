import React from 'react'
import PropTypes from 'prop-types'

import WidgetSharedSpace from 'general/WidgetSharedSpace'
import EmptyWidgetMsg from 'general/EmptyWidgetMsg'
import BookmarkChip from './BookmarkChip'
import AddBookmarkForm from './AddBookmarkForm'

import UpdateWidgetDataMutation from 'mutations/UpdateWidgetDataMutation'

import Snackbar from 'material-ui/Snackbar'

class BookmarksWidget extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      editMode: false,
      bookmarks: []
    }
  }

  componentDidMount () {
    const { widget } = this.props
    const data = JSON.parse(widget.data)
    const bookmarks = data.bookmarks || []
    this.setState({
      bookmarks: bookmarks
    })
  }

  getFavicon (link) {
    return 'https://www.google.com/s2/favicons?domain_url=' + encodeURI(link)
  }

  updateWidget (bookmarks) {
    const widgetData = {
      bookmarks: bookmarks
    }
    const data = JSON.stringify(widgetData)
    UpdateWidgetDataMutation.commit(
      this.props.relay.environment,
      this.props.user,
      this.props.widget,
      data
    )
  }

  addBookmark (name, link) {
    const newBookmark = {
      name: name,
      link: link
    }
    this.state.bookmarks.splice(0, 0, newBookmark)
    this.updateWidget(this.state.bookmarks)
    this.setState({
      bookmarks: this.state.bookmarks
    })
  }

  removeBookmark (index) {
    this.state.bookmarks.splice(index, 1)
    this.updateWidget(this.state.bookmarks)
    this.setState({
      bookmarks: this.state.bookmarks
    })
  }

  onToggleEditMode () {
    this.setState({
      editMode: !this.state.editMode
    })
  }

  render () {
    const bookmarks = this.state.bookmarks || []

    const sharedSpaceStyle = {
      overflowX: 'visible',
      overflowY: 'visible',
      overflow: 'visible'
    }

    const wrapper = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-start'
    }

    const container = {
      overflowY: 'scroll',
      overflowX: 'hidden',
      maxHeight: '60vh'
    }

    const bookmarksContainer = {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 27
    }

    var nodataMsg
    if (!bookmarks.length) {
      nodataMsg = (
        <EmptyWidgetMsg
          widgetName={'Bookmarks'} />)
    }

    return (<WidgetSharedSpace
      containerStyle={sharedSpaceStyle}>
      <div style={bookmarksContainer}>
        <AddBookmarkForm
          addBookmark={this.addBookmark.bind(this)}
          onEditModeClicked={this.onToggleEditMode.bind(this)} />
        <div style={container}>
          <div style={wrapper}>
            {nodataMsg}
            {
              bookmarks.map((bookmark, index) => {
                return (<BookmarkChip
                  key={index}
                  index={index}
                  editMode={this.state.editMode}
                  bookmark={bookmark}
                  removeChip={this.removeBookmark.bind(this, index)} />
                )
              })
            }
          </div>
        </div>
      </div>
      <Snackbar
        open={this.state.editMode}
        message='Click on a bookmark while in edit mode to delete it.' />
    </WidgetSharedSpace>)
  }
}

BookmarksWidget.propTypes = {
  widget: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  widgetVisibilityChanged: PropTypes.func.isRequired
}

export default BookmarksWidget
