import React from 'react';
import PropTypes from 'prop-types';

import FadeInAnimation from 'general/FadeInAnimation';

import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import DeleteIcon from 'material-ui/svg-icons/navigation/cancel';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import AddCircle from 'material-ui/svg-icons/content/add-circle';

import appTheme from 'theme/default';

class AddTodoForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hoveringCancel: false,
      hoveringCreate: false,
      hoveringAdd: false,
      show: false,
      errorText: 'Use Shift + Enter to create a new line.'
    }
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      if(!e.shiftKey){
        e.stopPropagation();
        e.preventDefault();
        this.create();
      }
    }
  }

  create() {
      const text = this.btext.input.refs.input.value;
      
      if(!text)
      return;

      this.props.addTodo(text);
      this.btext.input.value = '';
      this.closeForm();
  }

  onCancelBtnMouseMove(enter) {
    this.setState({
      hoveringCancel: enter,
    })
  }

  onCreateBtnMouseMove(enter) {
    this.setState({
      hoveringCreate: enter,
    })
  }

  onAddBtnMouseMove(enter) {
    this.setState({
      hoveringAdd: enter,
    })
  }

  closeForm() {
    this.setState({
      show: false,
      hoveringCancel: false,
      hoveringCreate: false,
      hoveringAdd: false,
    })
  }

  openForm() {
    this.setState({
      show: true,
      hoveringCancel: false,
      hoveringCreate: false,
      hoveringAdd: false,
    })
  }

  render() {

    if(!this.state.show) {
      const chip = {
        style: {
          margin: 5,
          borderRadius: 3,
        },
        backgroundColor: appTheme.palette.primary1Color,
        labelColor: '#FFF',
        addIcon: {
          cursor: 'pointer',
          float: 'right',
          margin: '4px -4px 0px 4px',
          hoverColor: appTheme.fontIcon.color,
          color: 'rgba(255,255,255,.3)',
          display: 'inline-block',
        }
      }

      var addIconColor = (this.state.hoveringAdd)?
                    chip.addIcon.hoverColor: chip.addIcon.color

      return (
        <FadeInAnimation>
          <Chip
            key={'todo-header-key'}
            backgroundColor={chip.backgroundColor}
            labelColor={chip.labelColor}
            style={chip.style}>
              Todos
              <div style={{display: 'inline', marginLeft: 10,}}>
                <AddCircle
                  color={addIconColor}
                  style={chip.addIcon}
                  onClick={this.openForm.bind(this)}
                  onMouseEnter={this.onAddBtnMouseMove.bind(this, true)}
                  onMouseLeave={this.onAddBtnMouseMove.bind(this, false)}/>
              </div>
          </Chip>
        </FadeInAnimation>
      );
    }

    const addTodoContainer = {
      display: 'flex',
      flexDirection: 'column',
      padding: 10,
      backgroundColor: appTheme.palette.primary1Color,
      borderRadius: 3,
      margin: 5,
    }

    const actionContainer = {
      display: 'flex',
      justifyContent: 'flex-end',
    }

    const formContainer = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: 10,
    }

    const textField = {
      underlineStyle: {
        borderColor: appTheme.textField.underlineColor,
      },
      underlineFocusStyle: {
        borderColor: appTheme.textField.underlineFocusStyle,
      },
      hintStyle: {
        color: appTheme.textField.underlineColor,
        fontSize: 14,
      },
      inputStyle: {
        color: '#FFF',
        fontSize: 14,
      },
      errorStyle: {
        color: appTheme.textField.underlineColor,
      }
    }

    const cancelIcon = {
      cursor: 'pointer',
      hoverColor: appTheme.fontIcon.color,
      color: 'rgba(255,255,255,.3)',
      display: 'inline-block',
    }

    var cancelIconColor = (this.state.hoveringCancel)?
                    cancelIcon.hoverColor: cancelIcon.color

    var createIconColor = (this.state.hoveringCreate)?
                    cancelIcon.hoverColor: cancelIcon.color

    return (
        <FadeInAnimation>
          <div 
            key={'add-todo-form-key'}
            style={addTodoContainer}>
              <div style={actionContainer}>
                <DeleteIcon
                  color={cancelIconColor}
                  style={cancelIcon}
                  onClick={this.closeForm.bind(this)}
                  onMouseEnter={this.onCancelBtnMouseMove.bind(this, true)}
                  onMouseLeave={this.onCancelBtnMouseMove.bind(this, false)}/>
                <CheckCircle
                  color={createIconColor}
                  style={cancelIcon}
                  onClick={this.create.bind(this)}
                  onMouseEnter={this.onCreateBtnMouseMove.bind(this, true)}
                  onMouseLeave={this.onCreateBtnMouseMove.bind(this, false)}/>
              </div>

              <div style={formContainer}>
                <TextField
                  ref={(input) => { this.btext = input; }}
                  multiLine={true}
                  onKeyPress = {this._handleKeyPress.bind(this)}
                  hintText="Your todo here..."
                  textareaStyle={textField.inputStyle}
                  hintStyle={textField.hintStyle}
                  underlineStyle={textField.underlineStyle}
                  underlineFocusStyle={textField.underlineFocusStyle}
                  errorStyle={textField.errorStyle}
                  errorText={this.state.errorText}/>
              </div>
          </div>
        </FadeInAnimation>);
  }
}

AddTodoForm.propTypes = {
  addTodo: PropTypes.func.isRequired,
};

AddTodoForm.defaultProps = {
};


export default AddTodoForm;
