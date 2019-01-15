import React from 'react'
import PropTypes from 'prop-types'

import EditWidgetChip from 'js/components/Widget/EditWidgetChip'
import TextField from 'material-ui/TextField'
import appTheme, { widgetEditButtonHover } from 'js/theme/default'

class AddTodoForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      textRequiredError: false,
    }
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.stopPropagation()
        e.preventDefault()
        this.create()
      }
    }
  }

  openForm() {
    this.setState(
      {
        open: true,
      },
      () => {
        this.focusInput()
      }
    )
  }

  closeForm() {
    this.setState({
      open: false,
    })
  }

  focusInput() {
    this.todoTextField.focus()
  }

  validateTodoText() {
    const text = this.todoTextField.input.refs.input.value
    this.setState({
      textRequiredError: !text,
    })
  }

  create() {
    this.validateTodoText()

    const text = this.todoTextField.input.refs.input.value
    if (!text) {
      return
    }

    this.props.addTodo(text)
    this.todoTextField.input.value = ''
    this.closeForm()
  }

  render() {
    const textField = {
      underlineStyle: {
        borderColor: appTheme.textField.underlineColor,
      },
      underlineFocusStyle: {
        borderColor: widgetEditButtonHover,
      },
      hintStyle: {
        color: appTheme.textField.underlineColor,
        fontSize: 14,
      },
      inputStyle: {
        color: '#FFF',
        fontSize: 14,
      },
    }

    return (
      <EditWidgetChip
        open={this.state.open}
        widgetName={'Tasks'}
        onAddItemClick={this.openForm.bind(this)}
        onCancelAddItemClick={this.closeForm.bind(this)}
        onItemCreatedClick={this.create.bind(this)}
        widgetAddItemForm={
          <span
            key={'widget-add-form-elem'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingBottom: 20,
            }}
          >
            <TextField
              ref={input => {
                this.todoTextField = input
              }}
              multiLine
              onKeyPress={this._handleKeyPress.bind(this)}
              hintText="What do you need to do?"
              textareaStyle={textField.inputStyle}
              hintStyle={textField.hintStyle}
              underlineStyle={textField.underlineStyle}
              underlineFocusStyle={textField.underlineFocusStyle}
              onChange={this.validateTodoText.bind(this)}
              errorText={this.state.textRequiredError ? 'Enter a todo' : null}
            />
          </span>
        }
      />
    )
  }
}

AddTodoForm.propTypes = {
  addTodo: PropTypes.func.isRequired,
}

AddTodoForm.defaultProps = {}

export default AddTodoForm
