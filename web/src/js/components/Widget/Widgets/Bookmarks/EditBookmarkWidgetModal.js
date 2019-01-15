import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { TwitterPicker } from 'react-color'

export default class EditBookmarkWidgetModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nameRequiredError: false,
      urlRequiredError: false,
      colorPickerColor: null,
    }
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.stopPropagation()
        e.preventDefault()
        this.save()
      }
    }
  }

  onNameValChange() {
    const name = this.bookmarkNameTextField.input.value
    this.setState({
      nameRequiredError: !name,
    })
  }

  onURLValChange() {
    const url = this.bookmarkLinkTextField.input.value
    this.setState({
      urlRequiredError: !url,
    })
  }

  setColor(colorInfo) {
    this.setState({
      colorPickerColor: colorInfo.hex,
    })
    this.props.setTemporaryColor(colorInfo.hex)
  }

  save() {
    const name = this.bookmarkNameTextField.input.value
    const url = this.bookmarkLinkTextField.input.value
    const color = this.state.colorPickerColor

    if (!name) {
      this.setState({
        nameRequiredError: true,
      })
    }
    if (!url) {
      this.setState({
        urlRequiredError: true,
      })
    }
    if (!name || !url) {
      return
    }
    this.props.onEditSave(name, url, color)
  }

  render() {
    return (
      <Dialog
        title="Edit Bookmark"
        actionsContainerStyle={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          // alignItems: 'flex-start'
        }}
        autoScrollBodyContent
        actions={[
          <FlatButton
            label="DELETE"
            primary
            style={{
              color: '#FF0000',
            }}
            onClick={this.props.onDeleteBookmark}
          />,
          <span>
            <FlatButton
              label="CANCEL"
              primary
              style={{
                margin: 2,
              }}
              onClick={this.props.onEditCancel}
            />
            <RaisedButton
              label="SAVE"
              primary
              style={{
                margin: 2,
              }}
              onClick={this.save.bind(this)}
            />
          </span>,
        ]}
        modal
        open={this.props.open}
        contentStyle={{
          maxWidth: 500,
        }}
      >
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <TextField
            ref={input => {
              this.bookmarkNameTextField = input
            }}
            onKeyPress={this._handleKeyPress.bind(this)}
            defaultValue={this.props.currentBookmarkName}
            hintText="Ex: Google"
            onChange={this.onNameValChange.bind(this)}
            errorText={this.state.nameRequiredError ? 'Enter a name' : null}
          />
          <TextField
            ref={input => {
              this.bookmarkLinkTextField = input
            }}
            onKeyPress={this._handleKeyPress.bind(this)}
            defaultValue={this.props.currentBookmarkLink}
            hintText="Ex: google.com"
            onChange={this.onURLValChange.bind(this)}
            errorText={this.state.urlRequiredError ? 'Enter a URL' : null}
          />
          <span
            style={{
              margin: 10,
            }}
          >
            <RaisedButton
              label="MOVE UP"
              default
              style={{
                margin: 2,
              }}
              onClick={this.props.onReorderMoveUp}
            />
            <RaisedButton
              label="MOVE DOWN"
              default
              style={{
                margin: 2,
              }}
              onClick={this.props.onReorderMoveDown}
            />
          </span>
          <span
            style={{
              margin: 10,
            }}
          >
            <TwitterPicker
              color={this.props.currentBookmarkColor}
              onChangeComplete={this.setColor.bind(this)}
              triangle={'hide'}
            />
          </span>
        </span>
      </Dialog>
    )
  }
}

EditBookmarkWidgetModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onEditCancel: PropTypes.func.isRequired,
  onEditSave: PropTypes.func.isRequired,
  onDeleteBookmark: PropTypes.func.isRequired,
  onReorderMoveUp: PropTypes.func.isRequired,
  onReorderMoveDown: PropTypes.func.isRequired,
  currentBookmarkName: PropTypes.string.isRequired,
  currentBookmarkLink: PropTypes.string.isRequired,
  currentBookmarkColor: PropTypes.string.isRequired,
}

EditBookmarkWidgetModal.defaultProps = {}
