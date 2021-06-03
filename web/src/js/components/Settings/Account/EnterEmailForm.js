import React from 'react'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { updateUserEmail } from 'js/authentication/user'
import {
  accountURL,
  constructUrl,
  loginURL,
  replaceUrl,
} from 'js/navigation/navigation'
import EmailField from 'js/components/General/EmailField'
import Typography from '@material-ui/core/Typography'

export const PaperItem = props => (
  <Paper
    elevation={1}
    style={{
      padding: 24,
      backgroundColor: '#FFF',
    }}
  >
    <span
      style={{
        fontSize: 20,
        fontWeight: 500,
      }}
    >
      {props.title}
    </span>
    <Typography variant={'body2'} style={{ paddingTop: 24, paddingBottom: 24 }}>
      {props.text}
    </Typography>
    <span
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: 4,
      }}
    >
      {' '}
      {props.buttonText ? (
        <Button
          data-test-id={'enter-email-form-button'}
          color={'primary'}
          variant={'contained'}
          onClick={props.buttonHandler}
          style={{ minWidth: 96 }}
        >
          {props.buttonText}
        </Button>
      ) : null}
    </span>
  </Paper>
)

class EnterEmailForm extends React.Component {
  constructor(props) {
    super(props)
    this.emailFieldRef = null
    this.state = {
      emailDuplicate: false,
      emailInvalid: false,
      otherError: false,
      savingEmailInProgress: false,
      verifyEmailSent: false,
      inputEmail: null,
    }
  }

  verifyEmailSent() {
    this.setState({ verifyEmailSent: true })
  }

  updateUserFailure(error) {
    if (error.code === 'auth/requires-recent-login') {
      replaceUrl(loginURL, {
        next: constructUrl(accountURL, { reauthed: true }),
        reauth: 'true',
      })
    } else if (error.code === 'auth/email-already-in-use') {
      this.setState({ emailDuplicate: true })
    } else if (error.code === 'auth/internal-error') {
      const errorMessage = JSON.parse(error.message)
      if (errorMessage.error.message === 'INVALID_NEW_EMAIL')
        this.setState({ emailInvalid: true })
    }
  }

  submit() {
    const email = this.emailFieldRef.getValue()
    this.setState({
      emailDuplicate: false,
      emailInvalid: false,
      otherError: false,
      inputEmail: email,
    })
    updateUserEmail(email)
      .then(() => this.verifyEmailSent())
      .catch(this.updateUserFailure.bind(this))
  }

  resubmit() {
    updateUserEmail(this.state.inputEmail)
      .then(() => this.verifyEmailSent())
      .catch(this.updateUserFailure)
  }

  handleKeyPress(e) {
    if (this.state.savingEmailInProgress) {
      return
    }

    if (e.key === 'Enter') {
      this.submit()
    }
  }

  render() {
    return this.state.verifyEmailSent ? (
      <PaperItem
        title="Verify Your New Email Address"
        text="Please check your email to verify your new address."
      />
    ) : (
      <Paper
        elevation={1}
        style={{
          padding: 24,
          backgroundColor: '#FFF',
        }}
      >
        <EmailField
          data-test-id={'enter-email-form-email-field'}
          ref={elem => {
            this.emailFieldRef = elem
          }}
          emailDuplicate={this.state.emailDuplicate}
          emailInvalid={this.state.emailInvalid}
          otherError={this.state.otherError}
          onKeyPress={this.handleKeyPress.bind(this)}
          label="New Email"
          style={{
            display: 'block',
            width: 280,
            minHeight: 84,
            marginTop: 20,
          }}
          fullWidth
          autoFocus
        />
        <span
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 4,
          }}
        >
          <Button
            data-test-id={'enter-email-form-button'}
            color={'primary'}
            variant={'contained'}
            disabled={this.state.savingEmailInProgress}
            onClick={this.submit.bind(this)}
            style={{ minWidth: 96 }}
          >
            {this.state.savingEmailInProgress ? 'Saving...' : 'Next'}
          </Button>
        </span>
      </Paper>
    )
  }
}

export default EnterEmailForm
