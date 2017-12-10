/* eslint-disable no-useless-escape */

import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import EditBookmarkWidgetModal from './EditBookmarkWidgetModal'
import {
  dashboardTransparentBackground,
  widgetEditButtonInactive,
  widgetEditButtonHover
} from 'theme/default'
import hexToRgbA from 'hex-to-rgba'

class BookmarkChip extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false,
      startingIndex: this.props.index,
      // Set while modifying the widget settings
      temporaryColor: this.props.bookmark.color
    }
  }

  onDeleteBookmark () {
    this.props.deleteBookmark(this.props.index)
    this.setState({
      isEditing: false
    })
  }

  addProtocolToURLIfNeeded (url) {
    const hasProtocol = (s) => {
      var regexp = /(ftp|http|https|file):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
      return regexp.test(s)
    }

    if (!hasProtocol(url)) {
      return 'http://' + url
    }
    return url
  }

  openLink (link) {
    // The page might be iframed, so opening in _top is critical.
    window.open(this.addProtocolToURLIfNeeded(link), '_top')
    this.setState({
      open: false
    })
  }

  onClick (e) {
    if (this.props.editMode) {
      this.setState({
        isEditing: true,
        startingIndex: this.props.index
      })
    } else {
      this.openLink(this.props.bookmark.link)
    }
  }

  onEditCancel () {
    // Revert position changes if needed
    if (this.props.index > this.state.startingIndex) {
      this.props.onReorderMoveUp(this.props.index, this.props.index - this.state.startingIndex)
    } else if (this.props.index < this.state.startingIndex) {
      this.props.onReorderMoveDown(this.props.index, this.state.startingIndex - this.props.index)
    }

    // Revert color change
    this.setTemporaryColor(null)

    // Close modal
    this.setState({
      isEditing: false
    })
  }

  onEditSave (name, link, color = null) {
    // Clear any temporary colors
    this.setTemporaryColor(null)

    this.props.editBookmark(this.props.index, name, link, color)
    this.setState({
      isEditing: false
    })
  }

  onReorderMoveUp () {
    this.props.onReorderMoveUp(this.props.index)
  }

  onReorderMoveDown () {
    this.props.onReorderMoveDown(this.props.index)
  }

  setTemporaryColor (color) {
    this.setState({
      temporaryColor: color
    })
  }

  render () {
    const {bookmark} = this.props

    var bookmarkColor = dashboardTransparentBackground
    var bookmarkHex = '#000'
    const colorOverride = this.state.temporaryColor || bookmark.color
    if (colorOverride) {
      try {
        // May fail if the color is an invalid hex.
        bookmarkColor = hexToRgbA(colorOverride, 0.36)
        bookmarkHex = colorOverride
      } catch (e) {
        console.error('Error converting bookmark color to RGBA.', e)
      }
    }
    return (
      <span>
        <Paper
          zDepth={0}
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
            alignItems: 'center',
            margin: 5,
            minWidth: 84,
            maxWidth: 150,
            height: 50,
            fontSize: 14,
            padding: 10,
            backgroundColor: bookmarkColor,
            color: '#FFF',
            userSelect: 'none'
          }}
          onClick={this.onClick.bind(this)}
        >
          <EditIcon
            color={widgetEditButtonInactive}
            hoverColor={widgetEditButtonHover}
            style={{
              position: 'absolute',
              zIndex: 5,
              top: 2,
              right: 2,
              opacity: this.props.editMode ? 1 : 0,
              transition: 'opacity 0.1s ease-in',
              pointerEvents: this.props.editMode ? 'all' : 'none'
            }}
          />
          <span style={{
            color: '#FFF',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          >
            {bookmark.name}
          </span>
        </Paper>
        <EditBookmarkWidgetModal
          ref={(modal) => { this.editBookmarkModal = modal }}
          open={this.state.isEditing}
          onEditCancel={this.onEditCancel.bind(this)}
          onEditSave={this.onEditSave.bind(this)}
          onDeleteBookmark={this.onDeleteBookmark.bind(this)}
          currentBookmarkName={bookmark.name}
          currentBookmarkLink={bookmark.link}
          currentBookmarkColor={bookmarkHex}
          onReorderMoveUp={this.onReorderMoveUp.bind(this)}
          onReorderMoveDown={this.onReorderMoveDown.bind(this)}
          setTemporaryColor={this.setTemporaryColor.bind(this)}
          />
      </span>
    )
  }
}

BookmarkChip.propTypes = {
  bookmark: PropTypes.shape({
    name: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    color: PropTypes.string,
    order: PropTypes.number
  }).isRequired,
  index: PropTypes.number.isRequired,
  editMode: PropTypes.bool.isRequired,
  editBookmark: PropTypes.func.isRequired,
  deleteBookmark: PropTypes.func.isRequired,
  onReorderMoveUp: PropTypes.func.isRequired,
  onReorderMoveDown: PropTypes.func.isRequired
}

export default BookmarkChip
