import React from 'react'
import PropTypes from 'prop-types'

import EditWidgetChip from '../../EditWidgetChip'
import TextField from 'material-ui/TextField'
import appTheme from 'theme/default'

class AddTodoForm extends React.Component {
  _handleKeyPress (e) {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.stopPropagation()
        e.preventDefault()
        this.create()
      }
    }
  }

  create () {
    const text = this.btext.input.refs.input.value

    if (!text) { return }

    this.props.addTodo(text)
    this.btext.input.value = ''
    this.closeForm()
  }

  render () {
    const textField = {
      underlineStyle: {
        borderColor: appTheme.textField.underlineColor
      },
      underlineFocusStyle: {
        borderColor: appTheme.textField.underlineFocusStyle
      },
      hintStyle: {
        color: appTheme.textField.underlineColor,
        fontSize: 14
      },
      inputStyle: {
        color: '#FFF',
        fontSize: 14
      },
      errorStyle: {
        color: appTheme.textField.underlineColor
      }
    }

    return (
      <EditWidgetChip
        widgetName={'Todos'}
        onWidgetAddIconClick={this.create.bind(this)}
        widgetAddFormElem={
          <span
            key={'widget-add-form-elem'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingBottom: 10
            }}
          >
            <TextField
              ref={(input) => { this.btext = input }}
              multiLine
              onKeyPress={this._handleKeyPress.bind(this)}
              hintText='Your todo here...'
              textareaStyle={textField.inputStyle}
              hintStyle={textField.hintStyle}
              underlineStyle={textField.underlineStyle}
              underlineFocusStyle={textField.underlineFocusStyle}
              errorStyle={textField.errorStyle}
              errorText={'Use Shift + Enter to create a new line.'}
            />
          </span>
        }
       />
    )
  }
}

AddTodoForm.propTypes = {
  addTodo: PropTypes.func.isRequired
}

AddTodoForm.defaultProps = {
}

export default AddTodoForm
