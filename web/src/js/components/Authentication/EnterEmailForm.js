import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import logger from 'js/utils/logger'
import { SEARCH_APP, TAB_APP } from 'js/constants'
import { updateUserEmail } from 'js/authentication/user'
import { replaceUrl, loginURL } from 'js/navigation/navigation'
import EmailField from '../General/EmailField'
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
      <Button
        data-test-id={'enter-email-form-button'}
        color={'primary'}
        variant={'contained'}
        onClick={props.buttonHandler}
        style={{ minWidth: 96 }}
      >
        {props.buttonText}
      </Button>
    </span>
  </Paper>
)

class EnterEmailForm extends React.Component {
  constructor(props) {
    super(props)
    this.emailFieldRef = null
    this.state = {
      emailDuplicate: false,
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
    console.log(error)
    if (error.code === 'auth/requires-recent-login') {
      replaceUrl(loginURL, {
        next: '/newtab/account',
        reauth: 'true',
      })
    } else if (error.code === 'auth/email-already-in-use') {
      this.setState({ emailDuplicate: true })
    }
  }

  submit() {
    const email = this.emailFieldRef.getValue()
    this.setState({
      emailDuplicate: false,
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

  onMutationCompleted(response) {
    const { onCompleted } = this.props
    this.setState({
      savingEmailInProgress: false,
    })
    const data = response.setEmail

    // Handle server-side validation errors.
    if (!data.user) {
      data.errors.forEach(err => {
        // Email already exists
        if (err.code === 'auth/email-already-in-use') {
          this.setState({
            emailDuplicate: true,
          })
          // Some other error
        } else {
          this.setState({
            otherError: true,
          })
        }
      })
      return
    }

    // Go to the app.
    onCompleted()
  }

  onMutationError(response) {
    logger.error(response)
    this.setState({
      savingEmailInProgress: false,
      otherError: true,
    })
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
    const { app, emailVerified } = this.props
    return this.state.verifyEmailSent ? (
      <PaperItem
        title="Verify Your New Email Address"
        text="Please check your email to verify your new address."
        buttonText="Resend Verification"
        buttonHandler={this.resubmit.bind(this)}
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
          otherError={this.state.otherError}
          onKeyPress={this.handleKeyPress.bind(this)}
          label={`Email for ${
            app === SEARCH_APP ? 'Search for a Cause' : 'Tab for a Cause'
          }`}
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

EnterEmailForm.propTypes = {
  app: PropTypes.oneOf([TAB_APP, SEARCH_APP]).isRequired,
  onCompleted: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
}

EnterEmailForm.defaultProps = {
  app: TAB_APP,
}

export default EnterEmailForm
