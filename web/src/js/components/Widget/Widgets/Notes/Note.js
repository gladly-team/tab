import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import DeleteIcon from 'material-ui/svg-icons/navigation/cancel';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import appTheme from 'theme/default';

class NotesWidget extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      hoveringDelete: false,
    };
  }

  onNoteUpdated() {
    const content = this.note.input.refs.input.value;
    this.props.onNoteUpdated(this.props.index, content);
  }

  removeStickyNote() {
    this.props.removeStickyNote(this.props.index);
  }

  onDeleteBtnMouseMove(enter) {
    this.setState({
      hoveringDelete: enter,
    })
  }

  render() {
    const { note } = this.props;

    const defaultPaper = {
      margin: 10,
      marginBottom: 5,
      marginTop: 5,
      backgroundColor: 'rgba(0,0,0,.3)',
      borderRadius: 5,
    }

    const noteContent = {
      padding: '0 15px 5px 15px',
    }

    const textField = {
      hintStyle: {
        color: appTheme.textField.underlineColor,
        fontSize: 14,
      },
      inputStyle: {
        color: '#EEE',
        fontSize: 14,
      },
      underlineStyle: {
        borderColor: 'transparent',
      }
    }

    const chip = {
      style: {
        margin: 5,
      },
      labelColor: appTheme.textField.underlineColor,
      backgroundColor: 'rgba(0,0,0,0)',
    }

    const deleteIcon = {
      cursor: 'pointer',
      float: 'right',
      margin: '5px 5px 0px 0px',
      hoverColor: appTheme.fontIcon.color,
      color: 'rgba(255,255,255,.3)',
      display: 'inline-block',
    };

    var deleteIconColor = (this.state.hoveringDelete)?
          deleteIcon.hoverColor: deleteIcon.color;

    return (
      <Paper
        style={defaultPaper}  
        zDepth={2} 
        rounded={false}>
          <div style={{display: 'inline-block'}}>
            <Chip
              labelColor={chip.labelColor}
              backgroundColor={chip.backgroundColor}
              style={chip.style}>
              <Avatar size={32} backgroundColor={note.color}/>
              March, 13
            </Chip>
          </div>
          <DeleteIcon
              color={deleteIconColor}
              style={deleteIcon}
              onClick={this.removeStickyNote.bind(this)}
              onMouseEnter={this.onDeleteBtnMouseMove.bind(this, true)}
              onMouseLeave={this.onDeleteBtnMouseMove.bind(this, false)}/>
          <div style={noteContent}>
            <TextField
              ref={(input) => { this.note = input; }}
              onChange={this.onNoteUpdated.bind(this)}
              defaultValue={note.content}
              textareaStyle={textField.inputStyle}
              hintStyle={textField.hintStyle}
              hintText={"Your note here..."}
              underlineStyle={textField.underlineStyle}
              underlineFocusStyle={textField.underlineStyle}
              multiLine={true}/>
          </div>
      </Paper>
    );
  }
}

NotesWidget.propTypes = {
  index: PropTypes.number.isRequired,
  removeStickyNote: PropTypes.func.isRequired,
  onNoteUpdated: PropTypes.func.isRequired,
  note: PropTypes.object.isRequired,
};

export default NotesWidget;
