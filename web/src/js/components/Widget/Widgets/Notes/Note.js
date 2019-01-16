import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import WidgetPieceWrapper from 'js/components/Widget/WidgetPieceWrapper'
import DeleteIcon from 'material-ui/svg-icons/navigation/cancel'
import Chip from 'material-ui/Chip'
import TextField from '@material-ui/core/TextField'
import appTheme, {
  dashboardTransparentBackground,
  widgetEditButtonInactive,
  widgetEditButtonHover,
} from 'js/theme/default'

import { withStyles } from '@material-ui/core/styles'

// Custom styling for placeholder text.
const placeholder = {
  color: appTheme.textField.underlineColor,
}

// https://github.com/callemall/material-ui/blob/86dbd4986c6fdc1f32c088abb3b73d25974272e8/src/Input/Input.js#L117-L120
const styles = theme => ({
  textFieldInput: {
    '&::-webkit-input-placeholder': placeholder,
    '&::-moz-placeholder': placeholder,
    '&:-ms-input-placeholder': placeholder,
    '&::-ms-input-placeholder': placeholder,
  },
})

class Note extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showDeleteButton: false,
    }

    this.noteChangedTimer = 0
    this.hoverTimer = 0
  }

  componentWillUnmount() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer)
    }
    if (this.noteChangedTimer) {
      clearTimeout(this.noteChangedTimer)
    }
  }

  removeStickyNote() {
    this.props.removeStickyNote(this.props.index)
  }

  onMouseHoverChange(isHovering) {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer)
    }
    if (isHovering) {
      this.hoverTimer = setTimeout(() => {
        this.setState({
          showDeleteButton: true,
        })
      }, 500)
    } else {
      this.setState({
        showDeleteButton: false,
      })
    }
  }

  onNoteClick() {
    this.noteInput.focus()
  }

  onNoteChanged(event) {
    if (this.noteChangedTimer) {
      clearTimeout(this.noteChangedTimer)
    }
    const value = event.target.value
    this.noteChangedTimer = setTimeout(() => {
      if (this.props.onNoteUpdated) {
        this.props.onNoteUpdated(value, this.props.index)
      }
    }, 500)
  }

  getNoteDate() {
    var noteDateFormat = 'MMM D'
    var now = moment()
    var noteDate = moment(this.props.note.created)
    if (now.date() === noteDate.date()) {
      noteDateFormat = 'h:mm A'
    }
    return noteDate.format(noteDateFormat)
  }

  render() {
    const { note, classes } = this.props

    const defaultPaper = {
      margin: 5,
      backgroundColor: dashboardTransparentBackground,
      borderRadius: 3,
      borderLeftStyle: 'solid',
      borderLeftColor: note.color,
      borderLeftWidth: 5,
    }
    const noteContent = {
      padding: '0 15px 5px 15px',
    }
    const chip = {
      style: {
        margin: 5,
      },
      labelColor: appTheme.textField.underlineColor,
      backgroundColor: 'rgba(0,0,0,0)',
    }

    const otherTransitions = 'fill 0.15s ease-in'
    const deleteIconStyle = {
      cursor: 'pointer',
      float: 'right',
      margin: '5px 5px 0px 0px',
      opacity: this.state.showDeleteButton ? 1 : 0,
      transition: this.state.showDeleteButton
        ? `opacity 0.2s ease-in 0.5s, ${otherTransitions}`
        : `opacity 0.1s ease-in, ${otherTransitions}`,
      pointerEvents: this.state.showDeleteButton ? 'all' : 'none',
      display: 'inline-block',
    }
    var noteDate = this.getNoteDate()

    return (
      <WidgetPieceWrapper>
        <div
          key={'note_' + this.props.index}
          style={defaultPaper}
          onClick={this.onNoteClick.bind(this)}
          onMouseEnter={this.onMouseHoverChange.bind(this, true)}
          onMouseLeave={this.onMouseHoverChange.bind(this, false)}
        >
          <div style={{ display: 'inline-block' }}>
            <Chip
              labelColor={chip.labelColor}
              backgroundColor={chip.backgroundColor}
              style={chip.style}
            >
              {noteDate}
            </Chip>
          </div>
          <DeleteIcon
            color={widgetEditButtonInactive}
            hoverColor={widgetEditButtonHover}
            style={deleteIconStyle}
            onClick={this.removeStickyNote.bind(this)}
          />
          <div style={noteContent}>
            <TextField
              id={'note-content-' + this.props.index}
              InputProps={{
                disableUnderline: true,
                style: {
                  color: '#FFF',
                  fontSize: 14,
                  fontFamily: appTheme.fontFamily,
                },
                classes: {
                  input: classes.textFieldInput,
                },
              }}
              multiline
              fullWidth
              placeholder={'Your note here...'}
              defaultValue={note.content ? note.content : ''}
              onChange={this.onNoteChanged.bind(this)}
              inputRef={note => {
                this.noteInput = note
              }}
            />
          </div>
        </div>
      </WidgetPieceWrapper>
    )
  }
}

Note.propTypes = {
  index: PropTypes.number.isRequired,
  removeStickyNote: PropTypes.func.isRequired,
  note: PropTypes.object.isRequired,
  onNoteUpdated: PropTypes.func,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Note)
