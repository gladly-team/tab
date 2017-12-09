/* eslint-disable no-useless-escape */

import React from 'react'
import PropTypes from 'prop-types'

import WidgetPieceWrapper from '../../WidgetPieceWrapper'
import Paper from 'material-ui/Paper'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import EditBookmarkWidgetModal from './EditBookmarkWidgetModal'
import {
  dashboardTransparentBackground,
  dashboardTransparentBackgroundHover,
  widgetEditButtonInactive,
  widgetEditButtonHover
} from 'theme/default'

class BookmarkChip extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isHovering: false,
      isEditing: false
    }
  }

  onDeleteBookmark () {
    console.log('Deleting bookmark.')
    // this.props.deleteBookmark(this.props.index)
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
        isEditing: true
      })
    } else {
      this.openLink(this.props.bookmark.link)
    }
  }

  onEditCancel () {
    this.setState({
      isEditing: false
    })
  }

  onEditSave () {
    console.log('Saving bookmark edits.')
    const newName = this.editBookmarkModal.bookmarkNameTextField.input.value
    const newLink = this.editBookmarkModal.bookmarkLinkTextField.input.value
    console.log(newName, newLink)
    this.setState({
      isEditing: false
    })
  }

  render () {
    const {bookmark} = this.props
    return (
      <WidgetPieceWrapper>
        <Paper
          zDepth={0}
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
            alignItems: 'center',
            margin: 5,
            minWidth: 90,
            maxWidth: 150,
            height: 50,
            fontSize: 14,
            padding: 10,
            backgroundColor: this.state.isHovering
              ? dashboardTransparentBackgroundHover
              : dashboardTransparentBackground,
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
          />
      </WidgetPieceWrapper>
    )
  }
}

BookmarkChip.propTypes = {
  bookmark: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  editMode: PropTypes.bool.isRequired,
  // editBookmark: PropTypes.func.isRequired, // TODO
  deleteBookmark: PropTypes.func.isRequired
}

export default BookmarkChip
