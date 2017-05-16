import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import UpdateWidgetDataMutation from 'mutations/UpdateWidgetDataMutation';

import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

import {
  grey300,
  grey700,
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
      hovering: -1,
    };
  }

  componentDidMount() {
    const { widget } = this.props; 
    const data = JSON.parse(widget.data);
    const notes = data.notes || [];
    this.setState({
      notes: notes,
      open: widget.visible,
      anchorEl: ReactDOM.findDOMNode(this.bIcon),
    });
  }

  componentWillUnmount() {
    if(!this.state.saved) {
      this.updateWidget();
    }
  }

  handleRequestOpen(event) {

    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });

    this.props.popoverWidgetVisibilityChanged(
      this.props.user, this.props.widget, true);
  }

  handleRequestClose() {
    this.setState({
      open: false,
      addForm: false,
    });

    this.props.popoverWidgetVisibilityChanged(
      this.props.user, this.props.widget, false);
  }

  onNoteUpdated(index) {
    if(this.updateNoteTimer){
      clearTimeout(this.updateNoteTimer);
    }

    const noteElm = this.noteElms['note' + index];
    const content = noteElm.input.refs.input.value;

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

  onNoteMouseOver(index) {
    // this.setState({
    //   hovering: index,
    // });
  }

  onNoteMouseLeave(index) {
    // if(this.state.hovering == index) {
    //   this.setState({
    //     hovering: -1,
    //   });
    // }
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
    const { widget } = this.props; 

    const containerStyle = {
      backgroundColor: 'rgba(0,0,0,.54)',
      width: 300,
    }

    const notesContainer = {
      display: 'flex',
      flexDirection: 'column',
      maxHeight: 500,
    }

    const headerStyle = {
      color: '#FFF',
    }

    const defaultPaper = {
      color: '#000',
      margin: 10,
      marginBottom: 5,
      marginTop: 5
    }

    const noteContent = {
      padding: 15,
      color: '#000',
    }

    const underlineStyle = {
      borderColor: 'transparent',
    }

    const addNoteBtn = {
      position: 'absolute',
      right: 5,
    }

    const removeNoteBtn = {
      position: 'relative',
      float: 'right',
    }

    return (
        <div>
          <IconButton 
              ref={(bIcon) => { this.bIcon = bIcon; }}
              tooltip={widget.name}
              onClick={this.handleRequestOpen.bind(this)}>
                <FontIcon
                  color={grey300}
                  hoverColor={'#FFF'}
                  className="fa fa-sticky-note-o"/>
          </IconButton>
          <Popover
            style={containerStyle}
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose.bind(this)}>
              <div style={notesContainer}>
                <Subheader style={headerStyle}>Notes
                      <IconButton
                          style={addNoteBtn}
                          onClick={this.addStickyNote.bind(this)}>
                            <FontIcon
                              color={'#FFF'}
                              hoverColor={'#FFF'}
                              className={'fa fa-plus'}/>
                      </IconButton>
                </Subheader>
                {this.state.notes.map((note, index) => {
                    return (<Paper 
                              onMouseOver={this.onNoteMouseOver.bind(this, index)}
                              onMouseLeave={this.onNoteMouseLeave.bind(this, index)}
                              key={note.id}
                              style={Object.assign({}, defaultPaper, {
                                backgroundColor: note.color
                              })}  
                              zDepth={2} 
                              rounded={false}>
                                <IconButton
                                    style={removeNoteBtn}
                                    onClick={this.removeStickyNote.bind(this, index)}>
                                      <FontIcon
                                        color={grey700}
                                        hoverColor={'#000'}
                                        className={'fa fa-times'}/>
                                </IconButton>
                                <div style={noteContent}>
                                  <TextField
                                    ref={(input) => { this.noteElms["note" + index] = input; }}
                                    onChange={this.onNoteUpdated.bind(this, index)}
                                    id={"note" + index}
                                    defaultValue={note.content}
                                    hintText={"Your note here..."}
                                    underlineStyle={underlineStyle}
                                    underlineFocusStyle={underlineStyle}
                                    multiLine={true}/>
                                </div>
                            </Paper>
                    );
                })}
              </div>
          </Popover>
        </div>);
  }
}

NotesWidget.propTypes = {
  widget: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  popoverWidgetVisibilityChanged: PropTypes.func.isRequired
};

export default NotesWidget;
