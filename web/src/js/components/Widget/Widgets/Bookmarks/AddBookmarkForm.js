import React from 'react';
import PropTypes from 'prop-types';

import FadeInAnimation from 'general/FadeInAnimation';

import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import DeleteIcon from 'material-ui/svg-icons/navigation/cancel';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import AddCircle from 'material-ui/svg-icons/content/add-circle';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';

import appTheme from 'theme/default';

class AddBookmarkForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hoveringCancel: false,
      hoveringCreate: false,
      hoveringAdd: false,
      hoveringEdit: false,
      show: false,
    }
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.create();
    }
  }

  create() {
      const name = this.bName.input.value;
      const link = this.bLink.input.value;
      
      if(!name || !link)
      return;

      this.props.addBookmark(name, link);
      this.bName.input.value = '';
      this.bLink.input.value = '';

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

  onEditBtnMouseMove(enter) {
    this.setState({
      hoveringEdit: enter,
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

  onEditModeClicked() {
    this.props.onEditModeClicked();
  }

  render() {

    if(!this.state.show) {
      const chip = {
        style: {
          margin: 5,
          borderRadius: 3,
        },
        labelStyle: {
          width: '100%',
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
                    chip.addIcon.hoverColor: chip.addIcon.color;

      var editIconColor = (this.state.hoveringEdit)?
                    chip.addIcon.hoverColor: chip.addIcon.color

      return (
        <FadeInAnimation>
          <Chip
            key={'bookmarks-header-key'}
            backgroundColor={chip.backgroundColor}
            labelColor={chip.labelColor}
            labelStyle={chip.labelStyle}
            style={chip.style}>
              Bookmarks
              <div style={{display: 'inline', marginLeft: 10,}}>
                <AddCircle
                color={addIconColor}
                style={chip.addIcon}
                onClick={this.openForm.bind(this)}
                onMouseEnter={this.onAddBtnMouseMove.bind(this, true)}
                onMouseLeave={this.onAddBtnMouseMove.bind(this, false)}/>
              <ModeEdit
                color={editIconColor}
                style={chip.addIcon}
                onClick={this.onEditModeClicked.bind(this)}
                onMouseEnter={this.onEditBtnMouseMove.bind(this, true)}
                onMouseLeave={this.onEditBtnMouseMove.bind(this, false)}/>
              </div>
          </Chip>
        </FadeInAnimation>
      );
    }

    const addBookmarkContainer = {
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
      style: {
        height: 35,
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
          key={'add-bookmark-form-key'}
          style={addBookmarkContainer}>
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
                ref={(input) => { this.bName = input; }}
                onKeyPress = {this._handleKeyPress.bind(this)}
                hintText="Ex: Google"
                style={textField.style}
                inputStyle={textField.inputStyle}
                hintStyle={textField.hintStyle}
                underlineStyle={textField.underlineStyle}
                underlineFocusStyle={textField.underlineFocusStyle}/>

              <TextField
                ref={(input) => { this.bLink = input; }}
                onKeyPress = {this._handleKeyPress.bind(this)}
                hintText="Ex: https://www.google.com/"
                style={textField.style}
                inputStyle={textField.inputStyle}
                hintStyle={textField.hintStyle}
                underlineStyle={textField.underlineStyle}
                underlineFocusStyle={textField.underlineFocusStyle}/>
            </div>
        </div>
      </FadeInAnimation>);
  }
}

AddBookmarkForm.propTypes = {
  addBookmark: PropTypes.func.isRequired,
  onEditModeClicked: PropTypes.func.isRequired,
};

AddBookmarkForm.defaultProps = {
};


export default AddBookmarkForm;
