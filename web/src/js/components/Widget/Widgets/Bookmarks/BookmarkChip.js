/* eslint-disable no-useless-escape */

import React from 'react'
import PropTypes from 'prop-types'

import WidgetPieceWrapper from '../../WidgetPieceWrapper'
import Paper from 'material-ui/Paper'
import DeleteIcon from 'material-ui/svg-icons/navigation/cancel'
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
      isHovering: false
    }
  }

  deleteBookmark (e) {
    e.stopPropagation()
    e.preventDefault()
    this.props.deleteBookmark(this.props.index)
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
          onClick={this.openLink.bind(this, bookmark.link)}
        >
          <DeleteIcon
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
            onClick={this.deleteBookmark.bind(this)}
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
