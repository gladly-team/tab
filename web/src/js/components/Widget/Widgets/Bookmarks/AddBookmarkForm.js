/* eslint no-useless-escape: 0 */

import React from 'react'
import PropTypes from 'prop-types'

import EditWidgetChip from 'js/components/Widget/EditWidgetChip'
import TextField from 'material-ui/TextField'
import appTheme, {
  widgetEditButtonHover
} from 'js/theme/default'

class AddBookmarkForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      nameRequiredError: false,
      urlRequiredError: false
    }
  }

  _handleKeyPress (e) {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.stopPropagation()
        e.preventDefault()
        this.create()
      }
    }
  }

  openForm () {
    this.setState({
      open: true
    }, () => {
      this.focusInput()
    })
  }

  closeForm () {
    this.setState({
      open: false
    })
  }

  focusInput () {
    this.bookmarkNameTextField.focus()
  }

  onNameValChange () {
    const name = this.bookmarkNameTextField.input.value
    this.setState({
      nameRequiredError: !name
    })
  }

  onURLValChange () {
    const url = this.bLink.input.value
    this.setState({
      urlRequiredError: !url
    })
  }

  addProtocolToURLIfNeeded (url) {
    const hasProtocol = (s) => {
      var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
      return regexp.test(s)
    }

    if (!hasProtocol(url)) {
      return 'http://' + url
    }
    return url
  }

  create () {
    const name = this.bookmarkNameTextField.input.value
    const url = this.bLink.input.value

    if (!name) {
      this.setState({
        nameRequiredError: true
      })
    }
    if (!url) {
      this.setState({
        urlRequiredError: true
      })
    }
    if (!name || !url) { return }

    const link = this.addProtocolToURLIfNeeded(this.bLink.input.value)
    this.props.addBookmark(name, link)
    this.bookmarkNameTextField.input.value = ''
    this.bLink.input.value = ''

    this.closeForm()
  }

  render () {
    const textField = {
      underlineStyle: {
        borderColor: appTheme.textField.underlineColor
      },
      underlineFocusStyle: {
        borderColor: widgetEditButtonHover
      },
      hintStyle: {
        color: appTheme.textField.underlineColor,
        fontSize: 14
      },
      inputStyle: {
        color: '#FFF',
        fontSize: 14
      }
    }

    return (
      <EditWidgetChip
        open={this.state.open}
        widgetName={'Bookmarks'}
        onAddItemClick={this.openForm.bind(this)}
        onCancelAddItemClick={this.closeForm.bind(this)}
        onItemCreatedClick={this.create.bind(this)}
        showEditOption={this.props.showEditButton}
        onEditModeToggle={this.props.onEditModeToggle}
        editMode={this.props.editMode}
        widgetAddItemForm={
          <span
            key={'widget-add-form-elem'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingBottom: 20
            }}
          >
            <TextField
              ref={(input) => { this.bookmarkNameTextField = input }}
              onKeyPress={this._handleKeyPress.bind(this)}
              hintText='Ex: Google'
              style={textField.style}
              inputStyle={textField.inputStyle}
              hintStyle={textField.hintStyle}
              underlineStyle={textField.underlineStyle}
              underlineFocusStyle={textField.underlineFocusStyle}
              onChange={this.onNameValChange.bind(this)}
              errorText={this.state.nameRequiredError ? 'Enter a name' : null}
            />
            <TextField
              ref={(input) => { this.bLink = input }}
              onKeyPress={this._handleKeyPress.bind(this)}
              hintText='Ex: google.com'
              style={textField.style}
              inputStyle={textField.inputStyle}
              hintStyle={textField.hintStyle}
              underlineStyle={textField.underlineStyle}
              underlineFocusStyle={textField.underlineFocusStyle}
              onChange={this.onURLValChange.bind(this)}
              errorText={this.state.urlRequiredError ? 'Enter a URL' : null}
            />
          </span>
        }
      />
    )
  }
}

AddBookmarkForm.propTypes = {
  addBookmark: PropTypes.func.isRequired,
  onEditModeToggle: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  showEditButton: PropTypes.bool.isRequired
}

AddBookmarkForm.defaultProps = {
  showEditButton: true
}

export default AddBookmarkForm
