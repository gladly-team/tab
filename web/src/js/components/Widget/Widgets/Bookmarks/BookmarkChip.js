import React from 'react'
import PropTypes from 'prop-types'

import WidgetPieceWrapper from '../../WidgetPieceWrapper'
import Paper from 'material-ui/Paper'
import DeleteIcon from 'material-ui/svg-icons/navigation/cancel'
import {
  widgetEditButtonInactive,
  widgetEditButtonHover
} from 'theme/default'

class BookmarkChip extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isHovering: false,
      showDeleteButton: false
    }
    this.hoverTimer = 0
  }

  deleteBookmark (e) {
    e.stopPropagation()
    e.preventDefault()
    this.props.deleteBookmark(this.props.index)
  }

  openLink (link) {
    // The page might be iframed, so opening in _top is critical.
    window.open(link, '_top')
    this.setState({
      open: false
    })
  }

  onMouseHoverChange (isHovering) {
    this.setState({
      isHovering: isHovering
    })
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer)
    }
    if (isHovering) {
      this.hoverTimer = setTimeout(() => {
        this.setState({
          showDeleteButton: true
        })
      }, 700)
    } else {
      this.setState({
        showDeleteButton: false
      })
    }
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
              ? 'rgba(0, 0, 0, 0.33)'
              : 'rgba(0, 0, 0, 0.30)',
            color: '#FFF',
            userSelect: 'none'
          }}
          onClick={this.openLink.bind(this, bookmark.link)}
          onMouseEnter={this.onMouseHoverChange.bind(this, true)}
          onMouseLeave={this.onMouseHoverChange.bind(this, false)}
        >
          <DeleteIcon
            color={widgetEditButtonInactive}
            hoverColor={widgetEditButtonHover}
            style={{
              position: 'absolute',
              zIndex: 5,
              top: 2,
              right: 2,
              opacity: this.state.showDeleteButton ? 1 : 0,
              transition: this.state.showDeleteButton
                ? 'opacity 0.2s ease-in 0.5s'
                : 'opacity 0.1s ease-in',
              pointerEvents: this.state.showDeleteButton ? 'all' : 'none'
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
  deleteBookmark: PropTypes.func.isRequired
}

export default BookmarkChip
