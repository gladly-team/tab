import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import WidgetSharedSpace from 'general/WidgetSharedSpace';
import Note from './Note';
import NotesHeader from './NotesHeader';
import UpdateWidgetDataMutation from 'mutations/UpdateWidgetDataMutation';

import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Subheader from 'material-ui/Subheader';

import {
  grey300,
} from 'material-ui/styles/colors';

class NotesWidget extends React.Component {

  constructor(props) {
    super(props);

    this.noteElms = {};
    this.noteColors = ["#A5D6A7", "#FFF59D", "#FFF", "#FF4081", "#2196F3", "#757575", "#FF3D00"]

    this.state = {
      open: false,
      notes: [],
      saved: true,
    };
  }

  componentDidMount() {
    const { widget } = this.props; 
    const data = JSON.parse(widget.data);
    const notes = data.notes || [];
    this.setState({
      notes: notes,
      open: widget.visible,
    });
  }

  componentWillUnmount() {
    if(!this.state.saved) {
      this.updateWidget();
    }
  }

  toggleWidgetContent() {
    const open = !this.state.open;

    this.setState({
      open: open,
    });

    this.props.widgetVisibilityChanged(
      this.props.user, this.props.widget, open);
  }

  onNoteUpdated(index, content) {
    if(this.updateNoteTimer){
      clearTimeout(this.updateNoteTimer);
    }

    this.state.notes[index].content = content;
    this.setState({
      notes: this.state.notes,
      saved: false,
    });

    const self = this;
    this.updateNoteTimer = setTimeout(() => {
      self.updateWidget();
    }, 500);
  }

  getWidgetData() {
    const data = {
      notes: this.state.notes,
    }
    return JSON.stringify(data);
  }

  updateWidget() {
    const data = this.getWidgetData();
    
    UpdateWidgetDataMutation.commit(
      this.props.relay.environment,
      this.props.user,
      this.props.widget,
      data
    );

    this.setState({
      saved: true,
    });
  }

  addStickyNote() {

    const colorIndex = Math.floor(Math.random() * this.noteColors.length);
    const newNote = {
      id: this.randomString(6),
      color: this.noteColors[colorIndex],
      content: '',
    };

    this.state.notes.splice(0, 0, newNote);

    this.setState({
      notes: this.state.notes,
      saved: false,
    });
  }

  removeStickyNote(index) {
    this.state.notes.splice(index, 1);

    this.setState({
      notes: this.state.notes,
      saved: false,
    });

    this.updateWidget();
  }

  // This is a temporary solution since we are updating the 
  // widget data, if we have specific mutations for the notes
  // then we should generate the id of the note on the server.
  randomString(length) {
      const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var result = '';
      for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
      return result;
  }

  render() {

    const notesContainer = {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: 500,
    }

    var widgetContent;
    if(this.state.open){
      widgetContent = (
          <WidgetSharedSpace>
            <div style={notesContainer}>
              <NotesHeader
                addNote={this.addStickyNote.bind(this)}/>
              {this.state.notes.map((note, index) => {
                  return (
                    <Note
                      key={note.id}
                      index={index}
                      removeStickyNote={this.removeStickyNote.bind(this)}
                      onNoteUpdated={this.onNoteUpdated.bind(this)}
                      note={note}>
                    </Note>
                  );
              })}
            </div>
          </WidgetSharedSpace>
      );
    }

    return (
        <div>
          <IconButton
              onClick={this.toggleWidgetContent.bind(this)}>
                <FontIcon
                  color={grey300}
                  hoverColor={'#FFF'}
                  className="fa fa-sticky-note-o"/>
          </IconButton>
          {widgetContent}
        </div>);
  }
}

NotesWidget.propTypes = {
  widget: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  widgetVisibilityChanged: PropTypes.func.isRequired
};

export default NotesWidget;
