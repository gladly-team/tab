import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import WidgetSharedSpace from 'general/WidgetSharedSpace'
import EmptyWidgetMsg from 'general/EmptyWidgetMsg'
import {List} from 'general/List'

import Note from './Note'
import AddNoteForm from './AddNoteForm'
import UpdateWidgetDataMutation from 'mutations/UpdateWidgetDataMutation'

class NotesWidget extends React.Component {
  constructor (props) {
    super(props)
    this.noteColors = ['#A5D6A7', '#FFF59D', '#FFF', '#FF4081', '#2196F3', '#757575', '#FF3D00']
    this.state = {
      notes: []
    }
  }

  componentDidMount () {
    const { widget } = this.props

    const data = JSON.parse(widget.data)
    const notes = data.notes || []

    this.setState({
      notes: notes
    })
  }

  onSaveSuccess () {}

  onSaveError () {
    this.props.showError('Oops, we are having trouble saving your widgets right now :(')
  }

  updateWidget (notes) {
    const widgetData = {
      notes: notes
    }

    const data = JSON.stringify(widgetData)

    UpdateWidgetDataMutation.commit(
      this.props.relay.environment,
      this.props.user,
      this.props.widget,
      data,
      this.onSaveSuccess.bind(this),
      this.onSaveError.bind(this)
    )
  }

  addNewNote (text) {
    const colorIndex = Math.floor(Math.random() * this.noteColors.length)
    const newNote = {
      id: this.randomString(6),
      color: this.noteColors[colorIndex],
      content: text,
      created: moment.utc().format()
    }

    this.state.notes.splice(0, 0, newNote)
    if (text && text.length) {
      this.updateWidget(this.state.notes)
    }

    this.setState({
      notes: this.state.notes
    })
  }

  removeStickyNote (index) {
    this.state.notes.splice(index, 1)
    this.updateWidget(this.state.notes)

    this.setState({
      notes: this.state.notes
    })
  }

  updateStickyNote (content, index) {
    this.state.notes[index].content = content
    this.updateWidget(this.state.notes)
    this.setState({
      notes: this.state.notes
    })
  }

  // This is a temporary solution since we are updating the
  // widget data, if we have specific mutations for the notes
  // then we should generate the id of the note on the server.
  randomString (length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = ''
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
    return result
  }

  render () {
    const sharedSpaceStyle = {
      overflowX: 'visible',
      overflowY: 'visible',
      overflow: 'visible'
    }

    const notesContainer = {
      overflowY: 'scroll',
      overflowX: 'hidden',
      height: '60vh'
    }

    const mainContainer = {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 27
    }

    var nodataMsg
    if (!this.state.notes.length) {
      nodataMsg = (
        <EmptyWidgetMsg
          widgetName={'Notes'} />)
    }

    return (<WidgetSharedSpace
      containerStyle={sharedSpaceStyle}>
      <div style={mainContainer}>
        <AddNoteForm
          addForm={false}
          addNote={this.addNewNote.bind(this)} />
        <List
          containerStyle={notesContainer}>
          {nodataMsg}
          {this.state.notes.map((note, index) => {
            return (
              <Note
                key={note.id}
                index={index}
                removeStickyNote={this.removeStickyNote.bind(this)}
                onNoteUpdated={this.updateStickyNote.bind(this)}
                note={note} />
            )
          })}
        </List>
      </div>
    </WidgetSharedSpace>)
  }
}

NotesWidget.propTypes = {
  widget: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired,
    data: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  showError: PropTypes.func.isRequired
}

export default NotesWidget
