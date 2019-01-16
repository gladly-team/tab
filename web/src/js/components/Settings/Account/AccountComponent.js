import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { isInEuropeanUnion } from 'js/utils/client-location'
import { displayConsentUI } from 'js/ads/consentManagement'
import LogConsentData from 'js/components/Dashboard/LogConsentDataContainer'

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
      showDataPrivacyOption: false,
    }
  }

  async componentDidMount() {
    // See if we should show the data privacy choices option
    var isInEU
    try {
      isInEU = await isInEuropeanUnion()
    } catch (e) {
      isInEU = false
    }
    if (isInEU) {
      this.setState({
        showDataPrivacyOption: true,
      })
    }
  }

  reviewDataPrivacy() {
    displayConsentUI()
  }

  render() {
    const { user } = this.props
    return (
      <Paper>
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
        {this.state.showDataPrivacyOption ? (
          <span>
            <Divider />
            <AccountItem
              name={'Data privacy choices'}
              actionButton={
                <Button
                  color={'primary'}
                  variant={'raised'}
                  onClick={this.reviewDataPrivacy}
                >
                  Review choices
                </Button>
              }
            />
            {user ? <LogConsentData user={user} /> : null}
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
