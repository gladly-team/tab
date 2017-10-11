import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import FadeInDashboardAnimation from 'general/FadeInDashboardAnimation'

import DeleteIcon from 'material-ui/svg-icons/navigation/cancel'
import Chip from 'material-ui/Chip'
import TextField from 'material-ui/TextField'

import appTheme from 'theme/default'

class Note extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      hoveringDelete: false,
      editMode: false
    }

    this.noteChangedTimer = 0
  }

  removeStickyNote () {
    this.props.removeStickyNote(this.props.index)
  }

  onDeleteBtnMouseMove (enter) {
    this.setState({
      hoveringDelete: enter
    })
  }

  onNoteChanged (event, value) {
    if (this.noteChangedTimer) {
      clearTimeout(this.noteChangedTimer)
    }
    this.noteChangedTimer = setTimeout(() => {
      if (this.props.onNoteUpdated) {
        this.props.onNoteUpdated(value, this.props.index)
      }
    }, 500)
  }

  getNoteDate () {
    var noteDateFormat = 'MMM, DD'
    var now = moment()
    var noteDate = moment(this.props.note.created)
    if (now.date() === noteDate.date()) {
      noteDateFormat = 'h:mm A'
    }
    return noteDate.format(noteDateFormat)
  }

  render () {
    const { note } = this.props

    const defaultPaper = {
      margin: 5,
      backgroundColor: 'rgba(0,0,0,.3)',
      borderRadius: 3,
      borderLeftStyle: 'solid',
      borderLeftColor: note.color,
      borderLeftWidth: 5
    }

    const noteContent = {
      padding: '0 15px 5px 15px'
    }

    const chip = {
      style: {
        margin: 5
      },
      labelColor: appTheme.textField.underlineColor,
      backgroundColor: 'rgba(0,0,0,0)'
    }

    const deleteIcon = {
      cursor: 'pointer',
      float: 'right',
      margin: '5px 5px 0px 0px',
      hoverColor: appTheme.fontIcon.color,
      color: 'rgba(255,255,255,0)',
      display: 'inline-block'
    }

    var deleteIconColor = (this.state.hoveringDelete)
          ? deleteIcon.hoverColor : deleteIcon.color

    const textStyle = {
      fontSize: 14,
      color: '#EEE',
      fontFamily: appTheme.fontFamily
    }

    var noteDate = this.getNoteDate()

    return (
      <FadeInDashboardAnimation
        delayRange={300}>
        <div
          key={'note_' + this.props.index}
          style={defaultPaper}
          onMouseEnter={this.onDeleteBtnMouseMove.bind(this, true)}
          onMouseLeave={this.onDeleteBtnMouseMove.bind(this, false)}>
          <div style={{display: 'inline-block'}}>
            <Chip
              labelColor={chip.labelColor}
              backgroundColor={chip.backgroundColor}
              style={chip.style}>
              {noteDate}
            </Chip>
          </div>
          <DeleteIcon
            color={deleteIconColor}
            style={deleteIcon}
            onClick={this.removeStickyNote.bind(this)} />
          <div style={noteContent}>
            <TextField
              id={'note-content-' + this.props.index}
              onChange={this.onNoteChanged.bind(this)}
              hintText='Your note here...'
              textareaStyle={textStyle}
              multiLine
              defaultValue={note.content}
              underlineShow={false} />
          </div>
        </div>
      </FadeInDashboardAnimation>
    )
  }
}

Note.propTypes = {
  index: PropTypes.number.isRequired,
  removeStickyNote: PropTypes.func.isRequired,
  note: PropTypes.object.isRequired,
  onNoteUpdated: PropTypes.func
}

export default Note
