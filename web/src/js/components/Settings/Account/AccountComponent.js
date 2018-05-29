import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { isInEuropeanUnion } from 'utils/client-location'
import { displayConsentUI } from 'ads/consentManagement'

export const AccountItem = (props) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    padding: 20
  }}
  >
    <Typography variant={'body2'} style={{ flex: 1 }}>{props.name}</Typography>
    { props.value
      ? <Typography variant={'body1'} style={{ flex: 2 }}>{props.value}</Typography>
      : null
    }
    { props.actionButton
      ? <div style={{ flex: 2 }}>{props.actionButton}</div>
      : null
    }
  </div>
)

AccountItem.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  actionButton: PropTypes.element
}

class Account extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showDataPrivacyOption: false
    }
  }

  async componentDidMount () {
    // See if we should show the data privacy choices option
    const isInEU = await isInEuropeanUnion()
    if (isInEU) {
      this.setState({
        showDataPrivacyOption: true
      })
    }
  }

  reviewDataPrivacy () {
    displayConsentUI()
  }

  render () {
    const { user } = this.props
    return (
      <Paper>
        <Typography variant={'headline'} style={{ padding: 20 }}>
          Account
        </Typography>
        <Divider />
        <AccountItem name={'Username'} value={user.username} />
        <Divider />
        <AccountItem name={'Email'} value={user.email} />
        { this.state.showDataPrivacyOption
          ? (
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
            </span>
          )
          : null
        }
      </Paper>
    )
  }
}

Account.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
  })
}

export default Account
