import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import tabCMP from 'tab-cmp'

export const AccountItem = props => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: 20,
    }}
  >
    <Typography variant={'body2'} style={{ flex: 1, fontWeight: 'bold' }}>
      {props.name}
    </Typography>
    {props.value ? (
      <Typography variant={'body2'} style={{ flex: 2 }}>
        {props.value}
      </Typography>
    ) : null}
    {props.actionButton ? (
      <div style={{ flex: 2 }}>{props.actionButton}</div>
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
    this.state = {
      doesGDPRApply: false,
      doesCCPAApply: false,
    }
  }

  async componentDidMount() {
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
  }

  async openTCFConsentDialog() {
    await tabCMP.openTCFConsentDialog()
  }

  async openCCPAConsentDialog() {
    await tabCMP.openCCPAConsentDialog()
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
        />
        <Divider />
        <AccountItem
          name={'Email'}
          value={user.email ? user.email : 'Not signed in'}
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
