import React from 'react'
import PropTypes from 'prop-types'

import WidgetPieceWrapper from '../../WidgetPieceWrapper'
import TextField from 'material-ui/TextField'
import Chip from 'material-ui/Chip'
import DeleteIcon from 'material-ui/svg-icons/navigation/cancel'
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle'
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle'
import appTheme, {
  widgetEditButtonInactive,
  widgetEditButtonHover
} from 'theme/default'

class AddTodoForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      errorText: 'Use Shift + Enter to create a new line.',
      animating: false
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

  create () {
    const text = this.btext.input.refs.input.value

    if (!text) { return }

    this.props.addTodo(text)
    this.btext.input.value = ''
    this.closeForm()
  }

  closeForm () {
    this.setState({
      animating: true
    })

    setTimeout(() => {
      this.setState({
        animating: false,
        show: false
      })
    }, 200)
  }

  openForm () {
    this.setState({
      animating: true
    })

    setTimeout(() => {
      this.setState({
        animating: false,
        show: true
      })
    }, 200)
  }

  render () {
    if (this.state.animating) {
      return (<div style={{height: 113}} />)
    }

    if (!this.state.show) {
      const chip = {
        style: {
          margin: 5,
          borderRadius: 3
        },
        backgroundColor: appTheme.palette.primary1Color,
        labelColor: '#FFF',
        addIcon: {
          cursor: 'pointer',
          float: 'right',
          margin: '4px -4px 0px 4px',
          hoverColor: appTheme.fontIcon.color,
          color: 'rgba(255,255,255,.3)',
          display: 'inline-block'
        }
      }

      return (
        <WidgetPieceWrapper>
          <Chip
            key={'todo-header-key'}
            backgroundColor={chip.backgroundColor}
            labelColor={chip.labelColor}
            style={chip.style}>
              Todos
              <div style={{display: 'inline', marginLeft: 10}}>
                <AddCircleIcon
                  color={widgetEditButtonInactive}
                  hoverColor={widgetEditButtonHover}
                  style={chip.addIcon}
                  onClick={this.openForm.bind(this)}
                />
              </div>
          </Chip>
        </WidgetPieceWrapper>
      )
    }

    const addTodoContainer = {
      display: 'flex',
      flexDirection: 'column',
      padding: 10,
      backgroundColor: appTheme.palette.primary1Color,
      borderRadius: 3,
      margin: 5
    }

    const actionContainer = {
      display: 'flex',
      justifyContent: 'flex-end'
    }

    const formContainer = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: 10
    }

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

    const cancelIcon = {
      cursor: 'pointer',
      hoverColor: appTheme.fontIcon.color,
      color: 'rgba(255,255,255,.3)',
      display: 'inline-block'
    }

    return (
      <WidgetPieceWrapper>
        <div
          key={'add-todo-form-key'}
          style={addTodoContainer}>
          <div style={actionContainer}>
            <DeleteIcon
              color={widgetEditButtonInactive}
              hoverColor={widgetEditButtonHover}
              style={cancelIcon}
              onClick={this.closeForm.bind(this)}
            />
            <CheckCircleIcon
              color={widgetEditButtonInactive}
              hoverColor={widgetEditButtonHover}
              style={cancelIcon}
              onClick={this.create.bind(this)}
            />
          </div>

          <div style={formContainer}>
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
              errorText={this.state.errorText} />
          </div>
        </div>
      </WidgetPieceWrapper>)
  }
}

AddTodoForm.propTypes = {
  addTodo: PropTypes.func.isRequired
}

AddTodoForm.defaultProps = {
}

export default AddTodoForm
