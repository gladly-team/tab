import React from 'react'
import PropTypes from 'prop-types'
import { Paper } from 'material-ui'
import environment from '../../../relay-env'
import UsernameField from 'js/components/General/UsernameField'
import RaisedButton from 'material-ui/RaisedButton'
import SetUsernameMutation from 'js/mutations/SetUsernameMutation'
import {
  setUsernameInLocalStorage
} from 'js/authentication/user'
import {
  checkIfEmailVerified
} from 'js/authentication/helpers'
import {
  goToDashboard
} from 'js/navigation/navigation'

class EnterUsernameForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      usernameDuplicate: false,
      otherError: false,
      savingUsernameInProgress: false
    }
  }

  componentDidMount () {
    // See if the user verified their email address so that we can
    // log the verification. It would be better to user a cloud
    // function for this, or at least an official callback from the
    // Firebase SDK, but Firebase does not yet support one. See:
    // https://stackoverflow.com/q/43503377
    // We also do this on the email verification screen, but it
    // may fail if Firebase is slow to update, so we're adding it
    // here to reduce the frequency that we fail to log the
    // verification.
    checkIfEmailVerified()
  }

  submit (e) {
    const usernameValid = this.username.validate()
    const username = this.username.getValue()
    this.setState({
      usernameDuplicate: false,
      otherError: false
    })
    if (usernameValid) {
      this.setState({
        savingUsernameInProgress: true
      })
      SetUsernameMutation(
        environment,
        this.props.user.id,
        username,
        this.onMutationCompleted.bind(this),
        this.onMutationError.bind(this)
      )
    }
  }

  onMutationCompleted (response) {
    this.setState({
      savingUsernameInProgress: false
    })
    const data = response.setUsername

    // Handle server-side validation errors.
    if (!data.user) {
      data.errors.forEach(err => {
        // Username already exists
        if (err.code === 'USERNAME_DUPLICATE') {
          this.setState({
            usernameDuplicate: true
          })
        // Some other error
        } else {
          this.setState({
            otherError: true
          })
        }
      })
      return
    }

    // Username saved successfully. Set the username in localStorage
    // and redirect to the app.
    setUsernameInLocalStorage(data.user.username)
    goToDashboard()
  }

  onMutationError (response) {
    // TODO: show better error message to the user
    console.error('Error saving username:', response)
    this.setState({
      savingUsernameInProgress: false,
      otherError: true
    })
  }

  handleKeyPress (e) {
    if (this.state.savingUsernameInProgress) { return }

    if (e.key === 'Enter') {
      this.submit()
    }
  }

  render () {
    return (
      <Paper
        zDepth={1}
        style={{
          padding: 24,
          backgroundColor: '#FFF'
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 500
          }}
        >
          Choose a username
        </span>
        <UsernameField
          usernameDuplicate={this.state.usernameDuplicate}
          otherError={this.state.otherError}
          onKeyPress={this.handleKeyPress.bind(this)}
          ref={(elem) => { this.username = elem }}
          style={{
            display: 'block'
          }}
          data-test-id={'enter-username-form-username-field'}
        />
        <span
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 30
          }}
          data-test-id={'enter-username-form-button-container'}
        >
          <RaisedButton
            label={this.state.savingUsernameInProgress ? 'SAVING...' : 'NEXT'}
            primary
            disabled={this.state.savingUsernameInProgress}
            onClick={this.submit.bind(this)}
          />
        </span>
      </Paper>
    )
  }
}

EnterUsernameForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string
  })
}

export default EnterUsernameForm
