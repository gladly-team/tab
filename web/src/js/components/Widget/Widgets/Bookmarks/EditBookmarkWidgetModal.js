import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

export default class DialogExampleModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nameRequiredError: false,
      urlRequiredError: false
    }
  }

  _handleKeyPress (e) {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.stopPropagation()
        e.preventDefault()
        this.props.onEditSave()
      }
    }
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

  render () {
    return (
      <Dialog
        title='Edit Bookmark'
        actionsContainerStyle={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
          // alignItems: 'flex-start'
        }}
        actions={[
          <FlatButton
            label='DELETE'
            primary
            style={{
              color: '#FF0000'
            }}
            onClick={this.props.onDeleteBookmark}
          />,
          <span>
            <FlatButton
              label='CANCEL'
              primary
              style={{
                margin: 2
              }}
              onClick={this.props.onEditCancel}
            />
            <RaisedButton
              label='SAVE'
              primary
              style={{
                margin: 2
              }}
              onClick={this.props.onEditSave}
            />
          </span>
        ]}
        modal
        open={this.props.open}
        contentStyle={{
          maxWidth: 500
        }}
      >
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <TextField
            ref={(input) => { this.bookmarkNameTextField = input }}
            onKeyPress={this._handleKeyPress.bind(this)}
            defaultValue={this.props.currentBookmarkName}
            hintText='Ex: Google'
            onChange={this.onNameValChange.bind(this)}
            errorText={this.state.nameRequiredError ? 'Enter a name' : null}
          />
          <TextField
            ref={(input) => { this.bookmarkLinkTextField = input }}
            onKeyPress={this._handleKeyPress.bind(this)}
            defaultValue={this.props.currentBookmarkLink}
            hintText='Ex: google.com'
            onChange={this.onURLValChange.bind(this)}
            errorText={this.state.urlRequiredError ? 'Enter a URL' : null}
          />
        </span>
      </Dialog>
    )
  }
}

DialogExampleModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onEditCancel: PropTypes.func.isRequired,
  onEditSave: PropTypes.func.isRequired,
  onDeleteBookmark: PropTypes.func.isRequired,
  currentBookmarkName: PropTypes.string.isRequired,
  currentBookmarkLink: PropTypes.string.isRequired
}

DialogExampleModal.defaultProps = {
}
