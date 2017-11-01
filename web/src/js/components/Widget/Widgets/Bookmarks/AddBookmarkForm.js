/* eslint no-useless-escape: 0 */

import React from 'react'
import PropTypes from 'prop-types'

import WidgetPieceWrapper from '../../WidgetPieceWrapper'
import TextField from 'material-ui/TextField'
import Chip from 'material-ui/Chip'
import DeleteIcon from 'material-ui/svg-icons/navigation/cancel'
import CheckCircle from 'material-ui/svg-icons/action/check-circle'
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle'
import ModeEditIcon from 'material-ui/svg-icons/editor/mode-edit'
import appTheme, {
  widgetEditButtonInactive,
  widgetEditButtonHover
} from 'theme/default'

class AddBookmarkForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      animating: false,
      editMode: false
    }
  }

  _handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.create()
    }
  }

  checkUrl (url) {
    const isUrl = (s) => {
      var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
      return regexp.test(s)
    }

    if (!isUrl(url)) {
      return 'http://' + url
    }
    return url
  }

  create () {
    const name = this.bName.input.value
    const link = this.checkUrl(this.bLink.input.value)

    if (!name || !link) { return }

    this.props.addBookmark(name, link)
    this.bName.input.value = ''
    this.bLink.input.value = ''

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
    if (this.state.editMode) {
      this.props.onEditModeClicked()
    }

    this.setState({
      animating: true,
      editMode: false
    })

    setTimeout(() => {
      this.setState({
        animating: false,
        show: true
      })
    }, 200)
  }

  onEditModeClicked () {
    this.setState({
      editMode: !this.state.editMode
    })

    this.props.onEditModeClicked()
  }

  render () {
    if (this.state.animating) {
      return (<div style={{height: 125}} />)
    }

    if (!this.state.show) {
      const chip = {
        style: {
          margin: 5,
          borderRadius: 3
        },
        labelStyle: {
          width: '100%'
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
            key={'bookmarks-header-key'}
            backgroundColor={chip.backgroundColor}
            labelColor={chip.labelColor}
            labelStyle={chip.labelStyle}
            style={chip.style}>
              Bookmarks
              <div style={{display: 'inline', marginLeft: 10}}>
                <AddCircleIcon
                  color={widgetEditButtonInactive}
                  hoverColor={widgetEditButtonHover}
                  style={chip.addIcon}
                  onClick={this.openForm.bind(this)}
                />
                <ModeEditIcon
                  color={widgetEditButtonInactive}
                  hoverColor={widgetEditButtonHover}
                  style={chip.addIcon}
                  onClick={this.onEditModeClicked.bind(this)}
                />
              </div>
          </Chip>
        </WidgetPieceWrapper>
      )
    }

    const addBookmarkContainer = {
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
      alignItems: 'center'
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
      style: {
        height: 35
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
          key={'add-bookmark-form-key'}
          style={addBookmarkContainer}>
          <div style={actionContainer}>
            <DeleteIcon
              color={widgetEditButtonInactive}
              hoverColor={widgetEditButtonHover}
              style={cancelIcon}
              onClick={this.closeForm.bind(this)}
            />
            <CheckCircle
              color={widgetEditButtonInactive}
              hoverColor={widgetEditButtonHover}
              style={cancelIcon}
              onClick={this.create.bind(this)}
            />
          </div>

          <div style={formContainer}>
            <TextField
              ref={(input) => { this.bName = input }}
              onKeyPress={this._handleKeyPress.bind(this)}
              hintText='Ex: Google'
              style={textField.style}
              inputStyle={textField.inputStyle}
              hintStyle={textField.hintStyle}
              underlineStyle={textField.underlineStyle}
              underlineFocusStyle={textField.underlineFocusStyle}
            />
            <TextField
              ref={(input) => { this.bLink = input }}
              onKeyPress={this._handleKeyPress.bind(this)}
              hintText='Ex: https://www.google.com/'
              style={textField.style}
              inputStyle={textField.inputStyle}
              hintStyle={textField.hintStyle}
              underlineStyle={textField.underlineStyle}
              underlineFocusStyle={textField.underlineFocusStyle}
            />
          </div>
        </div>
      </WidgetPieceWrapper>)
  }
}

AddBookmarkForm.propTypes = {
  addBookmark: PropTypes.func.isRequired,
  onEditModeClicked: PropTypes.func.isRequired
}

AddBookmarkForm.defaultProps = {
}

export default AddBookmarkForm
