import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import initializeCMP from 'js/utils/initializeCMP'
import EnterUsernameForm from 'js/components/Authentication/EnterUsernameForm'
import tabCMP from 'tab-cmp'
import Dialog from '@material-ui/core/Dialog'
import EnterEmailForm from 'js/components/Authentication/EnterEmailForm'
import { TAB_APP } from 'js/constants'
import { checkIfEmailVerified } from 'js/authentication/helpers'
import { getUrlParameters } from 'js/utils/utils'
import { getCurrentURL } from 'js/navigation/utils'

export const AccountItem = props => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: 20,
    }}
  >
    <Typography variant={'body2'} style={{ fontWeight: 'bold', width: 260 }}>
      {props.name}
    </Typography>
    {props.value ? (
      <Typography variant={'body2'} style={{ flex: 2 }}>
        {props.value}
      </Typography>
    ) : null}
    {props.actionButton ? (
      <div style={{ flex: 1 }}>{props.actionButton}</div>
    ) : null}
  </div>
)

AccountItem.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  actionButton: PropTypes.element,
}

class Account extends React.Component {
  constructor(props) {
    super(props)
    const { verified } = getUrlParameters(getCurrentURL())
    this.state = {
      doesGDPRApply: false,
      doesCCPAApply: false,
      usernameOpen: false,
      usernameUpdated: false,
      emailOpen: verified ? verified : false,
      emailUpdated: false,
      emailVerified: verified ? verified : false,
    }
  }

  async componentDidMount() {
    await initializeCMP()

    // Determine if any data privacy frameworks apply.
    const doesGDPRApply = await tabCMP.doesGDPRApply()
    if (doesGDPRApply) {
      this.setState({
        doesGDPRApply: true,
      })
    }
    const doesCCPAApply = await tabCMP.doesCCPAApply()
    if (doesCCPAApply) {
      this.setState({
        doesCCPAApply: true,
      })
    }

    if(this.state.emailVerified) {
      checkIfEmailVerified()
    }
  }

  async openTCFConsentDialog() {
    await tabCMP.openTCFConsentDialog()
  }

  async openCCPAConsentDialog() {
    await tabCMP.openCCPAConsentDialog()
  }

  openUsernameDialog() {
    this.setState({ usernameOpen: true, usernameUpdated: false })
  }

  closeUsernameDialog() {
    this.setState({ usernameOpen: false })
  }

  usernameUpdated() {
    this.setState({ usernameUpdated: true })
  }

  openEmailDialog() {
    this.setState({ emailOpen: true, emailUpdated: false })
  }

  closeEmailDialog() {
    this.setState({ 
      emailOpen: false,
      emailVerified: false
    })
  }

  emailUpdated() {
    this.setState({ emailUpdated: true })
  }

  render() {
    const { user } = this.props
    return (
      <Paper elevation={1}>
        <Helmet>
          <title>Account</title>
        </Helmet>
        <Typography variant={'h5'} style={{ padding: 20 }}>
          Account
        </Typography>
        <Divider />
        <AccountItem
          name={'Username'}
          value={user.username ? user.username : 'Not signed in'}
          actionButton={
            <Button
              onClick={this.openUsernameDialog.bind(this)}
              variant={'text'}
            >
              Change
            </Button>
          }
        />
        <Divider />
        <AccountItem
          name={'Email'}
          value={user.email ? user.email : 'Not signed in'}
          actionButton={
            <Button onClick={this.openEmailDialog.bind(this)} variant={'text'}>
              Change
            </Button>
          }
        />
        {this.state.doesGDPRApply ? (
          <span>
            <Divider />
            <AccountItem
              name={'Data privacy choices'}
              actionButton={
                <Button
                  color={'default'}
                  variant={'contained'}
                  onClick={this.openTCFConsentDialog}
                >
                  Review choices
                </Button>
              }
            />
          </span>
        ) : null}
        {this.state.doesCCPAApply ? (
          <span>
            <Divider />
            <AccountItem
              name={'Ad personalization choices'}
              actionButton={
                <div>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a onClick={this.openCCPAConsentDialog}>
                    <Typography
                      variant={'body2'}
                      style={{ textDecoration: 'underline', cursor: 'pointer' }}
                      gutterBottom
                    >
                      Do Not Sell My Info
                    </Typography>
                  </a>
                  <Typography
                    variant={'caption'}
                    style={{
                      lineHeight: '1.16',
                      color: 'rgba(0, 0, 0, 0.54)',
                      maxWidth: '80%',
                    }}
                  >
                    This preference sets whether advertisers can personalize ads
                    to you. Personalized ads can be more interesting and often
                    raise more money for charity. We{' '}
                    <span style={{ fontWeight: 'bold' }}>never</span> sell
                    personal information like email addresses, nor do we collect
                    your browsing history on other sites.
                  </Typography>
                </div>
              }
            />
          </span>
        ) : null}
        <Dialog
          open={this.state.usernameOpen}
          onClose={this.closeUsernameDialog.bind(this)}
          aria-labelledby="form-dialog-title"
        >
          {this.state.usernameUpdated ? (
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
                Username Updated
              </span>
              <Typography
                variant={'body2'}
                style={{ paddingTop: 24, paddingBottom: 24 }}
              >
                Your username has been updated.
              </Typography>
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: 4,
                }}
              >
                <Button
                  data-test-id={'enter-username-form-button'}
                  color={'primary'}
                  variant={'contained'}
                  disabled={this.state.savingUsernameInProgress}
                  onClick={this.closeUsernameDialog.bind(this)}
                  style={{ minWidth: 96 }}
                >
                  Done
                </Button>
              </span>
            </Paper>
          ) : (
            <EnterUsernameForm
              onCompleted={this.usernameUpdated.bind(this)}
              user={user}
              app="tab"
            />
          )}
        </Dialog>
        <Dialog
          open={this.state.emailOpen}
          onClose={this.closeEmailDialog.bind(this)}
          aria-labelledby="form-dialog-title"
        >
          { this.state.emailVerified ? 
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
              Email Updated
            </span>
            <Typography
              variant={'body2'}
              style={{ paddingTop: 24, paddingBottom: 24 }}
            >
              Your email has been updated.
            </Typography>
            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 4,
              }}
            >
              <Button
                data-test-id={'enter-username-form-button'}
                color={'primary'}
                variant={'contained'}
                style={{ minWidth: 96 }}
                onClick={this.closeEmailDialog.bind(this)}
              >
                Done
              </Button>
            </span>
          </Paper> :
            <EnterEmailForm onCompleted={() => {}} app={TAB_APP} />
          }
        </Dialog>
      </Paper>
    )
  }
}

Account.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    username: PropTypes.string,
  }),
}

export default Account
